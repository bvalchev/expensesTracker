import React from 'react';

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
      <div className="form-div">
      <form className="user-add-edit-form" onSubmit={this.handleSubmit}>
     
      {this.state.id && (
        
    <div className="form-row">
      <div className="form-group col-md-12">				
          <label className='label-row'>
          ID:
          <br>
          </br>
          <input type="text" name="id" value={this.state.id} onChange={this.handleChange} readOnly={true} disabled/>
        </label>
        </div>
      </div>)}
      <div className="form-row">
        <div className="form-group ">
          <label className='label-row'>
            Plan Name:
            <br>
          </br>
            <input type="text" name="name" value={this.state.name} onChange={this.handleChange} className="formControl"/>
          </label>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group ">
        <label className='label-row'>
          Description:
          <br>
          </br>
          <input type="text" name="description" value={this.state.description} onChange={this.handleChange}/>
        </label>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group ">
        <label className='label-row'>
          Amount:
          <br>
          </br>
          <input type="float" name="amount" step="0.01" value={this.state.amount} onChange={this.handleChange} />
        </label>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group ">
        <label className='label-row'>
          End Date:
          <br>
          </br>
          <input type="date" name="endDate" value={this.state.endDate} onChange={this.handleChange} />
        </label>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group ">
        <label className='label-row'>
          Publication Date Date:
          <br>
          </br>
          <input type="date" name="publicationDate" value={this.state.publicationDate} onChange={this.handleChange} disabled/>
        </label>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <input className = "btn btn-primary" type="submit" value="Submit" />
          <button className="btn btn-secondary" onClick={this.props.onCloseFormClick}>Close</button>
        </div>
      </div> 
      </form>
      </div>
    );
  }
}

export default PlanForm;