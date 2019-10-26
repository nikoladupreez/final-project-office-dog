import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom';

//components
import DogProfileSpace from '../Profiles/Dog/Components/DogProfile'
import DogHomeSpace from './DogHome/DogHomeSpace';

export default class Dogspace extends Component {
    render() {
        return (
                <Switch>
                    <Route path='/dog/:id/home' components={DogHomeSpace}/>
                    <Route path='/dog/:id/profile' components={DogProfileSpace}/>
                </Switch>
        )
    }
};