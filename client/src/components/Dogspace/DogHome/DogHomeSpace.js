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
                    <Route exact path='/dog/:id/home' components={DogHome}/>
                    <Route exact path='/dog/:id/home/walk' components={Walker}/>
                    <Route exact path='/dog/:id/home/cookie' components={Cookie}/>
                    <Route exact path='/dog/:id/home/ice' components={Ice}/>
                    <Route exact path='/dog/:id/home/dictionary' components={Dictionary}/>
                </Switch>
        )
    }
}