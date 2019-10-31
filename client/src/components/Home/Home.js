import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import userIcon from '../../images/shape.svg';

//components
import DogspaceBox from './DogspaceBox';
import {getUser} from "../../utils/auth";

//style
import '../../styles/Home.scss';

export default class Home extends Component {
    state = {
        myDogList: [],
        coworkerDogList: [],
        user: getUser(),
        userPopulated: {},
    }

    userHasDogs() {
        if(this.state.myDogList.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    userManagesDogs() {
        if(this.state.coworkerDogList.length > 0) {
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
            this.setState({userPopulated: user.data});

            if(user.data.owner) this.setState({myDogList: user.data.owner.dogs});
            if(user.data.dog_manager) this.setState({coworkerDogList: user.data.dog_manager.dogs});
        })
        .catch((err) => console.log(err.message));
    }

    render() {
        return (
            <div className='home-container'>
                    <div className='home-user-box'>
                        <Link to='/user/profile'><div className='user-icon'></div></Link>
                    </div>
                    <div className={!this.userHasDogs() && !this.userManagesDogs() ? 'dog-container' : 'hidden'}>
                        <h1 className='oeps'>Whoops!</h1>
                        <div className='sample-dogspace-box'>
                            <div className='sample-dogspace-subbox'>
                                <div className='sample-dogspace-img'></div>
                                <h1 className='sample'>Dogspace</h1>
                            </div>
                        </div>
                        <p>You're not connected to a dogspace yet, ask the dogowner to add you! </p>
                    </div>
                    <div className={this.userHasDogs() ? 'dog-container' : 'hidden'}>
                        <div>
                            {this.state.myDogList.map((dog, index) => {
                                return (
                                    <DogspaceBox
                                        owner='true'
                                        key={index}
                                        id={dog._id}
                                        avatar={dog.avatar}
                                        name={dog.name}
                                    />
                                )
                            })}
                        </div>
                    </div>
                    <div className={this.userManagesDogs() ? 'dog-container' : 'hidden'}>
                        <div>
                            {this.state.coworkerDogList.map((dog, index) => {
                                return (
                                    <DogspaceBox
                                        owner='false'
                                        key={index}
                                        id={dog._id}
                                        avatar={dog.avatar}
                                        name={dog.name}
                                    />
                                )
                            })}
                        </div>
                    </div>
                    <div className='home-add-dog-box'>
                        <div className='home-or-box'>
                            <div className='home-or-line'></div>
                            <div className='home-or'>
                                <p>or</p>
                            </div>
                            <div className='home-or-line'></div>
                        </div>
                        <div className='home-create-dog-box'>
                            <h1>Create a dogspace!</h1>
                            <p>Are you an office dog owner and want to start using Dogspace? Create one here!</p>
                            <Link to='/add-dog'><button><div className='add-dogspace-box'><div className='add-dogspace-img'><div className='asterix'></div></div>Create dogspace</div></button></Link>
                        </div>
                    </div>      
            </div>
        )
    }
}
