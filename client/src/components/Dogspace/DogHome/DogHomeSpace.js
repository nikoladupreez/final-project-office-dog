import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom';

//components
import DogHome from './DogHome';
import Walker from './Components/Walker';
import Cookie from './Components/Cookie';
import Ice from './Components/Emergency';
import Dictionary from './Components/Dictionary';

export default class DogHomeSpace extends Component {
    render() {
        return (
                <Switch>
                    <Route exact path='/dog/:id/home/walk' component={Walker}/>
                    <Route exact path='/dog/:id/home/cookie' component={Cookie}/>
                    <Route exact path='/dog/:id/home/ice' component={Ice}/>
                    <Route exact path='/dog/:id/home/dictionary' component={Dictionary}/>
                    <Route exact path='/dog/:id/home' component={DogHome}/>
                </Switch>
        )
    }
}