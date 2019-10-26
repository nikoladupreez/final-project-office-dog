import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom';

//components
import DogProfile from './Components/DogProfile';
import DogProfileEdit from '../Dog/Components/DogGuideEdit'
import DogGuide from './Components/DogGuide';
import DogManagerSpace from './DogManagerSpace';

export default class DogProfileSpace extends Component {
    render() {
        return (
                <Switch>
                    <Route exact path='/dog/:id/profile' components={DogProfile}/>
                    <Route exact path='/dog/:id/profile/edit' components={DogProfileEdit}/>
                    <Route exact path='/dog/:id/profile/guide' components={DogGuide}/>
                    <Route path='/dog/:id/profile/managers' components={DogManagerSpace}/>
                </Switch>
        )
    }
}