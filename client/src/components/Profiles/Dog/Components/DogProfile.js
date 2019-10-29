import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

//components
import ProfileLink from '../../ProfileLink';

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
                    <div>
                        <Link to={`/dog/${this.state.dogId}/home`}><p>Back</p></Link>
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
                            <ProfileLink url={`/dog/${this.state.dogId}/profile/guide`} icon='/' title={`${this.state.dog.name}s guide`}/>
                            <ProfileLink url={`/dog/${this.state.dogId}/profile/managers`} icon='/' title={`${this.state.dog.name}s managers`}/>
                        </div>
                    </div>
        )
    }
};