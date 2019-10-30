import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import crossIcon from '../../../../images/cross.svg';

//style
import '../../../../styles/DogGuide.scss';


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
        .then((dog) => {
            this.setState({dog: dog.data})
            console.log(this.state.dog)
        })
        .catch((err) => console.log(err.message));
    }

    render() {
        return (
            <div className='dogguide-container'>
                <div className='back-box'>
                    <Link to={`/dog/${this.state.dogId}/profile`}><img src={crossIcon} alt='back'/></Link>
                </div>
                <div className='dogguide-title'>
                    <h1>{this.state.dog.name}s Guide</h1>
                </div>
                <div className='guide-scroll'>
                    <div className='guide-title-box'>
                        <h2>Dietary information</h2>
                    </div>
                    <div className='guide-container guide1'>
                        <div className='guide-box'>
                            <div className='guide-bone'></div>
                            <p>The food brand {this.state.dog.name} eats is <span>[food brand]</span></p>
                        </div>
                        <div className='guide-box'>
                            <div className='guide-bone'></div>
                            <p>{this.state.dog.name} gets fed <span>[number]</span> times a day</p>
                        </div>
                        <div className='guide-box'>
                            <div className='guide-bone'></div>
                            <p>The amount per feeding is <span>[number]</span> grams</p>
                        </div>
                        <div className='guide-box'>
                            <div className='guide-bone'></div>
                            <p>{this.state.dog.name} gets <span>[number]</span> treats per day </p>
                        </div>
                        <div className='guide-box'>
                            <div className='guide-bone'></div>
                            <p>{this.state.dog.name} <span>[is not]/ [is]</span> allowed to eat human food!</p>
                        </div>
                    </div>
                    <div className='guide-title-box'>
                        <h2>Activity information</h2>
                    </div>
                    <div className='guide-container guide2'>
                        <div className='guide-box'>
                            <div className='guide-paw'></div>
                            <p>{this.state.dog.name} gets walked <span>[number]</span> times a day </p>
                        </div>
                        <div className='guide-box'>
                            <div className='guide-paw'></div>
                            <p>These walks in total take up about <span>[number]</span> kilometers </p>
                        </div>
                        <div className='guide-box'>
                            <div className='guide-paw'></div>
                            <p>That’s almost <span>[number]</span> hours! </p>
                        </div>
                        <div className='guide-box'>
                            <div className='guide-paw'></div>
                            <p>During those walks {this.state.dog.name} poops  <span>[number]</span> times! Good luck!</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
