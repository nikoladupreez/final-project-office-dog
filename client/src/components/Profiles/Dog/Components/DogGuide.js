import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

export default class DogGuide extends Component {
    state = {
        dogId: this.props.match.params.id, 
        dog: {}
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
            <div>
                <Link to={`/dog/${this.state.dogId}/profile`}><button>Back</button></Link>
                <h1>{this.state.dog.name}s guide</h1>
                <h2>Dietary info</h2>
                <p>{this.state.dog.food_info.brand}</p>
                <p>{this.state.dog.food_info.frequency}x a day {this.state.dog.food_info.grams} grams</p>
                { (this.state.dog.food_info.human === 'No') ?
                        <p>No human food allowed!</p>
                  :
                        <p>Human food allowed.</p>
                }
                <h2>Activity info</h2>
                <h3>{this.state.dog.name} walks</h3>
                <p>{this.state.dog.walk_info.avg_frequency} times</p>
                <p>{this.state.dog.walk_info.avg_km} km</p>
                <p>{this.state.dog.walk_info.avg_minutes} minutes a day</p>
                <h3>{this.state.dog.name} poops</h3>
                <p>{this.state.dog.poop_avg_frequency} times day</p>
                <h3>Gets treats</h3>
                <p>{this.state.dog.cookies_avg_frequency} times day</p>
            </div>
        )
    }
}
