import React, { Component } from 'react'

//components
import {login} from "../../utils/auth";


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
        login(this.state);
    }

    render() {
        return (
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <input onChange={this.handleChange} value={this.state.email} placeholder="email" type="text" name="email"/>
                        <input onChange={this.handleChange} value={this.state.password} placeholder="password"  type="password" name="password"/>
                        <button type="submit">Login</button>
                    </form>
                </div>
        )
    }
}