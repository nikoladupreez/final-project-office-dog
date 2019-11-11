import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import axios from 'axios';

//components
import {login} from "../../utils/auth";

//style
import '../../styles/Login.scss';

export default class Login extends Component {
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    state = {
        email: "",
        password: "",
        notFound: false,
        wrongPassword: false,
        credentials: false

    }

   handleBlur(e){
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/users/email/${this.state.email}`
        })
        .catch((err) => {
            this.setState({notFound: true});
        })
   }

    handleChange(e) {
        if (e.target.name === 'email'){
            this.setState({notFound: false});
        } else {
            this.setState({wrongPassword: false});
        }

        this.setState({
            [e.target.name]: e.target.value
        })

        if (this.state.email && this.state.password){
            this.setState({credentials: true});
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        login(this.state)
            .then( () => {
                this.props.history.push("/home");
            })
            .catch((err) => {
                this.setState({wrongPassword: true})
            });
    }

    render() {
        return (
                <div className='login-container'>
                    <div className='login-back-box'>
                        <Link to='/'><div className='close-icon'></div></Link>
                    </div>
                    <div className='login-box'>
                        <div className='sign-title-box'>
                            <h1>Sign in to</h1>
                            <div className='dogspace-logo2'></div>
                        </div>
                        <h2>Enter your details below</h2>
                        <form onSubmit={(e) => {e.preventDefault(); return false}}>
                            <label className='login-email-label'>Email address</label>
                            <input id={this.state.notFound ? 'error' : ''} required onChange={this.handleChange} onBlur={this.handleBlur} value={this.state.email} type="text" name="email"/>
                            <div className={this.state.notFound ? 'error-box-login' : 'hidden'}><p className={this.state.notFound ? 'error-message error-not-found' : 'hidden'}>Email not registrated</p></div>
                            <div className='login-password-box'>
                                <label>Password</label>
                                <Link to='/'><p>Forgot password?</p></Link>
                            </div>
                            <input required id={this.state.wrongPassword ? 'error' : ''} onChange={this.handleChange} value={this.state.password} type="password" name="password"/>
                            <div className={this.state.wrongPassword ? 'error-box-login' : 'hidden'}><p className={this.state.wrongPassword ? 'error-message error-not-found' : 'hidden'}>Incorrect password</p></div>
                            <div className='login-btn-box'>
                                <button onClick={this.handleSubmit} disabled={!this.state.credentials}>Sign in</button>
                            </div>
                        </form>
                    </div>
                </div>
        )
    }
}