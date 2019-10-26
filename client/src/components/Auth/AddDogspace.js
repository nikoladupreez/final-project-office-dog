import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';

//components
import {getUser} from "../../utils/auth";
import DogForm from './components/DogForm';
import DogConfirm from './components/DogConfirm';

export default class AddDogspace extends Component {
    state = {
        owner: getUser()
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


