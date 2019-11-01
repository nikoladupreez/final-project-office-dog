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
        password: "",
        error: null

    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        login(this.state)
            .then( () => {
                this.props.history.push("/home");
            })
            .catch((err) => {
                this.setState({error: err.message})
            });
    }

    render() {
        return (
                <div className='login-container'>
                    <div className='login-back-box'>
                        <Link to='/'><div className='close-icon'></div></Link>
                    </div>
                    <div className='login-box'>
                        <h1>Sign in to <div className='dogspace-logo2'></div></h1>
                        <h2>Enter your details below</h2>
                        <form onSubmit={(e) => {e.preventDefault(); return false}}>
                            <label className='login-email-label'>Email address</label>
                            <input required onChange={this.handleChange} value={this.state.email} type="text" name="email"/>
                            <div className='login-password-box'>
                                <label>Password</label>
                                <Link to='/'><p>Forgot password?</p></Link>
                            </div>
                            <input required onChange={this.handleChange} value={this.state.password} type="password" name="password"/>
                            <div className='login-btn-box'>
                                <button onClick={this.handleSubmit}>Sign in</button>
                            </div>
                        </form>
                    </div>
                </div>
        )
    }
}