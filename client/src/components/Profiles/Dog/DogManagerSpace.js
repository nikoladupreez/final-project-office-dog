import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom';

//components
import ManagerList from './Components/ManagerList';
import AddManagers from './Components/AddDogManagers';

export default class DogManagerSpace extends Component {
    render() {
        return (
                <Switch>
                    <Route exact path='/dog/:id/profile/managers/add' component={AddManagers}/>
                    <Route exact path='/dog/:id/profile/managers' component={ManagerList}/>
                </Switch>
        )
    }
}