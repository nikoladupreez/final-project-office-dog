import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {getUser} from '../../../../utils/auth';

//components
import ProfileLinkDog from '../../ProfileLinkDog';

//style
import '../../../../styles/DogProfile.scss';
import Loader from '../../../../images/spacedog1.svg';

export default class DogProfile extends Component {
    state = {
        dog: {},
        dogId: this.props.match.params.id,
        age: 0,
        ageType: "",
        dogOwnerId: "",
        userId: "",
        loading: true
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/dogs/dog/${this.state.dogId}`
        })
        .then((dog) => {
            this.setState({dog: dog.data})
            this.getDogAge();
            this.setState({dogOwnerId: dog.data.owner._id});
            this.setState({userId: getUser()._id});
        })
        .catch((err) => console.log(err.message))
        .finally(() => {
            setTimeout(() => {
                this.setState({loading: false});
            }, 1000)
        })
    }

    getDogAge() {
        let today = new Date();
        let yearToday = today.getFullYear();

        let dog = {...this.state.dog};
        let birthday = dog.birthday;
        let birthYear = parseInt(birthday.slice(0,4));
   
        let age = yearToday - birthYear;
        this.setState({age: age});
    }

    render() {
        return (
                    <div className='dogprofile-container'>
                        <div className='nav-profile'>
                            <div className='empty'></div>
                            <Link to={`/dog/${this.state.dogId}/home`}><div className='doghome-icon-small'></div></Link>
                        </div>
                        {this.state.loading ?
                            <div className='loader-container'>
                                <div className='loader-box'>
                                    <img src={Loader} alt='spacedog'/>
                                    <p>Fetching balls...</p>
                                </div> 
                            </div>
                            :
                            <>
                                <div className='dog-profile-info-box'>
                                    <div className='dog-profile-img'>
                                        <img src={this.state.dog.avatar} alt='dog-icon'/>
                                    </div>
                                    <div className='dog-profile-info'>
                                        <h1>{this.state.dog.name}</h1>
                                        <h2>{this.state.dog.breed}</h2>
                                        <h2>{this.state.age} years old</h2>
                                        <h2>{this.state.dog.gender}</h2>
                                    </div>
                                </div>
                                {this.state.dogOwnerId ? 
                                    <div className='link-container'>
                                    {this.state.dogOwnerId === this.state.userId ?
                                        <>
                                            <ProfileLinkDog id='link-box-dog' url={`/dog/${this.state.dogId}/profile/edit`} title={`Edit ${this.state.dog.name}'s Profile`}/>
                                            <ProfileLinkDog id='link-box-dog' url={`/dog/${this.state.dogId}/profile/guide`} title={`${this.state.dog.name}'s Guide`}/>
                                            <ProfileLinkDog id='link-box-dog' url={`/dog/${this.state.dogId}/profile/managers`} title='Dog Managers'/>
                                            <ProfileLinkDog id='link-box-dog' url='/home' icon='/' title='Go to another Dogspace'/>
                                        </>
                                        :
                                        <>
                                            <ProfileLinkDog id='link-box-dog' url={`/dog/${this.state.dogId}/profile/guide`} title={`${this.state.dog.name}'s Guide`}/>
                                            <ProfileLinkDog id='link-box-dog' url={`/dog/${this.state.dogId}/profile/managers`} title='Dog Managers'/>
                                            <ProfileLinkDog id='link-box-dog' url='/home' icon='/' title='Go to another Dogspace'/>
                                        </>
                                    }
                                    </div>
                                    : <></>
                                }
                            </>
                        }
                    </div>
        )
    }
};