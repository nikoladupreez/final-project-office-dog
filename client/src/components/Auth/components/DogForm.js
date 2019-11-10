import React, { Component } from 'react';
import axios from "axios";
import {getUser, setUser} from "../../../utils/auth";
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

//style
import '../../../styles/AddDog.scss';
import dog1 from '../../../images/akita.svg';
import dog2 from '../../../images/bulldog.svg';
import dog3 from '../../../images/corgi.svg';
import dog4 from '../../../images/frenchdog.svg';
import dog5 from '../../../images/husky.svg';
import dog6 from '../../../images/retriever.svg';
import dog7 from '../../../images/rotweiler.svg';
import dog8 from '../../../images/samson.svg';
import dog9 from '../../../images/shepherd.svg';

export default class AddDogspace extends Component {
    constructor(props){
        super(props);
        this.handleRadio        = this.handleRadio.bind(this);
        this.handleChange       = this.handleChange.bind(this);
        this.handleCheckbox     = this.handleCheckbox.bind(this);
        this.handleSubmit       = this.handleSubmit.bind(this);
        this.handleSearch       = this.handleSearch.bind(this);
        this.selectBreed        = this.selectBreed.bind(this);
        this.deleteBreed        = this.deleteBreed.bind(this);
        this.increaseNumber     = this.increaseNumber.bind(this);
        this.decreaseNumber     = this.decreaseNumber.bind(this);
        this.goBack             = this.goBack.bind(this);
        this.getDogAge          = this.getDogAge.bind(this);
        this.formPage1          = React.createRef();
        this.formPage3          = React.createRef();
        this.formPage4          = React.createRef();
        this.formPage5          = React.createRef();
        this.formPage7          = React.createRef();
        this.formPage8          = React.createRef();
        this.formPage9          = React.createRef();
        this.formPage10         = React.createRef();
        this.breedList          = [];
        this.commandList        = [];
        this.user               = getUser();
    }

    state = {
        id: "",
        name: "",
        breed: "", 
        birthday: "",
        age: 0,
        gender: "",
        avatar: "",
        foodBrand: "",
        foodFreq: 1,
        foodGrams: 0,
        foodHuman: "",
        walkAvgFreq: 0,
        walkAvgKm: 0,
        walkAvgMinutes: 0,
        poopAvgFreq: 0,
        cookiesAvgFreq: 0,
        ice1Name: "",
        ice1Phone: "",
        ice2Name: "",
        ice2Phone: "",
        vetName: "",
        vetCompany: "",
        vetPhone: "",
        commands: [],
        translate: false,
        userId: getUser()._id,
        ownerId: getUser().owner,
        breedsShown: [],
        isValidated: false,
        page: 1,
        loading: true
    }

    getBreedList() {
        return (
            axios({
                method: "GET",
                url: "https://api.thedogapi.com/v1/breeds", 
                headers: {
                    'Authorization': process.env.apiKeyBreeds
                }
            })
        )
    }

    getCommandList() {
        return (
            axios({
                method: "GET",
                url: `${process.env.REACT_APP_API}/dogs/commands`, 
            })
        )
    }

    componentDidMount() {
       Promise.all([this.getBreedList(), this.getCommandList()])
       .then(([breeds, commands]) => {
            this.breedList = breeds.data;
            this.commandList = commands.data;
            this.setState({breedsShown: breeds.data});
            this.setState({loading: false});
       })
       .catch((err) => console.log(err));
    }

    handleDateChange = (date) => {
        this.getDogAge(date) 
        this.setState({birthday: date});
        this.checkValidation()
    };

    handleChange(e) {
        if(e.target.id === 'birthday'){
            this.getDogAge(e.target.value);
        } else {
            this.setState({[e.target.name]: e.target.value})
        }
        this.checkValidation()
    }

    handleCheckbox(e){
        if(e.target.name === 'translation'){
            if(e.target.checked){
                this.setState({translation: true});
            } else {
                this.setState({translation: false});
            }
        } else {
            let array = [...this.state[e.target.name]];
            if(e.target.checked){         
                array.push(e.target.value)
                this.setState({[e.target.name]: array})
            } else {
                let arrayNew = array.filter((element) => {
                    return !(element === e.target.value)
                });
                this.setState({[e.target.name]: arrayNew});
            }  
        }
        this.checkValidation()
    }

    handleRadio(e){
        if(e.target.checked){
            this.setState({
                [e.target.name]: e.target.value
            })
        }

        this.setState({isValidated: true});
    }

    handleSubmit(e) {
        let user = getUser();
        this.setBirthday();

        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/dogs/add-dog`,
            headers: { 'content-type': 'application/json' },
            data: JSON.stringify(this.state)
        })
        .then((res) => {
            if(!user.owner){
                axios({
                    method: "GET",
                    url: `${process.env.REACT_APP_API}/users/${user._id}`
                })
                .then((updatedUser) => {
                    user.owner = updatedUser.data.owner.id;
                    setUser(user);
                    this.props.history.push({pathname: '/add-dog/confirm', state: res.data}); 
                })
                .catch((err) => console.log(err.message));
            } else {
                this.props.history.push({pathname: '/add-dog/confirm', state: res.data}); 
            }
        })
        .catch((err) => console.log(err.message));
    }

    handleSearch(e) {
        let searchQuery = e.target.value;
        let searchResult = this.breedList.filter((breed) => {
          return (breed.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1)
        });
        this.setState({breedsShown: searchResult});
    }

    handleSelect(selection) {
        switch (this.state.page){
            case 4:
                this.setState({gender: selection});
                break;
            case 7:
                this.setState({foodHuman: selection});
                break;
            default:
                break; 
        }
        this.setState({isValidated: true})
    }

    goBack() {
       if(this.state.page === 1){
            this.props.history.go(-1);
       } else if (this.state.page === 4){
           let page = this.state.page;
           let pageNew = page - 1;
           this.setState({page: pageNew});
           this.setState({isValidated: true})
       } else {
            let page = this.state.page;
            let pageNew = page - 1;
            this.setState({page: pageNew});
       }
    }

    goToNext(form){
        let newPageNr = this.state.page + 1;
        if (this.state.page === 2 && this.state.breed){
            this.setState({page: newPageNr});
        } else if (this.state.page === 3 && this.state.age){
            this.setState({page: newPageNr});
            this.setState({isValidated: false})
        } else if (this.state.page === 4 && this.state.gender){
            this.setState({page: newPageNr});
            this.setState({isValidated: false})
        } else if (this.state.page === 8 && this.state.walkAvgFreq){
            this.setState({page: newPageNr});
            this.setState({isValidated: false})
        } else {
            this.setState({page: newPageNr});
            this.setState({isValidated: false})
        }
    }

    selectBreed = (breedName) => {  
        this.setState({breed: breedName});
        this.checkValidation()
    }

    deleteBreed() {
        this.setState({breed: ""});
    }

    increaseNumber(target) {
        switch(target){
            case 'age':
                let age = this.state.age;
                let newAge = age + 1
                this.setState({age: newAge});
                break;
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
        this.checkValidation()
    }

    decreaseNumber(target) {
        switch(target){
            case 'age':
                if(this.state.age > 0){
                    let age = this.state.age;
                    let newAge = age - 1
                    this.setState({age: newAge});
                }
                break;
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
        this.checkValidation()
    }

    setBirthday(){
        if(this.state.age && !this.state.birthday){
            let age = this.state.age;
            let today = new Date();
            let year = today.getFullYear();
            let birthYear = year - age;
            this.setState({birthday: `${birthYear}-01-01`})
        }
    }

    getDogAge(dogBirthday) {
        let age = 0;
        if (dogBirthday) {
            let today = new Date();
            let yearToday = today.getFullYear();
            let birthYear = dogBirthday.getFullYear();
            age = yearToday - birthYear;
        }   
        this.setState({age: age});
    }

    checkValidation(){
        switch(this.state.page){
            case 1:
                if(this.state.name){
                    this.setState({isValidated: true});
                }
                break;
            case 2:
                this.setState({isValidated: true});
                break;
            case 3:
                this.setState({isValidated: true});
                break;
            case 4:
                if(this.state.gender){
                    this.setState({isValidated: true});
                }
                break;
            case 5:
                if(this.state.avatar){
                    this.setState({isValidated: true});
                }
                break;
            case 6:
                this.setState({isValidated: true});
                break;
            case 7:
                if(this.state.foodBrand && this.state.foodFreq && this.state.foodGrams && this.state.cookiesAvgFreq){
                    this.setState({isValidated: true});
                }
                break;
            case 8:
                if(this.state.walkAvgFreq && this.state.walkAvgKm && this.state.walkAvgMinutes && this.state.poopAvgFreq){
                    this.setState({isValidated: true});
                }
                break;
            case 9:
                if(this.state.ice1Name && this.state.ice1Phone && this.state.vetName && this.state.vetPhone)if(this.state.name){
                    this.setState({isValidated: true});
                }
                break;
            default:
                this.setState({isValidated: true});
                break;
        }
    }

    render() {
        return (
                <div className='add-dog-container'>
                    <div className='back-box'>
                        <div onClick={this.goBack} className='back-icon'></div>
                    </div>
                    <div className={this.state.page === 1 ? 'dog-part-1' : 'hidden'}>
                        <div className='add-dog-illustration1'></div>
                        <div className='dog-part-1-box'>
                            <p>This office dogspace onboarding exists of 2 parts: general information and some personalized guide building. Let’s start with some general info:</p>
                            <form ref={form => this.formPage1 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                                <label>What is your dog's name?</label>
                                <input required onChange={this.handleChange} value={this.state.name} placeholder="Takkie" type="text" name="name"/>
                                <div className='dog-btn-box'>
                                    <button onClick={() => {this.goToNext(this.formPage1)}} disabled={this.state.isValidated === false}>Next</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className={this.state.page === 2 ? 'dog-part-2' : 'hidden'}>
                        <div className='dog-breed-label'>
                            <label>What breed is {this.state.name}?</label>
                            <input type='text' name='breed-search' onChange={this.handleSearch} placeholder='Search'/>
                        </div>
                        {this.state.loading ? <h1>Loading...</h1> : 
                            <>
                                {this.state.breed ? 
                                    <div className='dog-breed-select-box'>
                                        <div className='dog-breed-selected'>
                                            <h2>{this.state.breed}</h2>
                                            <div className='delete-icon' onClick={this.deleteBreed}></div>
                                        </div>
                                        <button onClick={() => {this.goToNext()}} disabled={this.state.isValidated === false}>Next</button>
                                    </div>
                                : 
                                    <div className='dog-breed-list'>
                                        {this.state.breedsShown.map((breed, index) => {
                                                return (
                                                <div key={index} onClick={() => {this.selectBreed(breed.name)}} className='dog-breed-box'>
                                                    <h2>{breed.name}</h2>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </>
                        }
                    </div>

                    <div className={this.state.page === 3 ? 'dog-part-3' : 'hidden'}>
                        <h1>How old is {this.state.name}?</h1>
                        <label>Date of Birth</label>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} className='datepicker'>
                            <Grid container justify="space-around">
                                <KeyboardDatePicker
                                enabletoolbar='true'
                                variant="inline"
                                format="dd-MM-yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                value={this.state.birthday ? this.state.birthday : new Date()}
                                onChange={this.handleDateChange}
                                PopoverProps={{style: {...{left: '15px'}}}}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                        <p>Don’t know {this.state.name}'s exact date of birth? <br/> Share it's estimated age:</p>
                        <div className='dog-age-control'>
                            <div className={this.state.birthday ? 'hidden' : 'age-control age-min'} src='/' alt='min' onClick={() => {this.decreaseNumber('age')}}><div className='min-icon'></div></div>
                            <div className='dog-age-box'>
                                <p>{this.state.age}</p>
                            </div>
                            <div className={this.state.birthday ? 'hidden' : 'age-control age-plus'} src='/' alt='plus' onClick={() => {this.increaseNumber('age')}}><div className='plus-icon'></div></div>
                        </div>
                        <div className='dog-age-text'>
                            <p>years old</p>
                        </div>
                        <div className='dog-next-btn-box'>
                            <button className='nxt-btn' onClick={() => {this.goToNext()}} disabled={this.state.isValidated === false}>Next</button>   
                        </div>        
                    </div>

                    <div className={this.state.page === 4 ? 'dog-part-4' : 'hidden'}>
                        <label>What is {this.state.name}'s <br/> gender?</label>
                        <div className='gender-btn-box'>
                            <button className='male' onClick={() => {this.handleSelect('Male')}}>male</button>
                            <button className='female' onClick={() => {this.handleSelect('Female')}}>female</button>
                        </div>
                        <div className='dog-next-btn-box'>
                            <button onClick={() => {this.goToNext()}} disabled={this.state.isValidated === false}>Next</button>
                        </div>
                    </div>

                    <div className={this.state.page === 5 ? 'dog-part-5' : 'hidden'}>
                        <form ref={form => this.formPage5 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                            <h1>Choose an avatar <br/> for {this.state.name}</h1>
                            <div className='dog-avatar-container'>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src={dog1} alt='avatar1'/></div><input required onChange={this.handleRadio} type='radio' value={dog1} name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src={dog2}  alt='avatar2'/></div><input required onChange={this.handleRadio} type='radio' value={dog2} name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src={dog3}  alt='avatar3'/></div><input required onChange={this.handleRadio} type='radio' value={dog3} name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src={dog4}  alt='avatar4'/></div><input required onChange={this.handleRadio} type='radio' value={dog4} name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src={dog5}  alt='avatar5'/></div><input required onChange={this.handleRadio} type='radio' value={dog5} name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src={dog6}  alt='avatar6'/></div><input required onChange={this.handleRadio} type='radio' value={dog6} name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src={dog7}  alt='avatar7'/></div><input required onChange={this.handleRadio} type='radio' value={dog7} name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src={dog8}  alt='avatar8'/></div><input required onChange={this.handleRadio} type='radio' value={dog8}name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src={dog9}  alt='avatar9'/></div><input required onChange={this.handleRadio} type='radio' value={dog9}name='avatar'/></label> 
                                    </div>
                            </div>
                            <div className='dog-next-btn-box'>
                                <button onClick={() => {this.goToNext(this.formPage5)}} disabled={this.state.isValidated === false}>Next</button>
                            </div>
                        </form>
                    </div>
                    
                    <div className={this.state.page === 6 ? 'dog-part-6' : 'hidden'}>
                        <div className='add-dog-illustration2'/>
                        <div className='dog-part-6-box'>
                            <h1>Nice work!</h1>
                            <p>That was it for the general information! Let’s build {this.state.name} an office dog guide for coworkers to research! Chapters:</p>
                            <div className='dog-chapters'>
                                <div className='dog-chapter'><div className='chapter-icon diet'></div><p>Dietary information</p></div>
                                <div className='dog-chapter'><div className='chapter-icon activity'></div><p>Activity information</p></div>
                                <div className='dog-chapter'><div className='chapter-icon emergency'></div><p>Emergency contacts</p></div>
                                <div className='dog-chapter'><div className='chapter-icon dictionary'></div><p>Commands dictionary</p></div>
                            </div>
                            <div className='dog-next-btn-box'>
                                <button onClick={() => {this.goToNext(this.formPage5)}}>Create guide</button>
                            </div>
                        </div>
                    </div>

                    <div className={this.state.page === 7 ? 'dog-part-7' : 'hidden'}>
                        <form ref={form => this.formPage7 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                            <div className='dog-chapter-title-box'>
                                <h1>Dietery information</h1>
                            </div>
                           <label>Food brand {this.state.name} eats</label>
                           <input className='foodbrand' required onChange={this.handleChange} value={this.state.foodBrand} placeholder="Food brand" type="text" name="foodBrand"/>
                           <label>Times fed a day</label>
                            <div className='diet-amount-box'>
                                <div className='food-amount-control min'src='/' alt='min' onClick={() => {this.decreaseNumber('foodFreq')}}></div>
                                <div className='diet-amount'><p>{this.state.foodFreq}</p></div>
                                <div className='food-amount-control plus' onClick={() => {this.increaseNumber('foodFreq')}}></div>
                            </div>
                           <label>Amount fed per feeding</label>
                           <div className='diet-amount-box' id='grams-box'>
                                <div className='empty'></div>
                                <input id='diet-grams'required onChange={this.handleChange} placeholder='100' type="number" name="foodGrams"/>
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
                                <button id='food-next-btn' onClick={() => {this.goToNext(this.formPage7)}} disabled={this.state.isValidated === false}>Next</button>
                           </div>
                        </form>
                    </div>

                    <div className={this.state.page === 8 ? 'dog-part-8' : 'hidden'}>
                            <div className='dog-chapter-title-box'>
                                <h1>Activity info</h1>
                            </div>
                           <label className='walk-label'>How much do you usually walk {this.state.name}?</label>
                           <div className='activity-box'>
                                <div className='activity-amount-box'>
                                        <div className='activity-amount-control min' onClick={() => {this.decreaseNumber('walkFreq')}}></div>
                                        <div className='activity-amount'><p>{this.state.walkAvgFreq}</p></div>
                                        <div className='activity-amount-control plus' onClick={() => {this.increaseNumber('walkFreq')}}></div>
                                </div>
                                <p>times a day</p>
                           </div>
                           <div className='activity-box'>
                                <div className='activity-amount-box'>
                                        <div className='activity-amount-control min' onClick={() => {this.decreaseNumber('walkKm')}}></div>
                                        <div className='activity-amount'><p>{this.state.walkAvgKm}</p></div>
                                        <div className='activity-amount-control plus' onClick={() => {this.increaseNumber('walkKm')}}></div>
                                </div>
                                <p>km a day</p>
                           </div>
                           <div className='activity-box'>
                                <div className='activity-amount-box'>
                                        <div className='activity-amount-control min' onClick={() => {this.decreaseNumber('walkMinutes')}}></div>
                                        <div className='activity-amount'><p>{this.state.walkAvgMinutes}</p></div>
                                        <div className='activity-amount-control plus' onClick={() => {this.increaseNumber('walkMinutes')}}></div>
                                </div>
                                <p>minutes a day</p>
                           </div>
                           <label className='poop-label'>How much does {this.state.name} poop?</label>
                           <div className='activity-box'>
                                <div className='activity-amount-box'>
                                        <div className='activity-amount-control min' onClick={() => {this.decreaseNumber('poopFreq')}}></div>
                                        <div className='activity-amount'><p>{this.state.poopAvgFreq}</p></div>
                                        <div className='activity-amount-control plus' onClick={() => {this.increaseNumber('poopFreq')}}></div>
                                </div>
                                <p>poops a day</p>
                           </div>
                           <div className='dog-next-btn-box'>
                                <button id='food-next-btn' onClick={() => {this.goToNext()}} disabled={this.state.isValidated === false}>Next</button>
                           </div>
                    </div>   

                    <div className={this.state.page === 9 ? 'dog-part-9' : 'hidden'}>
                        <div className='dog-part-9-chapter'>
                            <div className='dog-chapter-title-box'>
                                    <h1>Emergency card</h1>
                            </div>
                        </div>
                        <form ref={form => this.formPage9 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                           <label>Dutch Animal Ambulance</label>
                           <p className='ambulance-nr'>0900 0245</p>
                           <label>{this.state.name}'s Owner</label>
                           <p className='owner-info'>{this.user.name}</p>
                           <p className='owner-info'>{this.user.phone}</p>
                           <label>Emergency contact 1</label>
                           <input className='ice-contact-info' required onChange={this.handleChange} value={this.state.ice1Name} placeholder="Name" type="text" name="ice1Name"/>
                           <input className='ice-contact-info' required onChange={this.handleChange} value={this.state.ice1Phone} placeholder="Phone number" type="text" name="ice1Phone"/>
                           <label>Emergency contact 2</label>
                           <input className='ice-contact-info' onChange={this.handleChange} value={this.state.ice2Name} placeholder="Name" type="text" name="ice2Name"/>
                           <input className='ice-contact-info' onChange={this.handleChange} value={this.state.ice2Phone} placeholder="Phone number" type="text" name="ice2Phone"/>
                           <label>Veterinary</label>
                           <input className='vet-info' required onChange={this.handleChange} value={this.state.vetName} placeholder="Name" type="text" name="vetName"/>
                           <input className='vet-info' required onChange={this.handleChange} value={this.state.vetCompany} placeholder="Company name" type="text" name="vetCompany"/>
                           <input className='vet-info' required onChange={this.handleChange} value={this.state.vetPhone} placeholder="Phone number" type="text" name="vetPhone"/>
                           <div className='dog-next-btn-box'>
                                <button id='food-next-btn' onClick={() => {this.goToNext(this.formPage9)}} disabled={this.state.isValidated === false}>Next</button>
                           </div>
                        </form>
                    </div>

                    <div className={this.state.page === 10 ? 'dog-part-10' : 'hidden'}>
                        <div className='dog-chapter-title-box'>
                            <h1>Commands</h1>
                        </div>
                        <h2>Pick the commands {this.state.name} knows so your coworkers can start communicate! </h2>
                        <form ref={form => this.formPage10 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                           {this.commandList.map((command, index) => {
                               return (
                                   <div key={index} className='dog-command-option-box'>
                                        <div className='dog-command-option'>
                                            <label><div className='dog-command-box'><p>{command.commando}</p></div><input key={index} onChange={this.handleCheckbox} value={command._id} type="checkbox" name="commands"/></label>
                                        </div>
                                   </div>
                               )
                           })}
                        </form>
                        <div className='dog-translate'>
                            <label className='translate-label'>Show english translation</label> 
                            <div className="switch-container">
                                <label className="switch">
                                    <input onChange={this.handleCheckbox} type="checkbox" id="checkbox" name='translation'/>
                                    <div className="slider round"></div>
                                </label>
                            </div>
                        </div>
                        <div className='dog-next-btn-box'>
                            <button id='food-next-btn' onClick={this.handleSubmit} disabled={this.state.isValidated === false}>Next</button>
                        </div>
                    </div>
                    
                    {this.state.page === 1 || this.state.page === 3 || this.state.page === 4 || this.state.page === 5 ? 
                        <div className='dog-dots-box'>
                            <div className={this.state.page === 1 ? 'dog-dot-select' : 'dog-dot'}></div>
                            <div className={this.state.page === 2 ? 'dog-dot-select' : 'dog-dot'}></div>
                            <div className={this.state.page === 3 ? 'dog-dot-select' : 'dog-dot'}></div>
                            <div className={this.state.page === 4 ? 'dog-dot-select' : 'dog-dot'}></div>
                            <div className={this.state.page === 5 ? 'dog-dot-select' : 'dog-dot'}></div>
                        </div>
                        : <></>}

                    {this.state.page === 2 && this.state.breed ? 
                        <div className='dog-dots-box'>
                            <div className={this.state.page === 1 ? 'dog-dot-select' : 'dog-dot'}></div>
                            <div className={this.state.page === 2 ? 'dog-dot-select' : 'dog-dot'}></div>
                            <div className={this.state.page === 3 ? 'dog-dot-select' : 'dog-dot'}></div>
                            <div className={this.state.page === 4 ? 'dog-dot-select' : 'dog-dot'}></div>
                            <div className={this.state.page === 5 ? 'dog-dot-select' : 'dog-dot'}></div>
                        </div>
                        : <></>}

                    {this.state.page === 7 || this.state.page === 8 || this.state.page === 9 || this.state.page === 10  ? 
                        <div className='dog-dots-box'>
                            <div className={this.state.page === 7 ? 'dog-dot-select' : 'dog-dot'}></div>
                            <div className={this.state.page === 8 ? 'dog-dot-select' : 'dog-dot'}></div>
                            <div className={this.state.page === 9 ? 'dog-dot-select' : 'dog-dot'}></div>
                            <div className={this.state.page === 10 ? 'dog-dot-select' : 'dog-dot'}></div>
                        </div>
                        : <></>}
                </div>
        )
    }
};


