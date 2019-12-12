import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/js/bootstrap.min.js';

class Transaction extends React.Component {
    state = {
        transaction: ''
    }

    componentDidMount(){
        this.setState({transaction: this.props.transaction})
    }

    render(){
        console.log(this.state.transaction);
        return(
            <tr className="tr">
                <td className="pt-3-half" >{this.state.transaction.name}</td>
                <td className="pt-3-half" >{this.state.transaction.description}</td>
                <td className="pt-3-half" >{this.state.transaction.isExpense}</td>
                <td className="pt-3-half" >{this.state.transaction.category}</td>
                <td className="pt-3-half" >{this.state.transaction.amount}</td>
                <td className="pt-3-half" >{this.state.transaction.isPeriodical}</td>
                <td className="pt-3-half" >{this.state.transaction.type}</td>
                <td className="pt-3-half" >{this.state.transaction.registrationDate}</td>
                <td>
                    <button type="button" disabled ={this.props.shouldDisableEditButton} style={{margin: "3%"}} className="btn btn-warning btn-rounded btn-sm my-0" onClick={this.props.editCallback.bind(this)}>Edit</button> 
                    <button type="button" className="btn btn-danger btn-rounded btn-sm my-0" style={{margin: "3%"}} onClick={this.props.removeTransaction.bind(this, this.state.transaction)}>Remove</button> 
                    
                </td>
            </tr>
        );
    }
}

export default Transaction;