import React, { Component } from 'react';

import { Route, NavLink  , BrowserRouter, Redirect} from 'react-router-dom';
import "../css/login.css"


const API_URL ='http://localhost:9000/api/auth/login';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = { 
            username: '',
            password: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.onLoginClick = this.onLoginClick.bind(this);
        this.goToRegister = this.goToRegister.bind(this);
    }
    onLoginClick(event){
        let loginData = {
           username: this.state.username,
           password: this.state.password
        }
        fetch(API_URL, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(loginData), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json'
            }
          }).then(res => res.json())
          .catch(error => console.error('Error:', error))
          .then(response => {
            if(response.message){
                console.log(response)
               // let jsonMessage = JSON.parse(a.message);
                alert(response.message);
                return;
            }
            this.props.history.push("/dashboard");
            
            console.log('User', JSON.stringify(response))
            localStorage.setItem('currentUser', JSON.stringify(response));
           /* localStorage.setItem('creationTime', new Date())*/
            
            this.props.history.push({pathname: '/', state: { some: 'state' }})
            //this.setState(s => ({ plans: [...s.plans, response] }));
      
          })
          .catch(error => console.error('Error:', error));
          
          event.preventDefault();
          
          this.setState({
            username: '',
            password: '',
         });
        
    }

    goToRegister = ()=>{
      this.props.history.push({pathname: '/register', state: {some: 'register'}})
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

    render() {
        return (

            <div className="container">

            <form className="form-signin" onSubmit={this.onLoginClick}>
              <h2 className="form-signin-heading">Please sign in</h2>
              <label htmlFor="username" className="sr-only">Username</label>
              <input type="text" id="username" className="form-control" name="username" placeholder="Email address" minLength={2} maxLength={15} onChange={this.handleChange} required autoFocus/>
              <label htmlFor="inputPassword" className="sr-only">Password</label>
              <input type="password" id="inputPassword" className="form-control" name="password" placeholder="Password" minLength={6} maxLength={20} /*pattern="^[0-9a-f]{24}$" title="Password should include one small and one capital letter, as well as a number"*/ onChange={this.handleChange} required/>
              <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
              <p className="text-center" style={{fontSize: '1.3em'}}><a href="" onClick = {this.goToRegister}> No account?</a></p>
            </form>
          </div>
        );
    }
}

export default Login;