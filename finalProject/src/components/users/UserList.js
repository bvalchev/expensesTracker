import React from 'react';
import update from 'react-addons-update'; // ES6
import {Table, Row, Col, Button, Icon, Card } from 'react-materialize';
import User from './User';
import UserForm from './UserForm';
import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/js/bootstrap.min.js';

const API_URL = 'http://localhost:9000/api/users';

class UserList extends React.Component {
    state = {
        users: [],
        showAddForm: false,
        editMode: true,
        editedUser: undefined
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
            .then(users => {
                console.log(users.data);
                if(users.data == null){
                    alert('You are not logged in');
                   // this.props.history.push({pathname: '/login',state: { some: 'login' }})
                }
                this.setState({users: users.data});
            });
    }

    // const [articles, setArticles] = useState(ARTICLES);
    // const [showAddForm, setShowAddForm] = useState(false);
    // const [editMode, setEditMode] = useState(true);

    removeUser = (user) => {
        fetch(API_URL + "/" + user.id, {
            method: 'DELETE', // or 'PUT'
            headers: {
                'x-access-token':  JSON.parse(localStorage.getItem('currentUser')).token
            }
          }).then(res => res.json())
          .catch(error => console.error('Error:', error))
          .then(a => {
            console.log(this.state.users);
            console.log("A: " + a);
            let index = this.state.users.indexOf(user);
           this.state.users.splice(index, 1);
            console.log("Index: " + index);
            this.setState(s => ({ users: this.state.users}));
            console.log('Deleted user:', JSON.stringify(a))
          })
          .catch(error => console.error('Error:', error));
         
    
             this.setState({showAddForm: false});
    }


    setUser = (user) => {
        if(this.state.editMode) {
            console.log(user);
            fetch(API_URL + '/' + user.id, {
                method: 'PUT',
                body: JSON.stringify(user), // data can be `string` or {object}!
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
                let index = this.state.users.indexOf(user);
                let newUsersArray = this.state.users.map(singleUser => (singleUser.id === user.id ? a : singleUser));

                this.setState({
                    users: newUsersArray
                });
                console.log('Updated user:', JSON.stringify(a))
              })
              .catch(error => console.error('Error:', error));
            
        } else {
            // article.id = '' + Date.now();
            console.log(user);
            fetch(API_URL, {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(user), // data can be `string` or {object}!
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
                this.setState(s => ({ users: [...s.users, a] }));
                console.log('Created new user:', JSON.stringify(a))
              })
              .catch(error => console.error('Error:', error));
             
        }
        this.setState({showAddForm: false});
    }

    renderUser(){
        console.log(this.state.users);
        //console.log(this.state.users.data);
        if(!this.state.users || this.state.users.length == 0){
            return;
        }
        
       
    
    }

    render() {
        return (
            <div className="users-main container">
                <div className="col-sm-12 col-md-12" >
                  
                        <div>
                            <button waves="light" onClick={() => {
                                this.setState({editedUser: {}});
                                this.setState({showAddForm : true}); 
                                this.setState({editMode: false}); 
                            } } data-toggle="modal" data-target="#usersModal" >
                                Add User
                                <Icon right>add_box</Icon>
                            </button>
                        </div>
                        <table className="table table-bordered table-responsive-md table-striped text-center">
                            <thead>
                                <tr>
                                    <th className="text-center">Name</th>
                                    <th className="text-center">Username</th>
                                    <th className="text-center">Role</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                { this.state.users.map(user => (
                <User key={user.id} user={user} onEditClick={this.onEditClick} removeUser={this.removeUser} editCallback={() => {
                    this.setState({editedUser: user});
                    this.setState({showAddForm : true}); 
                    this.setState({editMode: true}); 
                } }/>
        ))}
                            </tbody>
                        </table>
                    
                </div>
                <div  className="col-sm-12 col-md-12">
                {this.state.showAddForm &&
                <div className="row">
                    <div className="modal" id="usersModal" tabIndex="-1" role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Modal title</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <UserForm user={this.state.editedUser} setUser={this.setUser}/>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                }
                </div>
            </div>
        );
    }
}

export default UserList;