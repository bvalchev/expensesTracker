import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap/dist/js/bootstrap.min.js';

class User extends React.Component {
    state = {
        user: ''
    }

    componentDidMount(){
        this.setState({user: this.props.user})
    }

    render(){
        console.log(this.state.user);
        return(
            <tr className="tr">
                <td className="pt-3-half" >{this.state.user.name}</td>
                <td className="pt-3-half" >{this.state.user.username}</td>
                <td className="pt-3-half" >{this.state.user.role}</td>
                <td>
                    <span className="table-remove">
                        <button type="button" className="btn btn-danger btn-rounded btn-sm my-0" onClick={this.props.removeUser.bind(this, this.state.user)}>Remove</button> 
                    </span>
                    <span className="table-edit">
                        <button type="button" className="btn btn-warning btn-rounded btn-sm my-0" onClick={this.props.editCallback.bind(this)}>Edit</button> 
                    </span>
                </td>
            </tr>
        );
    }
}

export default User;