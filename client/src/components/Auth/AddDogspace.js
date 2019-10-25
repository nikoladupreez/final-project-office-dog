import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';
import axios from "axios";
import DogForm from './components/DogForm';
import DogConfirm from './components/DogConfirm';

export default class AddDogspace extends Component {
    state = {
        owner: JSON.parse(localStorage.getItem('user'))
    }

    render() {
        return (
            <>
                <Switch>
                    <Route path='/add-dog' component={DogForm}/>
                    <Route path='/confirm-dog'>
                        <DogConfirm
                            ownerName={this.state.owner.firstname}
                            dogName={this.props.location.state.dog.name}
                            dogId={this.props.location.state.dog.id}
                        />
                    </Route>
                </Switch>
            </>
        )
    }
};


