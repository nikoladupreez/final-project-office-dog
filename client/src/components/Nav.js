import React, {Component} from 'react';
import {Link} from 'react-router-dom'

//components
import {getUser, logout} from "../utils/auth";

export default class Nav extends Component {
    constructor(props){
        super(props)
        this.state = {
            user: getUser()
        }
        this.logoutUser = this.logoutUser.bind(this);
    }

    logoutUser() {
        logout();
        this.setState({user: null});
    }

    render() {
        return (
            <nav>
                <Link to="/">Home</Link>
                {this.state.user ? 
                    <>
                        <p>Welcome {this.state.user.firstname}</p>
                        <p onClick={this.logoutUser}>Logout</p>
                    </>
                    :
                    <>
                        <Link to="login">Login</Link>
                        <Link to="signup/dog-owner">Sign up</Link>
                    </>
                }
            </nav>
        )
    }
}