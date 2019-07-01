import React from 'react';
import { Row, Col, Button, Icon, Form, TextInput, Select  } from 'react-materialize';

import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/js/bootstrap.js';
////import 'jquery/dist/jquery'
//import 'bootstrap/dist/js/bootstrap.min.js';

class PlanForm extends React.Component {
  setPlan;

  constructor(props) {
    super(props);
    const {plan, setPlan} = props;
    this.setPlan = setPlan;
    console.log(plan);
    this.state = {
      master: plan, 
      id: plan.id, 
      userId: plan.userId,
      name: plan.name,
      description: plan.description,
      amount: plan.amount,
      endDate: plan.endDate,
      publicationDate: plan.publicationDate
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
    this.setPlan({
        id: this.state.id, 
        userId: this.state.userId,
        name: this.state.name,
        description: this.state.description,
        amount: this.state.amount,
        endDate: this.state.endDate,
        publicationDate: this.state.publicationDate ? this.state.publicationDate : new Date()
    });
    this.setState({
        id: '', 
        userId: '',
        name: '',
        description: '',
        amount: 0,
        endDate: '',
        publicationDate:undefined
    });
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
     
      {this.state.id && (
        
    <div className="form-row">
      <div className="form-group col-md-12">				
          <label>
          ID:
          <input type="text" name="id" value={this.state.id} onChange={this.handleChange} readOnly={true} disabled/>
        </label>
        </div>
      </div>)}
      <div className="form-row">
        <div className="form-group col-md-12">
          <label>
            Plan Name:
            <input type="text" name="name" value={this.state.name} onChange={this.handleChange} className="formControl"/>
          </label>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-12">
        <label>
          Description:
          <input type="text" name="description" value={this.state.description} onChange={this.handleChange}/>
        </label>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-12">
        <label>
          Amount:
          <input type="float" name="amount" value={this.state.amount} onChange={this.handleChange} />
        </label>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-12">
        <label>
          End Date:
          <input type="date" name="endDate" value={this.state.endDate} onChange={this.handleChange} />
        </label>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-12">
        <label>
          Publication Date Date:
          <input type="date" name="publicationDate" value={this.state.publicationDate} onChange={this.handleChange} disabled/>
        </label>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-12">
          <input className = "btn btn-primary" type="submit" value="Submit" />
        </div>
      </div> 
      </form>
    );
  }
}

export default PlanForm;