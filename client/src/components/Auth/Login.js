import React, { Component } from 'react'
import {Link} from 'react-router-dom';

//components
import {login} from "../../utils/auth";

//style
import '../../styles/Login.scss';


export default class Login extends Component {
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    state = {
        email: "",
        password: ""
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        login(this.state, this.props.history);
    }

    render() {
        return (
                <div className='login-container'>
                    <div className='login-back-box'>
                        <Link to='/'><img src='/' alt='go-back'/></Link>
                    </div>
                    <img className='login-logo' src='/' alt='logo'/>
                    <div className='login-box'>
                        <h1>Sign in to ... </h1>
                        <h2>Enter your details below</h2>
                        <form onSubmit={(e) => {e.preventDefault(); return false}}>
                            <label>Email address</label>
                            <input required onChange={this.handleChange} value={this.state.email} placeholder="email" type="text" name="email"/>
                            <label>Password</label>
                            <input required onChange={this.handleChange} value={this.state.password} placeholder="password"  type="password" name="password"/>
                            <div>
                                <button onClick={this.handleSubmit}>Login</button>
                            </div>
                        </form>
                    </div>
                </div>
        )
    }
}