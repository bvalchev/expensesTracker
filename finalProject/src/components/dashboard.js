import React from 'react';
import update from 'react-addons-update'; // ES6
import {Line, Pie} from 'react-chartjs-2';
import {Table, Row, Col, Button, Icon, Card } from 'react-materialize';

//import 'jQuery/lib/node-jquery.js'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

let userId = JSON.parse(localStorage.getItem('currentUser')) ? JSON.parse(localStorage.getItem('currentUser')).user.id : -1;


console.log(userId);
const categoriesNames = ['food', 'clothes', 'groceries', 'bills', 'coffee', 'freeTime'];

const PLANS_URL = 'http://localhost:9000/api/planDetail/' + userId + '/plans';
const TRANSACTION_URL = 'http://localhost:9000/api/transaction/' + userId + '/transactions';
class Dashboard extends React.Component {
    state = {
        transactions: [],
        plans: [], 
        yearly: 0,
        weekly: 0,
        monthly: 0,
        daily: 0,
        balance: 0,
        categoriesValuesArray: [],
        monthlyValuesArray: []
    }

    constructor(props) {
        super(props);
        this.fetchData = this.fetchData.bind(this);
        this.getBalance = this.getBalance.bind(this);
        this.getCategoriesValues = this.getCategoriesValues.bind(this);
        this.getMonthlyValues = this.getMonthlyValues.bind(this);
        this.fetchData(TRANSACTION_URL, 'transactions');
        this.fetchData(PLANS_URL, 'plans');      
    }

    fetchData(url, stateName){
        fetch(url, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-access-token':  JSON.parse(localStorage.getItem('currentUser')).token
              }
        })
            .then(resp => resp.json())
            .then(response => {
                console.log(response.data);
                /*if(response.data == null){
                  this.props.history.push({pathname: '/login',state: { some: 'login' }})
                }*/
                if(stateName === 'transactions'){
                    this.setState({transactions: response.data});
                    this.getBalance(response.data)
                    this.getCategoriesValues(response.data);
                    this.getMonthlyValues(response.data);
                }else{
                    this.setState({plans: response.data});
                }
                
            });
    }



    handlePeriodicalTransactions(transaction){
      
      fetch(TRANSACTION_URL, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(transaction), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json',
          'x-access-token':  JSON.parse(localStorage.getItem('currentUser')).token
        }
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(a => {
        if(a.message){
            console.log(a)
           // let jsonMessage = JSON.parse(a.message);
            alert(a.message);
            return;
        }
        this.getBalance([...this.state.transactions, a]);
        this.setState(s => ({ transactions: [...s.transactions, a] }));
        console.log('Created new transaction:', JSON.stringify(a))
      })
      .catch(error => console.error('Error:', error));
    }

    getBalance(transactions){
        let yearlySum = 0;
        let monthlySum = 0;
        let weeklySum = 0;
        let dailySum = 0;
        let balance = 0;
        transactions.forEach(function(transaction){
            let publicationDate = new Date(transaction.registrationDate);
            let today = new Date();
            let  currYear = today.getFullYear();
            let currMonth = today.getMonth();
            let yearAgo = new Date(currYear, 0, 0); 
            let monthAgo = new Date(currYear, currMonth, 0)
            let weekAgo =  new Date(today.getTime()-1000*60*60*24*7);
            console.log(monthAgo, weekAgo);
            transaction.isExpense ? balance -= parseFloat(transaction.amount) : balance += parseFloat(transaction.amount)
            if(publicationDate < today){
              if(publicationDate > yearAgo){
                transaction.isExpense ? yearlySum -= parseFloat(transaction.amount) : yearlySum += parseFloat(transaction.amount)
              }
              if(publicationDate > monthAgo){
                transaction.isExpense ? monthlySum -= parseFloat(transaction.amount) : monthlySum += parseFloat(transaction.amount)
              }
              if(publicationDate > weekAgo){
                  transaction.isExpense ? weeklySum -= parseFloat(transaction.amount) : weeklySum += parseFloat(transaction.amount)
              }
              if(publicationDate.getDay() == today.getDay())
                transaction.isExpense ? dailySum -= parseFloat(transaction.amount) : dailySum += parseFloat(transaction.amount)
            }
        })
        this.setState({
            balance: balance,
            yearly: yearlySum,
            monthly: monthlySum,
            weekly: weeklySum,
            daily: dailySum
        });
    }

    getCategoriesValues(transactions){
      let categoriesValuesArray = [0, 0, 0, 0, 0, 0];
      transactions.forEach(function(transaction){
        for(let i=0; i<6; i++){
          if(transaction.category === categoriesNames[i]){
            categoriesValuesArray[i] += parseFloat(transaction.amount)
          }
        }
      })
      console.log(categoriesValuesArray);
      this.setState({categoriesValuesArray: categoriesValuesArray});
    }

    getMonthlyValues(transactions){
      let monthlyValues = [0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ,0, 0];
      let currYear = new Date().getFullYear();
      transactions.forEach(function(transaction){
        for(let i=0; i<12; i++){
          if(new Date(transaction.registrationDate) >  new Date(currYear, i, 0) && new Date(transaction.registrationDate) <  new Date(currYear, i+1, 0)){
            transaction.isExpense ?  monthlyValues[i] -= parseFloat(transaction.amount) : monthlyValues[i] += parseFloat(transaction.amount)
          }
        }
      })
      console.log(monthlyValues);
      this.setState({monthlyValuesArray: monthlyValues});
    }

    accomplishPlan(plan){
      let transaction = {
        id: '', 
        name: plan.name,
        userId: plan.userId,
        category: 'plan',
        description: plan.description,
        isExpense: true,
        amount: plan.amount,
        isPeriodical: false,
        type: '',
      }
      fetch(TRANSACTION_URL, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(transaction), // data can be `string` or {object}!
        headers:{
          'Content-Type': 'application/json',
          'x-access-token':  JSON.parse(localStorage.getItem('currentUser')).token
        }
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(a => {
        if(a.message){
            console.log(a)
           // let jsonMessage = JSON.parse(a.message);
            alert(a.message);
            return;
        }
        this.getBalance([...this.state.transactions, a]);
        this.setState(s => ({ transactions: [...s.transactions, a] }));
        console.log('Created new transaction:', JSON.stringify(a))
      })
      .catch(error => console.error('Error:', error));
     

      fetch(PLANS_URL + "/" + plan.id, {
        method: 'DELETE',
        headers: {
          'x-access-token':  JSON.parse(localStorage.getItem('currentUser')).token
        }
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(a => {
        let index = this.state.plans.indexOf(plan);
        this.state.plans.splice(index, 1);
         this.setState(s => ({ plans: this.state.plans}));
        console.log('Deleted plan:', JSON.stringify(a))
      })
      .catch(error => console.error('Error:', error));

      
      this.forceUpdate();
    }

    render(){
        return(
        <div className="container-fluid">

         
          

          <div className="row">
            <div className="col-md-12 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                  <div className="card-body">
                    <div className="row no-gutters align-items-center">
                      <div className="col mr-2" style={{textAlign: 'center', color: 'green'}}>
                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Current</div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800"  >${this.state.balance}</div>
                      </div>
                      <div className="col-auto">
                        <i className="fas fa-calendar fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            
            
            <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Daily Balance</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">${this.state.daily}</div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-calendar fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-success shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-success text-uppercase mb-1">Weekly Balance</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">${this.state.weekly}</div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-info shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Monthly Balance</div>
                      <div className="row no-gutters align-items-center">
                        <div className="col-auto">
                          <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">${this.state.monthly}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-clipboard-list fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

           
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="card border-left-warning shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Yearly Balance</div>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">${this.state.yearly}</div>
                    </div>
                    <div className="col-auto">
                      <i className="fas fa-comments fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*----------------Plan element------------------*/}
            <div className="row">
                {this.state.plans.map(plan => {return (<div key={plan.id} className="card card col-sm-12 col-md-4">
                    <div className="card-body">
                      <h3 style={{color: 'orange'}} className="card-title"><a>{plan.name}</a></h3>
                      <p className="card-text">{plan.description}</p>
                      <p className="card-text">Target: {plan.endDate}</p>
                      <p style={{color: 'green', fontWeight: 'bold', fontSize: '1.5em'}}>Money left to accompish: ${(plan.amount - this.state.balance) > 0 ? plan.amount - this.state.balance : 0}</p>
                      <button className="btn btn-primary" disabled={(plan.amount - this.state.balance)> 0} onClick={this.accomplishPlan.bind(this, plan)}>Mark as accomplished</button>
                    </div>
                </div>)})}
            </div>
            <div className = "row">
                <div className="col-lg-6"  style={{textAlign: 'center'}}>
                <h3>Monthly balance graphic</h3>
                <div>
                    <Line
                    height={300}
                    data={
                    {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Semptember', 'October', 'Novemver', 'December'],
                    datasets: [{
                        label: 'Last year balance divided in months',
                        borderColor: "rgba(54, 162, 235, 1)",
                        backgroundColor: "rgba(54, 162, 235, 1)",
                        fill: false,
                        data: this.state.monthlyValuesArray
                    }]
                    }
                }
                    options={{ maintainAspectRatio: false }}
                    
                    />
                    </div>
                </div>
                <div className="col-lg-6"  style={{textAlign: 'center'}}>
                <h3>Expenses by categories</h3>
                <div>
                    <Pie
                     height= {300}
                    data={
                    {
                    labels: ['Food', 'Clothes', 'Groceries', 'Bills', 'Coffee', 'Free Time'],
                    datasets: [{
                        borderColor: ['rgba(204,66,51, 1)', 'rgba(	24,236,83,1)', 'rgba(195,195,195,1)'], // Add custom color border 
                        backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(	24,236,83,0.5)', 'red', 'green', 'orange', 'purple'],
                        fill: false,
                        data: this.state.categoriesValuesArray
                    }]
                    }
                }
                    options={{  
                    
                 
                  responsive: true, // Instruct chart js to respond nicely.
                  maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
                }}
                    
                    />
                    </div>
                </div>
            </div>
            
        </div>
        )
    }
}

export default Dashboard