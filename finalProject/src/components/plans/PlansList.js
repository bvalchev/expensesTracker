import React from 'react';
import Plan from './Plan';
import PlanForm from './PlanForm';
//import 'jQuery/lib/node-jquery.js'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

let userId = JSON.parse(localStorage.getItem('currentUser')) ? JSON.parse(localStorage.getItem('currentUser')).user.id : -1;
let API_URL = 'http://localhost:9000/api/planDetail/' + userId + '/plans';

class PlansList extends React.Component {
    state = {
        plans: [],
        showAddForm: false,
        editMode: true,
        editedPlan: undefined
    }

    constructor(props) {
        super(props);
        userId = JSON.parse(localStorage.getItem('currentUser')) ? JSON.parse(localStorage.getItem('currentUser')).user.id : -1;
        API_URL = 'http://localhost:9000/api/planDetail/' + userId + '/plans';
        fetch(API_URL, {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-access-token':  JSON.parse(localStorage.getItem('currentUser')).token
              }
        })
            .then(resp => resp.json())
            .then(plans => {
                if(plans.data === null){
                    alert('You are not logged in')
                    //this.props.history.push({pathname: '/login',state: { some: 'login' }})
                }
                console.log(plans.data);
                this.setState({plans: plans.data});
            });
        
    }

    removePlan = (plan) => {
        fetch(API_URL + "/" + plan.id, {
            method: 'DELETE',
            headers: {
                'x-access-token':  JSON.parse(localStorage.getItem('currentUser')).token
            }
          }).then(res => res.json())
          .catch(error => console.error('Error:', error))
          .then(a => {
            console.log(this.state.plans);
            console.log("A: " + a);
            let index = this.state.plans.indexOf(plan);
           this.state.plans.splice(index, 1);
            console.log("Index: " + index);
            this.setState(s => ({ plans: this.state.plans}));
            console.log('Deleted plan:', JSON.stringify(a))
          })
          .catch(error => console.error('Error:', error));
         
    
             this.setState({showAddForm: false});
    }


    setPlan = (plan) => {
        if(this.state.editMode) {
            console.log(plan);
            fetch(API_URL + '/' + plan.id, {
                method: 'PUT',
                body: JSON.stringify(plan), // data can be `string` or {object}!
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
                let newPlansArray = this.state.plans.map(singlePlan => (singlePlan.id === plan.id ? a : singlePlan));

                this.setState({
                    plans: newPlansArray
                });
                console.log('Updated plan:', JSON.stringify(a))
              })
              .catch(error => console.error('Error:', error));
            
        } else {
            console.log(plan);
            fetch(API_URL, {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(plan), // data can be `string` or {object}!
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
                this.setState(s => ({ plans: [...s.plans, a] }));
                console.log('Created new plan:', JSON.stringify(a))
              })
              .catch(error => console.error('Error:', error));
             
        }
        this.setState({showAddForm: false});
    }

    renderPlan(){
        console.log(this.state.plans);
        if(!this.state.plans || this.state.plans.length === 0){
            return;
        }
    }

    onCloseFormClick(){
        this.setState({showAddForm : false})
    }

    render() {
        return (
        <div className="container-fluid">
          <div className="col-sm-12 col-md-12">
           
                <div>
                    <button className="btn btn-success" waves="light" style={{marginBottom: '1em'}} onClick={() => {
                        this.setState({editedPlan: {}});
                        this.setState({showAddForm : true}); 
                        this.setState({editMode: false}); 
                    } } hidden={this.state.showAddForm}>
                        Add Plan  
                    </button>
                </div>
                <table className="table table-bordered table-responsive-md table-striped text-center">
                    <thead>
                        <tr>
                            <th className="text-center">Name</th>
                            <th className="text-center">Description</th>
                            <th className="text-center">Amount</th>
                            <th className="text-center">End Date</th>
                            <th className="text-center">Start Date</th>
                            <th className="text-center">Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        { this.state.plans.map(plan => (
        <Plan key={plan.id} shouldDisableEditButton={this.state.showAddForm || this.editMode} plan={plan} onEditClick={this.onEditClick} removePlan={this.removePlan} editCallback={() => {
            this.setState({editedPlan: plan});
            this.setState({showAddForm : true}); 
            this.setState({editMode: true}); 
        } }/>
        ))}
                    </tbody>
                </table>
            
        </div>
        <div className="col-sm-12 col-md-12">
        {this.state.showAddForm &&
        <PlanForm plan={this.state.editedPlan} setPlan={this.setPlan} onCloseFormClick={this.onCloseFormClick.bind(this)} />
        }
        </div>
        </div>
        );
    }
}

export default PlansList;