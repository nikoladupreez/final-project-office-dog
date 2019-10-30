import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

//components
import ProfileLink from '../../ProfileLink';

//style
import '../../../../styles/DogProfile.scss';

export default class DogProfile extends Component {
    state = {
        dog: {},
        dogId: this.props.match.params.id,
        age: 0,
        ageType: ""
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/dogs/dog/${this.state.dogId}`
        })
        .then((dog) => {
            this.setState({dog: dog.data})
            this.getDogAge();
        })
        .catch((err) => console.log(err.message));
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
                            <div className='dogprofile-icon-big'></div>
                            <Link to={`/dog/${this.state.dogId}/home`}><div className='doghome-icon-small'></div></Link>
                        </div>
                        <div className='dog-profile-info-box'>
                            <div className='dog-profile-img'>
                                <img src={this.state.dog.avatar} alt='dog-icon'/>
                            </div>
                            <div className='dog-profile-info'>
                                <h2>{this.state.dog.name}</h2>
                                <h2>{this.state.dog.gender}</h2>
                                <h2>{this.state.age} y/o</h2>
                                <h2>{this.state.dog.breed}</h2>
                            </div>
                        </div>
                        <div className='link-container'>
                            <ProfileLink url={`/dog/${this.state.dogId}/profile/guide`} icon='/' title={`${this.state.dog.name}'s Guide`}/>
                            <ProfileLink url={`/dog/${this.state.dogId}/profile/managers`} icon='/' title='Dog Managers'/>
                            <ProfileLink url='/home' icon='/' title='Go to another Dogspace'/>
                        </div>
                    </div>
        )
    }
};