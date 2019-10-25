import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom';

//components
import DogProfile from '../Profiles/Dog/DogProfile'
import UserProfile from '../Profiles/User/UserProfile'
import Tracker from './Tracker';

export class Dogspace extends Component {
    render() {
        return (
            <>
                <Switch>
                    <Route path='/dog/:id/profile'>
                        <DogProfile/>
                    </Route>
                    <Route path='/dog/:id'>
                        <Tracker/>
                    </Route>
                    <Route path='/user/profile'>
                        <UserProfile/>
                    </Route>
                </Switch>
            </>
        )
    }
}