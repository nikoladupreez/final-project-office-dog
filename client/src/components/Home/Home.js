import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

//components
import DogspaceBox from './DogspaceBox';
import {getUser} from "../../utils/auth";

export default class Home extends Component {
    state = {
        myDogList: [],
        coworkerDogList: [],
        user: getUser(),
        userPopulated: {},
    }

    userHasDogs() {
        if(this.state.myDogList.length > 0 || this.state.coworkerDogList.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/users/${this.state.user._id}`
        })
        .then((user) => {
            this.setState({userPopulated: user});

            if(user.owner) this.setState({myDogList: user.owner.dogs});
            if(user.dog_manager) this.setState({coworkerDogList: user.dog_manager.dogs});
        })
        .catch((err) => console.log(err.message));
    }

    render() {
        return (
            <div>
                <h1>Dogspaces</h1>
                <div>
                    <div>
                        <div>
                            <Link to='/user/profile'><img src='/' alt='user-profile'/></Link>
                        </div>
                    </div>
                    <div className={!this.userHasDogs() ? 'dog-container' : 'hidden'}>
                        <h1>Whoops! No dogs yet..</h1>
                    </div>
                    <div className={this.userHasDogs() ? 'dog-container' : 'hidden'}>
                        <h1>My dogs</h1>
                        <div>
                            {this.state.myDogList.map((dog, index) => {
                                return (
                                    <DogspaceBox
                                        key={index}
                                        id={dog.id}
                                        avatar={dog.avatar}
                                        name={dog.name}
                                    />
                                )
                            })}
                        </div>
                        <h1>My coworker's dogs</h1>
                        <div>
                            {this.state.coworkerDogList.map((dog, index) => {
                                return (
                                    <DogspaceBox
                                        key={index}
                                        id={dog.id}
                                        avatar={dog.avatar}
                                        name={dog.name}
                                    />
                                )
                            })}
                        </div>
                    </div>
                    <div>
                        <Link to='/add-dog'><button>Add dog</button></Link>
                    </div>
                </div>       
            </div>
        )
    }
}
