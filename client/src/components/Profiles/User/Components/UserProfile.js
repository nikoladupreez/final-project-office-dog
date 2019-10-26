import React, { Component } from 'react';
import axios from 'axios';
import {Route, Switch} from 'react-router-dom';

//components
import ProfileLink from '../../ProfileLink';
import UserProfileEdit from './UserProfileEdit';
import {getUser} from "../../../../utils/auth";

export default class UserProfile extends Component {
    state = {
        userPopulated: {},
        user: getUser()
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/users/${this.state.user.id}`
        })
        .then((user) => this.setState({userPopulated: JSON.parse(user)}))
        .catch((err) => console.log(err.message));
    }

    render() {
        return (
            <Switch>
                <Route exact path='/user/profile'>
                    <div>
                        <div>
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
                        </div>
                    </div>
                 </Route>
                 <Route exact path='/user/edit-profile'>
                     <UserProfileEdit/>
                 </Route>
            </Switch>
            
        )
    }
};
