import React, {Components} from 'react';
import axios from 'axios';
import qs from "querystring";
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

//components
import {getUser} from "../../utils/auth";

export default class UserProfileEdit extends Components {
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    state = {
        user: getUser(),
        image: this.state.user.image_URL,
        firstname: this.state.user.firstname,
        lastname: this.state.user.lastname,
        display: this.state.user.display_name,
        phone: this.state.user.phone
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/users/${this.state.user.id}/edit`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(this.state),
        })
        .then((res) => {
            history.push({pathname: '/user/profile'}); 
        })
        .catch((err) => {
            console.log(err.message);
        })
    }

    render () {
        return (
            <div>
                <form>
                    <div>
                        <img src={this.state.image} alt='user-img'/>
                    </div>
                    <imput type='file' value={this.state.image} name='image'/>
                    <div>
                        <h1>Name</h1>
                        <h2>{this.state.firstname} {this.state.lastname}</h2>
                        <input onChange={this.handleChange}type='text' placeholder='Firstname' value={this.state.firstname}/>
                        <h1>Display name</h1>
                        <h2>{this.state.display}</h2>
                        <h1>Phone nr</h1>
                        <h2>{this.state.phone}</h2>
                    </div>
                </form>
            </div>
        )
    }
}
