import React from 'react';
import { Row, Col, Card } from 'react-materialize';
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
            <tr className="tr">
                <td className="pt-3-half" >{this.state.plan.name}</td>
                <td className="pt-3-half" >{this.state.plan.description}</td>
                <td className="pt-3-half" >{this.state.plan.amount}</td>
                <td className="pt-3-half" >{this.state.plan.endDate}</td>
                <td className="pt-3-half" >{this.state.plan.publicationDate}</td>
                <td>
                    <span className="table-remove">
                        <button type="button" className="btn btn-danger btn-rounded btn-sm my-0" onClick={this.props.removePlan.bind(this, this.state.plan)}>Remove</button> 
                    </span>
                    <span className="table-edit">
                        <button type="button" className="btn btn-warning btn-rounded btn-sm my-0" onClick={this.props.editCallback.bind(this)}>Edit</button> 
                    </span>
                </td>
            </tr>
        );
    }
}

export default Plan;