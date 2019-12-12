import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../css/form.css';
//import 'bootstrap/dist/js/bootstrap.js';
////import 'jquery/dist/jquery'
//import 'bootstrap/dist/js/bootstrap.min.js';

class UserForm extends React.Component {
  setUser;

  constructor(props) {
    super(props);
    const {user, setUser} = props;
    this.setUser = setUser;
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
    const name = target.name
    this.setState({
      [name]: value
    });
  }



  handleSubmit(event) {
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

      <div className="form-div">
        <form className="user-add-edit-form" onSubmit={this.handleSubmit}>

          {this.state.id && (
            <div className="form-row">
              <div className="form-group ">
                <label className='label-row'>
                  ID:
                  <br>
                  </br>
                  <input className='input-field' type="text" name="id" value={this.state.id} onChange={this.handleChange} readOnly={true} disabled />
                </label>
              </div>
            </div>)}
          <div className="form-row">
            <div className="form-group ">
              <label className='label-row'>
                Login Name:
                  <br>
                </br>
                <input className='input-field' type="text" name="username" value={this.state.username} onChange={this.handleChange} className="formControl" />
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group ">
              <label className='label-row'>
                Name:
                <br>
                </br>
                <input className='input-field' type="text" name="name" value={this.state.name} onChange={this.handleChange} />
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group ">
              <label className='label-row'>
                Password:
                <br>
                </br>
                <input className='input-field' type="password" name="password" value={this.state.password} onChange={this.handleChange} />
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group ">
              <label className='label-row'>
                Role:
                <br>
                </br>
                <select className='input-field' name="role" value={this.state.role} onChange={this.handleChange}>
                  <option value="1">User</option>
                  <option value="2">Admin</option>
                </select>
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group ">
              <input className="btn btn-primary" type="submit" value="Submit" />
              <button className="btn btn-secondary" onClick={this.props.onCloseFormClick}>Close</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default UserForm;