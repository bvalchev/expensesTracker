import React from 'react';
import update from 'react-addons-update'; // ES6
import {Table, Row, Col, Button, Icon, Card } from 'react-materialize';
import Transaction from './Transaction';
import TransactionForm from './TransactionForm';
//import 'jQuery/lib/node-jquery.js'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

let userId = JSON.parse(localStorage.getItem('currentUser')) ? JSON.parse(localStorage.getItem('currentUser')).user.id : -1;
const API_URL = 'http://localhost:9000/api/transaction/' + userId + '/transactions';

class TransactionList extends React.Component {
    state = {
        transactions: [],
        filterName: '',
        filterCategory: '',
        filterIsExpense: '',
        filterIsPeriodical: '',
        showAddForm: false,
        editMode: true,
        editedTransaction: undefined
    }

    constructor(props) {
        super(props);
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
                this.setState({transactions: transactions.data});
            });
    }

    handleFilterChange = (event) => {
        const target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        /*if(value =='false'){
            value = f
        } */
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
            // article.id = '' + Date.now();
            console.log(transaction);
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
        this.setState({showAddForm: false});
    }

    renderTransaction(){
        console.log(this.state.transactions);
        if(!this.state.transactions || this.state.transactions.length == 0){
            return;
        }
        
       
    
    }

    render() {
        return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-12 col-md-12">
                {this.state.showAddForm && <TransactionForm transaction={this.state.editedTransaction} setTransaction={this.setTransaction}/>}
            </div>
            <div className="col-sm-12 col-md-12">
            
                  <div>
                      <button waves="light" onClick={() => {
                          this.setState({editedTransaction: {}});
                          this.setState({showAddForm : true}); 
                          this.setState({editMode: false}); 
                      } }>
                          Add User
                      </button>
                      {this.state.showAddForm ? <button className = "btn btn-secondary" onClick={() => {
                          this.setState({showAddForm : false}); 
                      } }>Close</button> : ''}
                  </div>
                  <div className="col-md-12">
                      <h2>Filter Section</h2>
                      <div className ="col-md-3"> 
                        <label>Filter by name</label>
                        <input name="filterName" value={this.state.filterName} onChange={this.handleFilterChange}></input>
                      </div>
                      <div className ="col-md-3"> 
                        <label>Filter by category</label>
                        <select name="filterCategory" value={this.state.filterCategory} defaultValue="" onChange={this.handleFilterChange}>
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
                        <select className="form-control" id="filterIsExpense" name="filterIsExpense" value={this.state.filterIsExpense} defaultValue = "" onChange={this.handleFilterChange} required>
                            <option value="">All</option>
                            <option value={false}>Income</option>
                            <option value={true}>Expense</option>
                        </select>
                      </div>
                      <div className ="col-md-3"> 
                        <label>Filter periodical</label>
                        <select className="form-control" id="filterIsPeriodical" name="filterIsPeriodical" value={this.state.filterIsPeriodical} defaultValue = "" onChange={this.handleFilterChange} required>
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
          <Transaction key={transaction.id} transaction={transaction} onEditClick={this.onEditClick} removeTransaction={this.removeTransaction} editCallback={() => {
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