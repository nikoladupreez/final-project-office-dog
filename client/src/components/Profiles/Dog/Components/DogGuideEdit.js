import React, { Component } from 'react';
import axios from "axios";
import {getUser} from "../../../../utils/auth";

//style
import '../../../../styles/AddDog.scss';

export default class DogGuideEdit extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.increaseNumber = this.increaseNumber.bind(this);
        this.decreaseNumber = this.decreaseNumber.bind(this);
        this.goBack = this.goBack.bind(this);
        this.formPage7 = React.createRef();
        this.formPage8 = React.createRef();
        this.formPage9 = React.createRef();
        this.formPage10 = React.createRef();
    }

    state = {
        dogId: this.props.match.params.id,
        dog: {},
        foodBrand: "",
        foodFreq: 1,
        foodGrams: 0,
        foodHuman: "",
        walkAvgFreq: 0,
        walkAvgKm: 0,
        walkAvgMinutes: 0,
        poopAvgFreq: 0,
        cookiesAvgFreq: 0,
        userId: getUser()._id,
        page: 7,
        loading: true
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/dogs/dog/${this.state.dogId}`
        })
        .then((dog) => {
            this.setState({
                dog: dog.data,
                foodBrand: dog.data.food_info.brand,
                foodFreq: dog.data.food_info.frequency,
                foodGrams: dog.data.food_info.grams,
                foodHuman: dog.data.food_info.human,
                walkAvgFreq: dog.data.walk_info.avg_frequency,
                walkAvgKm: dog.data.walk_info.avg_km,
                walkAvgMinutes: dog.data.walk_info.avg_minutes,
                poopAvgFreq: dog.data.poop_avg_frequency,
                cookiesAvgFreq: dog.data.cookies_avg_frequency,
            })
        })
        .catch((err) => console.log(err.message));
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleSubmit(e) {
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/dogs/edit/dog-guide`,
            headers: { 'content-type': 'application/json' },
            data: JSON.stringify(this.state)
        })
        .then((dog) => {
            this.props.history.push({pathname: `/dog/${this.state.dogId}/profile/guide`, state: dog.data}); 
        })
        .catch((err) => console.log(err.message));
    }

    handleSelect(selection) {
       this.setState({foodHuman: selection});
    }

    goBack() {
       if(this.state.page === 7){
            this.props.history.go(-1);
       } else {
           let page = this.state.page;
           let pageNew = page - 1;
           this.setState({page: pageNew});
       }
    }

    goToNext(form){
        let newPageNr = this.state.page + 1;
        if (this.state.page === 8 && this.state.walkAvgFreq){
            this.setState({page: newPageNr});
        } else {
            this.setState({page: newPageNr});
        }
    }

    increaseNumber(target) {
        switch(target){
            case 'foodFreq':
                let foodFreq = this.state.foodFreq;
                let newFoodFreq = foodFreq + 1
                this.setState({foodFreq: newFoodFreq});
                break;
            case 'cookieFreq':
                let cookieFreq = this.state.cookiesAvgFreq;
                let newCookieFreq = cookieFreq + 1
                this.setState({cookiesAvgFreq: newCookieFreq});
                break;
            case 'walkFreq':
                let walkFreq = this.state.walkAvgFreq;
                let newWalkFreq = walkFreq + 1
                this.setState({walkAvgFreq: newWalkFreq});
                break;
            case 'walkKm':
                let walkKm = this.state.walkAvgKm;
                let newWalkKm = walkKm + 1
                this.setState({walkAvgKm: newWalkKm});
                break;
            case 'walkMinutes':
                let walkMin = this.state.walkAvgMinutes;
                let newWalkMin = walkMin + 1
                this.setState({walkAvgMinutes: newWalkMin});
                break;
            case 'poopFreq':
                let poopFreq = this.state.poopAvgFreq;
                let newPoopFreq = poopFreq + 1
                this.setState({poopAvgFreq: newPoopFreq});
                break;
            default:
                break;
        }
    }

    decreaseNumber(target) {
        switch(target){
            case 'foodFreq':
                if(this.state.foodFreq > 1){
                    let foodFreq = this.state.foodFreq;
                    let newFoodFreq = foodFreq - 1
                    this.setState({foodFreq: newFoodFreq});
                }
                break;
            case 'cookieFreq':
                if(this.state.cookiesAvgFreq > 0){
                    let cookieFreq = this.state.cookiesAvgFreq;
                    let newCookieFreq = cookieFreq - 1
                    this.setState({cookiesAvgFreq: newCookieFreq});
                }
                break;
            case 'walkFreq':
                if(this.state.walkAvgFreq > 0){
                    let walkFreq = this.state.walkAvgFreq;
                    let newWalkFreq = walkFreq - 1
                    this.setState({walkAvgFreq: newWalkFreq});
                }
                    break;
            case 'walkKm':
                if(this.state.walkAvgKm > 0){
                    let walkKm = this.state.walkAvgKm;
                    let newWalkKm = walkKm - 1
                    this.setState({walkAvgKm: newWalkKm});
                }
                break;
            case 'walkMinutes':
                if(this.state.walkAvgMinutes > 0){
                    let walkMin = this.state.walkAvgMinutes;
                    let newWalkMin = walkMin - 1
                    this.setState({walkAvgMinutes: newWalkMin});
                }
                break;
            case 'poopFreq':
                if(this.state.poopAvgFreq > 0){
                    let poopFreq = this.state.poopAvgFreq;
                    let newPoopFreq = poopFreq - 1
                    this.setState({poopAvgFreq: newPoopFreq});
                }
                break;
            default:
                break;
        }
    }

    render() {
        return (
                <div className='dog-guide-edit-container'>
                    <div className='back-box'>
                        <div onClick={this.goBack} className='back-icon'></div>
                    </div>
                    <div className={this.state.page === 7 ? 'dog-part-7' : 'hidden'}>
                            <form ref={form => this.formPage7 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                                <div className='dog-chapter-title-box'>
                                    <div className='chapter-icon-big diet-big'></div>
                                    <h1>Dietery info</h1>
                                </div>
                            <label>Food brand {this.state.name} eats</label>
                            <input className='foodbrand' onChange={this.handleChange} placeholder={this.state.foodBrand} type="text" name="foodBrand"/>
                            <label>Times fed a day</label>
                                <div className='diet-amount-box'>
                                    <div className='food-amount-control min'src='/' alt='min' onClick={() => {this.decreaseNumber('foodFreq')}}></div>
                                    <div className='diet-amount'><p>{this.state.foodFreq}</p></div>
                                    <div className='food-amount-control plus' onClick={() => {this.increaseNumber('foodFreq')}}></div>
                                </div>
                            <label>Amount fed per feeding</label>
                            <div className='diet-amount-box' id='grams-box'>
                                    <div className='empty'></div>
                                    <input id='diet-grams' onChange={this.handleChange} placeholder={this.state.foodGrams} type="number" name="foodGrams"/>
                                    <p>grams</p>
                            </div>
                                <label>Treats per day</label>
                                <div className='diet-amount-box'>
                                    <div className='food-amount-control min'onClick={() => {this.decreaseNumber('cookieFreq')}}></div>
                                    <div className='diet-amount'><p>{this.state.cookiesAvgFreq}</p></div>
                                    <div className='food-amount-control plus'onClick={() => {this.increaseNumber('cookieFreq')}}></div>
                                </div>
                            <label>Is {this.state.name} allowed to have human food?</label>
                            <div className='human-food-btn-box'>
                                    <button className='human-no' onClick={() => {this.handleSelect('no')}}>no</button>
                                    <button className='human-yes' onClick={() => {this.handleSelect('yes')}}>yes</button>
                                </div>
                            <div className='dog-next-btn-box'>
                                    <button id='food-next-btn' onClick={() => {this.goToNext(this.formPage7)}}>Next</button>
                            </div>
                            </form>
                        </div>

                        <div className={this.state.page === 8 ? 'dog-part-8' : 'hidden'}>
                                <div className='dog-chapter-title-box'>
                                    <div className='chapter-icon-big activity-big'></div>
                                    <h1>Activity info</h1>
                                </div>
                            <label className='walk-label'>How much do you usually walk {this.state.name}?</label>
                            <div className='activity-box'>
                                    <div className='empty'></div>
                                    <div className='activity-amount-box'>
                                            <div className='activity-amount-control min' onClick={() => {this.decreaseNumber('walkFreq')}}></div>
                                            <div className='activity-amount'><p>{this.state.walkAvgFreq}</p></div>
                                            <div className='activity-amount-control plus' onClick={() => {this.increaseNumber('walkFreq')}}></div>
                                    </div>
                                    <p>times <br/> a day</p>
                            </div>
                            <div className='activity-box'>
                                    <div className='empty'></div>
                                    <div className='activity-amount-box'>
                                            <div className='activity-amount-control min' onClick={() => {this.decreaseNumber('walkKm')}}></div>
                                            <div className='activity-amount'><p>{this.state.walkAvgKm}</p></div>
                                            <div className='activity-amount-control plus' onClick={() => {this.increaseNumber('walkKm')}}></div>
                                    </div>
                                    <p>km <br/> a day</p>
                            </div>
                            <div className='activity-box'>
                                    <div className='empty'></div>
                                    <div className='activity-amount-box'>
                                            <div className='activity-amount-control min' onClick={() => {this.decreaseNumber('walkMinutes')}}></div>
                                            <div className='activity-amount'><p>{this.state.walkAvgMinutes}</p></div>
                                            <div className='activity-amount-control plus' onClick={() => {this.increaseNumber('walkMinutes')}}></div>
                                    </div>
                                    <p>minutes <br/> a day</p>
                            </div>
                            <label className='poop-label'>How much does {this.state.name} poop?</label>
                            <div className='activity-box'>
                                    <div className='empty'></div>
                                    <div className='activity-amount-box'>
                                            <div className='activity-amount-control min' onClick={() => {this.decreaseNumber('poopFreq')}}></div>
                                            <div className='activity-amount'><p>{this.state.poopAvgFreq}</p></div>
                                            <div className='activity-amount-control plus' onClick={() => {this.increaseNumber('poopFreq')}}></div>
                                    </div>
                                    <p>poops <br/> a day</p>
                            </div>
                            <div className='dog-next-btn-box'>
                                    <button id='food-next-btn' onClick={this.handleSubmit}>Save</button>
                            </div>
                        </div>   
                    </div>
        )
    }
}

  