import React, { Component } from 'react';
import axios from "axios";
import qs from "querystring";
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

import ListBox from './ListBox';

export default class AddDogManagers extends Component {
    constructor(props){
        super(props);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.searchValue = React.createRef();
    }

    state = {
        dog: {},
        dogId: this.props.match.params.id,
        dogManagers: this.state.dog.dog_manager,
        users: []
    }

    getUser(email){
        let userJSON = (
            axios({
                method: "GET",
                url: `${process.env.REACT_APP_API}/users/email/${email}`
            })
        );

        if (userJSON) {
            return JSON.parse(userJSON);
        }
    }

    getDog(){
        let dogJSON = (
            axios({
                method: "GET",
                url: `${process.env.REACT_APP_API}/dog/${this.state.dogId}`
            })
        );

        if (dogJSON) {
            return JSON.parse(dogJSON);
        } 
    }

    componentDidMount() {
        this.setState({dog: this.getDog()});
    }

    handleSearch(e) {
        let user = this.getUser(this.searchValue);
        let dogManagers = [...this.state.dogManagers];
        if(user){
            if(user.dog_manager.dogs.contains(this.state.dogId)){
                // alert that user is already a manager
            } else {
                dogManagers.push(user);
                this.setState({dogManagers: dogManagers});
            }
        } else {
            // alert that user does not exist yet
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/dogs/${this.state.dogId}/add-managers`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(this.state.dogManagers),
        })
        .then((res) => {
            history.push(`/dog/${this.state.dogId}/managers`); 
        })
        .catch((err) => {
            console.log(err.message);
        })
    }

    deleteManager(id){
        let dogManagers = [...this.state.dogManagers];
        let dogManagersNew = dogManagers.filter((manager) => {
            return !(manager.id === id)
        });

        this.setState({dogManagers: dogManagersNew});
    }

    render() {
        return (
                <div>
                    <input type='text' placeholder='Search user email...' ref={this.searchValue}/>
                    <button onClick={this.handleSearch} disabled={!this.searchValue}>Search</button>
                    <div>
                        {this.state.dogManagers.map((manager) => {
                            return (
                                <ListBox
                                    id={manager.id}
                                    name={manager.firstname}
                                    deleteManager={() => this.deleteManager(manager.id)}
                                />
                            )
                        })}  
                    </div>
                    <button onClick={this.handleSubmit}>Add</button>
                </div>
        )
    }
};