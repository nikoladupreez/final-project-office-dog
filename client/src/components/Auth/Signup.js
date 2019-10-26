import React, { Component } from 'react';

//components
import {signup} from "../../utils/auth";

export default class Signup extends Component {

    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        email: "",
        password: "",
        firstname: "",
        lastname: "",
        displayName: "",
        phone: "", 
        image: ""
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        signup(this.state);
    }

    render() {
        return (
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <input onChange={this.handleChange} value={this.state.firstname} placeholder="First name" type="text" name="firstname"/>
                        <input onChange={this.handleChange} value={this.state.lastname} placeholder="Last name" type="text" name="lastname"/>
                        <input onChange={this.handleChange} value={this.state.displayName} placeholder="Display name" type="text" name="displayName"/>
                        <input onChange={this.handleChange} value={this.state.email} placeholder="Email" type="text" name="email"/>
                        <input onChange={this.handleChange} value={this.state.username} placeholder="Username" type="text" name="username"/>
                        <input onChange={this.handleChange} value={this.state.password} placeholder="Password"  type="password" name="password"/>
                        <button type="submit">Sign up</button>
                    </form>
                </div>
        )
    }
}