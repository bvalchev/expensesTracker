import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { NavLink} from 'react-router-dom';
//import 'bootstrap/dist/js/bootstrap.min.js';

class Navigation extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        hidden: this.props.shouldShowNavigation == null || this.props.shouldShowNavigation == false
      }
    }

    render(){
        return(
            <nav className="navbar navbar-default"  hidden={this.props.history.location == '/login' || this.props.history.location == '/register'}>
              <div className="container-fluid">
                <div className="navbar-header">
                  <a className="navbar-brand" href="#">WebSiteName</a>
                </div>
                <ul className="nav navbar-nav">
                  <li  className="nav-item nav-link"><NavLink className="nav-item nav-link" to="/dashboard" style={{display: "block"}}>Home</NavLink ></li>
                  <li  className="nav-item nav-link"><NavLink className="nav-item nav-link"  to="/users" style={{display: "block"}}>Users</NavLink ></li>
                  <li  className="nav-item nav-link"><NavLink className="nav-item nav-link"  to="/transactions" style={{display: "block"}}>Transactions</NavLink ></li>
                  <li  className="nav-item nav-link"><NavLink className="nav-item nav-link"  to="/planDetail" style={{display: "block"}}>Plans</NavLink ></li>
                   <li  className="nav-item nav-link"><NavLink className="nav-item nav-link"  to="/logout" style={{display: "block"}}>Log out</NavLink ></li> 
                </ul>
              </div>
            </nav>
        );
    }
}

export default Navigation;