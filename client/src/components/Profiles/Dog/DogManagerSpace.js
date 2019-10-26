import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom';

//components
import ManagerList from './Components/ManagerList';
import AddManagers from './Components/AddDogManagers';

export class DogProfileSpace extends Component {
    render() {
        return (
                <Switch>
                    <Route exact path='/dog/:id/profile/managers' components={ManagerList}/>
                    <Route exact path='/dog/:id/profile/managers/add' components={AddManagers}/>
                </Switch>
        )
    }
}