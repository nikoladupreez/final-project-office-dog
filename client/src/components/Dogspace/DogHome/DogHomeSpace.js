import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom';

//components
import DogHome from './DogHome';
import Walker from './Components/Walker';
import Dictionary from './Components/Dictionary';
import DictionaryEdit from './Components/DictionaryEdit';
import IceEdit from './Components/EmergencyEdit';

export default class DogHomeSpace extends Component {
    render() {
        return (
                <Switch>
                    <Route exact path='/dog/:id/home/walk' component={Walker}/>
                    <Route exact path='/dog/:id/home/dictionary' component={Dictionary}/>
                    <Route exact path='/dog/:id/home/dictionary/edit' component={DictionaryEdit}/>
                    <Route exact path='/dog/:id/home/ice/edit' component={IceEdit}/>
                    <Route exact path='/dog/:id/home' component={DogHome}/>
                </Switch>
        )
    }
}