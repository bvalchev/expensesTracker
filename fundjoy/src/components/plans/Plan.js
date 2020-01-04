import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/js/bootstrap.min.js';

class Plan extends React.Component {
    state = {
        plan: ''
    }

    componentDidMount(){
        this.setState({plan: this.props.plan})
    }

    render(){
        console.log(this.state.plan);
        return(
            <tr >
                <td className="pt-3-half" >{this.state.plan.name}</td>
                <td className="pt-3-half" >{this.state.plan.description}</td>
                <td className="pt-3-half" >{this.state.plan.amount}</td>
                <td className="pt-3-half" >{this.state.plan.endDate}</td>
                <td className="pt-3-half" >{this.state.plan.publicationDate}</td>
                <td className="pt-3-half">
                        <button type="button" disabled ={this.props.shouldDisableEditButton} className="btn btn-warning" style={{margin: "3%"}} onClick={this.props.editCallback.bind(this)}>Edit</button> 
                        <button type="button"  className="btn btn-danger" style={{margin: "3%"}} onClick={this.props.removePlan.bind(this, this.state.plan)}>Remove</button> 
                </td>
            </tr>
        );
    }
}

export default Plan;