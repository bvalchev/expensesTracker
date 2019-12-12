import React from 'react';
import Transaction from './Transaction';
import TransactionForm from './TransactionForm';
//import 'jQuery/lib/node-jquery.js'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

let userId = JSON.parse(localStorage.getItem('currentUser')) ? JSON.parse(localStorage.getItem('currentUser')).user.id : -1;
let API_URL = 'http://localhost:9000/api/transaction/' + userId + '/transactions';

class TransactionList extends React.Component {
    state = {
        transactions: [],
        filterName: '',
        filterCategory: '',
        filterIsExpense: '',
        filterIsPeriodical: '',
        showAddForm: false,
        editMode: true,
        editedTransaction: undefined,
        transctionsSum: 0,
        userEmail: 'default'
    }

    constructor(props) {
        super(props);
        userId = JSON.parse(localStorage.getItem('currentUser')) ? JSON.parse(localStorage.getItem('currentUser')).user.id : -1;
        API_URL = 'http://localhost:9000/api/transaction/' + userId + '/transactions';
        fetch(API_URL, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-access-token':  JSON.parse(localStorage.getItem('currentUser')).token
              }
        })
            .then(resp => resp.json())
            .then(transactions => {
                console.log(transactions.data);
                if(transactions.data == null){
                    alert('Not logged in');
                    //this.props.history.push({pathname: '/login',state: { some: 'login' }})
                }
                  transactions.data.forEach(function(transaction){
                        let isForInsert = false;
                        let dateForInsert = '';
                        if(transaction.isPeriodical){
                            let now = new Date();
                            if(transaction.type === 'daily'){
                                let startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDay())
                                if(transaction.lastDateInserted && (Date.parse(transaction.lastDateInserted) < startOfDay)){
                                    isForInsert = true;
                                    dateForInsert = startOfDay;
                                }
                            }
                            if(transaction.type === 'monthly'){
                                let thisMonth = new Date(now.getFullYear(), now.getMonth(), 0)
                                if(transaction.lastDateInserted && new Date(transaction.lastDateInserted) < thisMonth){
                                    isForInsert = true
                                    dateForInsert = thisMonth;
                                }
                            } 
                            if(transaction.type === 'yearly'){
                                let thisYear = new Date(now.getFullYear(), 0, 0)
                                if(transaction.lastDateInserted && new Date(transaction.lastDateInserted) < thisYear){
                                    isForInsert = true
                                    dateForInsert = thisYear;
                                }
                            }  
                            if(isForInsert){
                            
                                let transactionToInsert = JSON.parse(JSON.stringify(transaction));
                                transactionToInsert.id = '';
                                transactionToInsert.name = 'Periodical transaction for ' + transaction.name;
                                transactionToInsert.type = '';
                                transactionToInsert.isPeriodical = false;
                                transactionToInsert.publicationDate = new Date();
                                transaction.lastDateInserted = new Date();

                                fetch(API_URL, {
                                    method: 'POST', // or 'PUT'
                                    body: JSON.stringify(transactionToInsert), // data can be `string` or {object}!
                                    headers:{
                                      'Content-Type': 'application/json',
                                      'x-access-token':  JSON.parse(localStorage.getItem('currentUser')).token
                                    }
                                  }).then(res => res.json())
                                  .catch(error => console.error('Error:', error))
                                  .then(a => {
                                    if(a.message){
                                        alert(a.message);
                                        return;
                                    }
                                  })
                                  .catch(error => console.error('Error:', error));

                                fetch(API_URL + '/' + transaction.id, {
                                    method: 'PUT',
                                    body: JSON.stringify(transaction), // data can be `string` or {object}!
                                    headers:{
                                      'Content-Type': 'application/json',
                                      'x-access-token':  JSON.parse(localStorage.getItem('currentUser')).token
                                    }
                                  }).then(res => res.json())
                                  .catch(error => console.error('Error:', error))
                                  .then(a => {
                                    if(a.message){
                                        alert(a.message);
                                        return;
                                    }
                                  })
                                  .catch(error => console.error('Error:', error));
                            }                    
                      }
                  })
               
                var currenttransactionsSum = 0;
                transactions.data.forEach(function(transaction){
                    transaction.isExpense ? currenttransactionsSum -= transaction.amount : currenttransactionsSum += transaction.amount;
                });
                
                
                this.setState({
                    transactions: transactions.data, 
                    transactionsSum: currenttransactionsSum
                });
            });
    }

    componentDidMount(){
        this.getUserEmail()
    }

    sendNotificationIfNeeded(){
        /*function check(_callback){
            _callback();
        }*/
        
        fetch('http://localhost:9000/api/planDetail/' + userId + '/plans', {
                    method: 'GET',
                    headers:{
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'x-access-token':  JSON.parse(localStorage.getItem('currentUser')).token
                      }
                })
                    .then(resp => resp.json())
                    
                    .then(plans => {  
                        if(plans.data == null){
                            alert('You are not logged in')
                            //this.props.history.push({pathname: '/login',state: { some: 'login' }})
                        }
                        console.log(plans.data);
                        plans.data.forEach((singlePlan) => {
                            if(singlePlan.amount > this.state.transctionsSum){
                                //var userEmail = 
                                let emailInfo = {};
                                emailInfo.email = this.state.userEmail;
                                emailInfo.plan = singlePlan.name;
                                emailInfo.amount = singlePlan.amount;
                                fetch('http://localhost:4444/completed-plans', {
                                    method: 'POST',
                                    body: JSON.stringify(emailInfo), // data can be `string` or {object}!
                                    headers:{
                                      'Content-Type': 'application/json'
                                    }
                                  }).then(res => res.json())
                                  .catch(error => console.error('Error:', error))
                                  .then(a => {
                                    if(a.message){
                                        alert(a.message);
                                        return;
                                    }
                                  })
                                  .catch(error => console.error('Error:', error));
                            }
                        })
                    });
    };

    getUserEmail(){
        fetch('http://localhost:9000/api/users/' + userId, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-access-token':  JSON.parse(localStorage.getItem('currentUser')).token
              }
        })
            .then(resp => resp.json())
            .then(users => {
                console.log(users);
                if(users == null){
                    alert('You are not logged in or you do not have permission to see users');
                   // this.props.history.push({pathname: '/login',state: { some: 'login' }})
                }
                if(users){
                    console.log(users.email)
                    this.setState({userEmail: users.username})
                }else{
                    console.log('pedal');
                }
            });
    }

    handleFilterChange = (event) => {
        const target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        if(value === 'false'){
            value = false
        }else if(value === 'true'){
            value = true;
        }
        const name = target.name;
    
        console.log(name, value);
        this.setState({
          [name]: value
        });
        this.filterTransactions();
      }

    filterTransactions(){
        fetch(API_URL, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-access-token':  JSON.parse(localStorage.getItem('currentUser')).token
              }
        })
            .then(resp => resp.json())
            .then(transactions => {
                console.log(transactions.data);
                if(transactions.data == null){
                    alert('Not logged in');
                    //this.props.history.push({pathname: '/login',state: { some: 'login' }})
                  }
                let filteredTransactions = []
                let _this= this
                transactions.data.forEach(function(transaction){
                    let isResult = true
                    if(_this.state.filterName !== '' && transaction.name.indexOf(_this.state.filterName) === -1){
                        isResult = false;
                    }
                    if(_this.state.filterIsExpense !== '' && transaction.isExpense !== _this.state.filterIsExpense){
                        isResult = false; 
                    }
                    if(_this.state.filterCategory !== '' && transaction.category !== _this.state.filterCategory){
                        isResult = false;
                    }
                    if(_this.state.filterIsPeriodical !== '' && transaction.isPeriodical !== _this.state.filterIsPeriodical){
                        isResult = false; 
                    }
                    if(isResult){
                        filteredTransactions.push(transaction);
                    }
                })
                this.setState({transactions: filteredTransactions});
            });
    }

    removeTransaction = (transaction) => {
        fetch(API_URL + "/" + transaction.id, {
            method: 'DELETE',
            headers: {
                'x-access-token':  JSON.parse(localStorage.getItem('currentUser')).token
            }
          }).then(res => res.json())
          .catch(error => console.error('Error:', error))
          .then(a => {
            console.log(this.state.transactions);
            console.log("A: " + a);
            let index = this.state.transactions.indexOf(transaction);
           this.state.transactions.splice(index, 1);
            console.log("Index: " + index);
            this.setState(s => ({ transactions: this.state.transactions}));
            console.log('Deleted transaction:', JSON.stringify(a))
          })
          .catch(error => console.error('Error:', error));
         
    
             this.setState({showAddForm: false});
    }


    setTransaction = (transaction) => {
        this.getUserEmail();
        if(this.state.editMode) {
            console.log(transaction);
            fetch(API_URL + '/' + transaction.id, {
                method: 'PUT',
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
                let newTransactionsArray = this.state.transactions.map(singleTransaction => (singleTransaction.id === transaction.id ? a : singleTransaction));

                this.setState({
                    transactions: newTransactionsArray
                });
                console.log('Updated transaction:', JSON.stringify(a))
              })
              .catch(error => console.error('Error:', error));
            
        } else {
            fetch(API_URL, {
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
                this.setState(s => ({ transactions: [...s.transactions, a] }));
                console.log('Created new transaction:', JSON.stringify(a))
              })
              .catch(error => console.error('Error:', error));
             
        }
        this.sendNotificationIfNeeded();
        this.setState({showAddForm: false});
    }

    onCloseFormClick(){
        this.setState({showAddForm : false})
    }

    render() {
        return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12 col-md-12">
                {this.state.showAddForm && <TransactionForm transaction={this.state.editedTransaction} setTransaction={this.setTransaction} onClose={this.onCloseFormClick.bind(this)}/>}
            </div>
            <div className="col-sm-12 col-md-12">
            
                  <div>
                      <button className="btn btn-success" waves="light" style={{marginBottom: '1em'}} onClick={() => {
                          this.setState({editedTransaction: {}});
                          this.setState({showAddForm : true}); 
                          this.setState({editMode: false}); 
                      } } hidden={this.state.showAddForm}>
                          Add Transaction
                      </button>
                  </div>
                  <div className="col-md-12">
                      <h2>Filter Section</h2>
                      <div className ="col-md-3"> 
                        <label>Filter by name</label>
                        <input name="filterName" value={this.state.filterName} onChange={this.handleFilterChange}></input>
                      </div>
                      <div className ="col-md-3"> 
                        <label>Filter by category</label>
                        <select name="filterCategory" value={this.state.filterCategory} onChange={this.handleFilterChange}>
                            <option value="">Please select category to filter</option>
                            <option value="food">Food</option>
                            <option value="clothes">Clothes</option>
                            <option value="groceries">Groceries</option>
                            <option value="bills">Bills</option>
                            <option value="coffee">Coffee</option>
                            <option value="freeTime">Free Time</option>
                            <option value="income">Income</option>
                        </select>
                      </div>
                      <div className ="col-md-3"> 
                        <label>Filter expenses</label>
                        <select className="form-control" id="filterIsExpense" name="filterIsExpense" value={this.state.filterIsExpense} onChange={this.handleFilterChange} required>
                            <option value="">All</option>
                            <option value={false}>Income</option>
                            <option value={true}>Expense</option>
                        </select>
                      </div>
                      <div className ="col-md-3"> 
                        <label>Filter periodical</label>
                        <select className="form-control" id="filterIsPeriodical" name="filterIsPeriodical" value={this.state.filterIsPeriodical} onChange={this.handleFilterChange} required>
                            <option value="">All</option>
                            <option value={false}>Is not periodical</option>
                            <option value={true}>Is periodical</option>
                        </select>
                      </div>
                  </div> 
                  <div className = "col-md-12">
                  <table className="table table-bordered table-responsive-md table-striped text-center">
                      <thead>
                          <tr>
                              <th className="text-center">Name</th>
                              <th className="text-center">Description</th>
                              <th className="text-center">Is expense?</th>
                              <th className="text-center">Category</th>
                              <th className="text-center">Amount</th>
                              <th className="text-center">Periodical</th>
                              <th className="text-center">Type</th>
                              <th className="text-center">Publication date</th>
                              <th className="text-center">Actions</th>

                          </tr>
                      </thead>
                      <tbody>
                          { this.state.transactions.map(transaction => (
          <Transaction key={transaction.id} transaction={transaction} shouldDisableEditButton={this.state.showAddForm || this.editMode} onEditClick={this.onEditClick} removeTransaction={this.removeTransaction} editCallback={() => {
              this.setState({editedTransaction: transaction});
              this.setState({showAddForm : true}); 
              this.setState({editMode: true}); 
          } }/>
          ))}
                      </tbody>
                  </table>
                </div>
          </div>
        </div>
      </div>
        );
    }
}

export default TransactionList;