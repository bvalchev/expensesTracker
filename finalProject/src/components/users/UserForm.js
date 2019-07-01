import React from 'react';
import { Row, Col, Button, Icon, Form, TextInput, Select  } from 'react-materialize';

import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/js/bootstrap.js';
////import 'jquery/dist/jquery'
//import 'bootstrap/dist/js/bootstrap.min.js';

class UserForm extends React.Component {
  setUser;

  constructor(props) {
    super(props);
    const {user, setUser} = props;
    this.setUser = setUser;
    console.log(user);
    this.state = {
      master: user, 
      id: user.id, 
      name: user.name,
      username: user.username,
      password: user.password,
      role: user.role ? user.role : 1
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
    console.log("Role: " + this.state.role);
    this.setUser({
        id: this.state.id, 
        name: this.state.name,
        username: this.state.username,
        password: this.state.password,
        role: parseInt(this.state.role)
    });
    this.setState({
        id: '', 
        name: '',
        username: '',
        password: '',
        role: 1
    });
    event.preventDefault();
  }

  render() {
    return (

        <div>
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
                  Login Name:
                  <input type="text" name="username" value={this.state.username} onChange={this.handleChange} className="formControl"/>
                </label>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-12">
              <label>
                Name:
                <input type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
              </label>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-12">
              <label>
                Password:
                <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
              </label>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-12">
              <label>
                Role:
                <select name="role" value={this.state.role} onChange={this.handleChange}>
                    <option value="1">User</option>
                    <option value="2">Admin</option>
                </select>
              </label>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-12">
                <input className = "btn btn-primary" type="submit" value="Submit" />
              </div>
            </div> 
            </form>
    </div>
    );
  }
}

export default UserForm;