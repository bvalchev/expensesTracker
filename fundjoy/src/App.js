import React, { Component } from 'react';
//import logo from './logo.svg';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.css';
//import { PropTypes } from 'prop-types';
// import './index.css';
import '../src/css/navbar.css'
import {Router/*, hashHistory, useRouterHistory*/ } from 'react-router';
import { Route, NavLink  , /*BrowserRouter,*/ Redirect} from 'react-router-dom';
import UserList from './components/users/UserList';
import TransactionList from './components/transactions/TransactionList';
import Login from './components/login.js';
import Register from './components/register.js';
import PlansList from './components/plans/PlansList';
import Dashboard from './components/dashboard';
import ChatComponent from './components/Chat/ChatComponent';
//import Navigation from './components/navigation';
import {createBrowserHistory} from 'history';
//import { useQueries } from 'history';
import './css/navbar.css';

let isTokenValid = () => {
  let token = JSON.parse(localStorage.getItem('currentUser'))
  let now = new Date();
  let hourAgo = new Date(now.getTime()-3600*1000);
  return token && token.auth ===true && new Date(token.creationDate) > hourAgo;
}


let history = createBrowserHistory();
//const appHistory = useQueries(useRouterHistory(createBrowserHistory))();
const PrivateRoute = ({ component: Component,  ...rest }) => (
  <Route {...rest} render={(props) => (
      isTokenValid()
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
)


class App extends Component{
  constructor(){
    super();
    this.logout = this.logout.bind(this);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    history.push({pathname: '/login', state: {some: 'login'}});
  }
  
    render(){
      console.log(history);
      return(
        <div className="container"> 
        <Router  history={history}>
          <div>
           {(history.location === '/login' || history.location === '/register') ? <div></div> :  
        <nav className="navbar navbar-fixed-top" >
              <div className="container-fluid">
                <div>
                  <ul className="nav navigationList">
                    <li  className="navListItem pull-left"><NavLink className = "navigationItem" to="/" exact>Finance Tracking</NavLink ></li>
                    <li className="navListItem"><NavLink className = "navigationItem" to="/" exact>Home</NavLink ></li>
                    <li className="navListItem"><NavLink  className = "navigationItem" to="/users" >Users</NavLink ></li>
                    <li className="navListItem" ><NavLink className = "navigationItem"  to="/transactions" >Transactions</NavLink ></li>
                    <li className="navListItem"><NavLink className = "navigationItem"  to="/planDetail" >Plans</NavLink ></li>
                    <li className="navListItem"><a href='#0' className = "navigationItem" onClick={this.logout} >Log out</a ></li> 
                  </ul>
                </div>
              </div>
            </nav>}
          
            <div>
              <hr />
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
              <PrivateRoute path="/" exact component={Dashboard} />
              <PrivateRoute path="/users" component={UserList} />
              <PrivateRoute path="/transactions" component={TransactionList} />
              <PrivateRoute path="/planDetail" component={PlansList} />
            </div>
          </div>
        </Router>
        <div>
          <ChatComponent/>
        </div>
        </div>

      );
    }
}

export default App;
