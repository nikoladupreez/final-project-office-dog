import React, { Component } from 'react';
import axios from 'axios';

//components
import ProfileLink from '../../ProfileLink';
import {getUser, logout} from "../../../../utils/auth";

export default class UserProfile extends Component {
    constructor(props){
        super(props)
        this.state = {
            userPopulated: {},
            user: getUser()
        }
        this.logoutUser = this.logoutUser.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/users/${this.state.user._id}`
        })
        .then((user) => this.setState({userPopulated: user}))
        .catch((err) => console.log(err.message));
    }

    logoutUser() {
        logout(this.props.history);
    }

    goBack() {
        this.props.history.go(-1);
    }

    render() {
        return (
                    <div>
                        <div>
                            <button onClick={this.goBack}>Back</button>
                            <img src='/' alt='user-icon'/>
                            <div>
                                <h1>{this.state.user.display_name}</h1>
                                <p>{this.state.user.firstname} {this.state.user.lastname}</p>
                                <p>{this.state.user.phone}</p>
                            </div>
                            <img src={this.state.user.image_URL} alt='user-img'/>
                        </div>
                        <div>
                            <ProfileLink url='/user/edit-profile' icon='/' title='Edit profile'/>
                            <ProfileLink url='/home' icon='/' title='Dogspaces'/>
                            <div onClick={this.logoutUser}>
                                <img src='/' alt='icon'/>
                                <h1>Logout</h1>
                            </div>
                        </div>
                    </div>
        )
    }
};
