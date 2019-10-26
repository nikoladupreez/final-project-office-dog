import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';

//components
import {getUser} from "../../utils/auth";
import DogForm from './components/DogForm';
import ConfirmAdd from './components/ConfirmAdd';

export default class AddDogspace extends Component {
    state = {
        owner: getUser()
    }

    render() {
        return (
            <>
                <Switch>
                    <Route exact path='/add-dog' component={DogForm}/>
                    <Route exact path='/add-dog/confirm' component={ConfirmAdd}/>
                </Switch>
            </>
        )
    }
};


