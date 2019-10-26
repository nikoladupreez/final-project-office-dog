import React, { Component } from 'react';
import axios from 'axios';
import {Route, Switch} from 'react-router-dom';

//components
import ProfileLink from '../ProfileLink';
import DogGuide from './DogGuide';
import ManagerList from './ManagerList';
import AddDogManagers from './Components/AddDogManagers';

export class DogProfile extends Component {
    state = {
        dog: {},
        dogId: this.props.match.params.id,
        age: null
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/dogs/dog/${this.state.dogId}`
        })
        .then((dog) => this.setState({dog: JSON.parse(dog)}))
        .catch((err) => console.log(err.message));
    }

    render() {
        return (
            <Switch>
                <Route path={`/dog/${this.state.dogId}/profile`}>
                    <div>
                        <div>
                            <img src='/' alt='dog-icon'/>
                        </div>
                        <div>
                            <img src={this.state.dog.avatar} alt='dog-avatar'/>
                            <h1>{this.state.dog.name}</h1>
                            <h2>{this.state.dog.gender}</h2>
                            <h2>{this.state.age} y/o</h2>
                            <h2>{this.state.dog.breed}</h2>
                        </div>
                        <div>
                            <ProfileLink url={`/dog/${this.state.dogId}/guide`} icon='/' title={`${this.state.dog.name}s guide`}/>
                            <ProfileLink url={`/dog/${this.state.dogId}/trackings`} icon='/' title='trackings'/>
                            <ProfileLink url={`/dog/${this.state.dogId}/managers`} icon='/' title={`${this.state.dog.name}s managers`}/>
                        </div>
                    </div>
                 </Route>
                 <Route path={`/dog/${this.state.dogId}/guide`}>
                     <DogGuide/>
                 </Route>
                 <Route path={`/dog/${this.state.dogId}/managers`}>
                     <ManagerList/>
                 </Route>
                 <Route path={`/dog/${this.state.dogId}/add-managers`}>
                     <AddDogManagers/>
                 </Route>
            </Switch>
            
        )
    }
};