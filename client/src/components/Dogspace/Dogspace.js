import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom';

//components
import DogProfileSpace from '../Profiles/Dog/DogProfileSpace';
import DogHomeSpace from './DogHome/DogHomeSpace';

export default class Dogspace extends Component {

    render() {
        return (
                <Switch>
                    <Route path='/dog/:id/profile' component={DogProfileSpace}/>
                    <Route path='/dog/:id/home' component={DogHomeSpace}/>
                </Switch>
        )
    }
};