import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
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
        this.showForgotPassword = this.showForgotPassword.bind(this);
        this.closeForgotPassword = this.closeForgotPassword.bind(this);
        this.handleSubmitReset = this.handleSubmitReset.bind(this);
    }

    state = {
        email: "",
        password: "",
        error: false,
        setShowReset: false,
        showReset: false,
        setShowResetSend: false,
        showResetSend: false

    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
            error: false
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        login(this.state)
            .then( () => {
                this.props.history.push("/home");
            })
            .catch((err) => {
                this.setState({error: true});
            });
    }

    showForgotPassword() {
        this.setState({setShowReset: true});
        this.setState({showReset: true});
    }

    closeForgotPassword() {
        this.setState({setShowReset: false});
        this.setState({showReset: false});
        this.setState({setShowResetSend: false});
        this.setState({showResetSend: false});
    }

    showResetSend() {
        this.setState({setShowResetSend: true});
        this.setState({showResetSend: true});
    }

    handleSubmitReset(e) {
        debugger;
        e.preventDefault();
        axios({
            method: "POST",
            url:  `${process.env.REACT_APP_API}/auth/get-reset-link`,
            headers: { 'content-type': 'application/json' },
            data: JSON.stringify(this.state.email)
        })
        .then(() => this.showResetSend())
        .catch((err) => console.log(err.message));
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
                            <input id={this.state.error ? 'error' : ''} required onChange={this.handleChange} value={this.state.email} type="text" name="email"/>
                            <div className='login-password-box'>
                                <label>Password</label>
                                <p onClick={this.showForgotPassword}>Forgot password?</p>
                            </div>
                            <input required id={this.state.error ? 'error' : ''} onChange={this.handleChange} value={this.state.password} type="password" name="password"/>
                            <div className={this.state.error ? 'error-box-login' : 'hidden'}><p className={this.state.error ? 'error-message error-not-found' : 'hidden'}>Oops! Email and/or password are incorrect.</p></div>
                            <div className='login-btn-box'>
                                <button onClick={this.handleSubmit} disabled={!this.state.email || !this.state.password}>Sign in</button>
                            </div>
                        </form>
                    </div>
                    <Modal
                        show={this.state.showReset}
                        onHide={this.closeForgotPassword}
                        centered='true'
                        dialogClassName="modal-90w"
                        aria-labelledby="forgot-password-modal"
                        style={{maxWidth: '90%', width: '90%', margin: '0 0 0 18px'}}
                    >
                        <Modal.Header closeButton id='modal-header'>
                            <Modal.Title id="reset-title">
                                Reset Password
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body id='reset-body' style={{margin: '0 0 0 -3px'}}>
                            <form onSubmit={(e) => {e.preventDefault(); return false}} className='reset-container'>
                                <label>Email adress</label>
                                <input required onChange={this.handleChange} type='text' name='email'/>
                                <div className='reset-btn-box'>
                                    <button onClick={this.handleSubmitReset} disabled={!this.state.email}>Send Reset Link</button>
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal>
                    <Modal
                        show={this.state.showResetSend}
                        onHide={this.closeForgotPassword}
                        centered='true'
                        dialogClassName="modal-90w"
                        aria-labelledby="forgot-password-modal"
                        style={{maxWidth: '90%', width: '90%', margin: '0 0 0 18px'}}
                    >
                        <Modal.Header closeButton id='modal-header'>
                            <Modal.Title id="reset-title">
                                Reset Password
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body id='reset-body' style={{margin: '0 0 0 -3px'}}>
                            <div className='reset-link-box'>
                                <h2>You've got mail!</h2>
                                <h3>Reset link send to: {this.state.email}</h3>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
        )
    }
}