import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom';

//components
import UserProfile from './Components/UserProfile';
import UserProfileEdit from './Components/UserProfileEdit';

export default class UserProfileSpace extends Component {
    render() {
        return (
                <Switch>
                    <Route exact path='/user/profile' component={UserProfile}/>
                    <Route exact path='/user/profile/edit' component={UserProfileEdit}/>
                </Switch>
        )
    }
}