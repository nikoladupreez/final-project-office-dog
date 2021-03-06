import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

//style
import '../../../../styles/DogGuide.scss';
import Loader from '../../../../images/spacedog1.svg';
import { thisExpression } from '@babel/types';


export default class DogGuide extends Component {
    state = {
        dogId: this.props.match.params.id, 
        dog: {},
        loading: true
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/dogs/dog/${this.state.dogId}`
        })
        .then((dog) => {
            this.setState({dog: dog.data})
        })
        .catch((err) => console.log(err.message))
        .finally(() => {
            setTimeout(() => {
                this.setState({loading: false});
            }, 1000)
        })
    }

    render() {
        return (
            <div className='dogguide-container'>
                        {this.state.loading ?
                            <div className='loader-container-guide'>
                                <div className='loader-box'>
                                    <img src={Loader} alt='spacedog'/>
                                    <p>Fetching balls...</p>
                                </div> 
                            </div>
                            :
                            <>
                                <div className='top-container'>
                                    <div className='back-box'>
                                        <Link to={`/dog/${this.state.dogId}/profile`}><div className='close-icon'></div></Link>
                                        {/* <Link to={`/dog/${this.state.dogId}/profile/guide/edit`}><img src={crossIcon} alt='back'/></Link> */}
                                    </div>
                                    <div className='dogguide-title'>
                                        <h1>{this.state.dog.name}'s Guide</h1>
                                    </div>
                                </div>
                                <div className='guide-scroll'>
                                    <div className='guide-title-box'>
                                        <h2>Dietary information</h2>
                                    </div>
                                    <div className='guide-container guide1'>
                                        <div className='guide-box'>
                                            <div className='guide-bone'></div>
                                            <p>The food brand {this.state.dog.name} eats is <span>{this.state.dog.food_info.brand}</span></p>
                                        </div>
                                        <div className='guide-box'>
                                            <div className='guide-bone'></div>
                                            <p>{this.state.dog.name} gets fed <span>{this.state.dog.food_info.frequency}</span> times a day</p>
                                        </div>
                                        <div className='guide-box'>
                                            <div className='guide-bone'></div>
                                            <p>The amount per feeding is <span>{this.state.dog.food_info.grams}</span> grams</p>
                                        </div>
                                        <div className='guide-box'>
                                            <div className='guide-bone'></div>
                                            <p>{this.state.dog.name} gets <span>{this.state.dog.cookies_avg_frequency}</span> treats per day </p>
                                        </div>
                                        <div className='guide-box'>
                                            <div className='guide-bone'></div>
                                            <p>{this.state.dog.name} {this.state.dog.food_info.human === 'yes' ? <span>is</span> : <span>is not</span>} allowed to eat human food!</p>
                                        </div>
                                    </div>
                                    <div className='guide-title-box'>
                                        <h2>Activity information</h2>
                                    </div>
                                    <div className='guide-container guide2'>
                                        <div className='guide-box'>
                                            <div className='guide-paw'></div>
                                            <p>{this.state.dog.name} gets walked <span>{this.state.dog.walk_info.avg_frequency}</span> times a day </p>
                                        </div>
                                        <div className='guide-box'>
                                            <div className='guide-paw'></div>
                                            <p>These walks in total take up about <span>{this.state.dog.walk_info.avg_km}</span> kilometers </p>
                                        </div>
                                        <div className='guide-box'>
                                            <div className='guide-paw'></div>
                                            <p>That’s almost <span>{this.state.dog.walk_info.avg_minutes}</span> minutes! </p>
                                        </div>
                                        <div className='guide-box'>
                                            <div className='guide-paw'></div>
                                            <p>During those walks {this.state.dog.name} poops  <span>{this.state.dog.poop_avg_frequency}</span> times! Good luck!</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
            </div>
        )
    }
}
