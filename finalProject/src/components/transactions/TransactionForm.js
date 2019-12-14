import React from 'react';

import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
////import 'jquery/dist/jquery'
//import 'bootstrap/dist/js/bootstrap.min.js';

class TransactionForm extends React.Component {
  setTransaction;

  constructor(props) {
    super(props);
    const {transaction, setTransaction} = props;
    this.setTransaction = setTransaction;
    console.log(transaction);
    this.state = {
      master: transaction, 
      id: transaction.id, 
      userId: transaction.userId,
      name: transaction.name,
      category: transaction.category ? transaction.category : 'food',
      description: transaction.description,
      isExpense: transaction.isExpense ? true : false,
      amount: transaction.amount,
      isPeriodical: transaction.isPeriodical ? false : true,
      type: transaction.type && transaction.isPeriodical ? 'daily' : transaction.type ,
      registrtionDate: transaction.registrtionDate,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    console.log(name, value);
    this.setState({
      [name]: value
    });
  }



  handleSubmit(event) {
    this.setTransaction({
      id: this.state.id, 
      userId: this.state.userId,
      name: this.state.name,
      category: this.state.category,
      description: this.state.description,
      isExpense: this.state.isExpense === 'true' ? true : false,
      amount: parseInt(this.state.amount),
      isPeriodical: this.state.isPeriodical == null ? false : this.state.isPeriodical,
      type: this.state.type,
      registrtionDate: this.state.registrtionDate
    });
    this.setState({
        id: '', 
        name: '',
        userId: '',
        category: 'food',
        description: '',
        isExpense: false,
        amount: 0,
        isPeriodical: false,
        type: '',
        registrtionDate: ''
    });
    event.preventDefault();
  }

  render() {
    return (
      <div className="container">
        <form class="user-add-edit-form">
          <div className="row">
            <div className="col-lg-12">
              <form onSubmit={this.handleSubmit}>

                {this.state.id && (
                  <div className="form-row">
                    <div className="form-group col-md-6 transaction-id">
                      <label>
                        ID:
                        <input className="form-control" type="text" name="id" value={this.state.id} onChange={this.handleChange} readOnly={true} disabled />
                      </label>
                    </div>
                  </div>)}
                <div className="form-row">
                  <div className="form-group col-sm-12 col-md-3">
                    <label htmlFor="isExpense">
                      Type:
                    </label>
                    <select className="form-control" id="isExpense" name="isExpense" value={this.state.isExpense} defaultValue="" onChange={this.handleChange} required>
                      <option value="" disabled hidden>Please Choose...</option>
                      <option value={false}>Income</option>
                      <option value={true}>Expense</option>
                    </select>
                  </div>
                  <div className="form-group  col-sm-12 col-md-3">
                    <label>
                      Categoty:
                    </label>
                    <select className="form-control" name="category" value={this.state.category} defaultValue="food" onChange={this.handleChange}>
                      <option value="food">Food</option>
                      <option value="clothes">Clothes</option>
                      <option value="groceries">Groceries</option>
                      <option value="bills">Bills</option>
                      <option value="coffee">Coffee</option>
                      <option value="freeTime">Free Time</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group  col-sm-12 col-md-3">
                    <label>
                      Is Periodical?
                      </label>
                      <input className="form-control" type="checkbox" name="isPeriodical" value={this.state.isPeriodical} onChange={this.handleChange} />
                  </div>
                  <div className="form-group  col-sm-12 col-md-3">
                    <label>
                      Period:
                    </label>
                    <select className="form-control" name="type" value={this.state.type} defaultValue="" onChange={this.handleChange}>
                      <option value="" hidden disabled>Please select...</option>
                      <option value="daily">Daily</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-4">
                    <label>
                      Name:
            <input className="form-control" type="text" name="name" value={this.state.name} onChange={this.handleChange} className="formControl" />
                    </label>
                  </div>
                  <div className="form-group  col-sm-12 col-md-4">
                    <label>
                      Description:
            <input className="form-control" type="text" name="description" value={this.state.description} onChange={this.handleChange} className="formControl" />
                    </label>
                  </div>
                  <div className="form-group  col-sm-12 col-md-4">
                    <label>
                      Amount:
            <input className="form-control" type="number" name="amount" step="0.01" value={this.state.amount} onChange={this.handleChange} />
                    </label>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-12">
                    <input className="btn btn-primary" type="submit" value="Submit" />
                    <button className="btn btn-secondary" onClick={this.props.onClose}>Close</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default TransactionForm;