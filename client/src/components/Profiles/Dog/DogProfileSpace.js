import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom';

//components
import DogProfile from './Components/DogProfile';
import DogProfileEdit from '../Dog/Components/DogProfileEdit';
import DogGuide from './Components/DogGuide';
import DogManagerSpace from './DogManagerSpace';

export default class DogProfileSpace extends Component {
    render() {
        return (
                <Switch>
                    <Route exact path='/dog/:id/profile/edit' component={DogProfileEdit}/>
                    <Route exact path='/dog/:id/profile/guide' component={DogGuide}/>
                    <Route path='/dog/:id/profile/managers' component={DogManagerSpace}/>
                    <Route exact path='/dog/:id/profile' component={DogProfile}/>
                </Switch>
        )
    }
}