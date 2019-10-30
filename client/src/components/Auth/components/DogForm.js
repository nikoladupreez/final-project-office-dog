import React, { Component } from 'react';
import axios from "axios";
import {getUser, setUser} from "../../../utils/auth";
import chevronIcon from '../../../images/light.png';
import crossIcon from '../../../images/cross.svg';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

//style
import '../../../styles/AddDog.scss';

export default class AddDogspace extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.selectBreed = this.selectBreed.bind(this);
        this.deleteBreed = this.deleteBreed.bind(this);
        this.increaseNumber = this.increaseNumber.bind(this);
        this.decreaseNumber = this.decreaseNumber.bind(this);
        this.goBack = this.goBack.bind(this);
        this.getDogAge = this.getDogAge.bind(this);
        this.formPage1 = React.createRef();
        this.formPage3 = React.createRef();
        this.formPage4 = React.createRef();
        this.formPage5 = React.createRef();
        this.formPage7 = React.createRef();
        this.formPage8 = React.createRef();
        this.formPage9 = React.createRef();
        this.formPage10 = React.createRef();
        this.breedList = [];
        this.commandList = [];
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
        user: getUser(),
        breedsShown: [],
        translate: false,
        isValidated: true,
        page: 10
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
       })
       .catch((err) => console.log(err));
    }

    handleDateChange = (date) => {
        this.getDogAge(date) 
        this.setState({birthday: date});
    };

    handleChange(e) {
        if(e.target.id === 'birthday'){
            this.getDogAge(e.target.value);
        } else {
            this.setState({[e.target.name]: e.target.value})
        }
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
    }

    handleSubmit(e) {
        let user = this.state.user;
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
                    setUser(updatedUser.data);
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
    }

    goBack() {
       if(this.state.page === 1){
            this.props.history.go(-1);
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
        } else if (this.state.page === 4 && this.state.gender){
            this.setState({page: newPageNr});
        } else if (this.state.page === 8 && this.state.walkAvgFreq){
            this.setState({page: newPageNr});
        } else if (form.checkValidity()){
            this.setState({page: newPageNr});
        }
    }

    selectBreed = (breedName) => {  
        this.setState({breed: breedName});
        console.log(this.state.breed)
        
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
    }

    setBirthday(){
        if(this.state.age){
            let age = this.state.age;
            let today = new Date();
            let year = today.getFullYear();
            let birthYear = year - age;
            this.setState({birthday: `${birthYear}-01-01`})
        }
    }

    getDogAge(dogBirthday) {
        let today = new Date();
        let yearToday = today.getFullYear();
        let birthYear = dogBirthday.getFullYear();
   
        let age = yearToday - birthYear;
        this.setState({age: age});
    }

    render() {
        return (
                <div className='add-dog-container'>
                    <div className='add-dog-back-box'>
                        <img onClick={this.goBack} src={chevronIcon} alt='back'/>
                    </div>
                    <div className={this.state.page === 1 ? 'dog-part-1' : 'hidden'}>
                        <img src='/' alt='add-dog'/>
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
                            <label>What is the breed of {this.state.name}?</label>
                            <input type='text' name='breed-search' onChange={this.handleSearch} placeholder='Search'/>
                        </div>
                        {this.state.breed ? 
                            <div className='dog-breed-select-box'>
                                <div className='dog-breed-selected'>
                                    <h2>{this.state.breed}</h2>
                                    <img src={crossIcon} alt='crossIcon' onClick={this.deleteBreed}/>
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
                    </div>

                    <div className={this.state.page === 3 ? 'dog-part-3' : 'hidden'}>
                        <h1>How old is {this.state.name}?</h1>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} className='datepicker'>
                            <Grid container justify="space-around">
                                <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="dd-MM-yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                value={this.state.birthday ? this.state.birthday : new Date()}
                                onChange={this.handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                        <p>Don’t know {this.state.name}'s exact date of birth? Share it's estimated age:</p>
                        <div className='dog-age-control'>
                            <img className={this.state.birthday ? 'hidden' : 'age-control'} src='/' alt='min' onClick={() => {this.decreaseNumber('age')}}/>
                            <div className='dog-age-box'>
                                <p>{this.state.age}</p>
                            </div>
                            <img className={this.state.birthday ? 'hidden' : 'age-control'} src='/' alt='plus' onClick={() => {this.increaseNumber('age')}}/>
                        </div>
                        <div className='dog-age-text'>
                            <p>years old</p>
                        </div>
                        <div className='dog-next-btn-box'>
                            <button className='nxt-btn' onClick={() => {this.goToNext()}} disabled={this.state.isValidated === false}>Next</button>   
                        </div>        
                    </div>

                    <div className={this.state.page === 4 ? 'dog-part-4' : 'hidden'}>
                        <label>What is the gender of {this.state.name}?</label>
                        <div className='gender-btn-box'>
                            <button onClick={() => {this.handleSelect('male')}}>male</button>
                            <button onClick={() => {this.handleSelect('female')}}>female</button>
                        </div>
                        <div className='dog-next-btn-box'>
                            <button onClick={() => {this.goToNext()}} disabled={this.state.isValidated === false}>Next</button>
                        </div>
                    </div>

                    <div className={this.state.page === 5 ? 'dog-part-5' : 'hidden'}>
                        <form ref={form => this.formPage5 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                            <h1>Choose an avatar for {this.state.name}</h1>
                            <div className='dog-avatar-container'>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src='/' alt='avatar1'/></div><input required onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src='/' alt='avatar2'/></div><input required onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src='/' alt='avatar3'/></div><input required onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src='/' alt='avatar4'/></div><input required onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src='/' alt='avatar5'/></div><input required onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src='/' alt='avatar6'/></div><input required onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src='/' alt='avatar7'/></div><input required onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src='/' alt='avatar8'/></div><input required onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src='/' alt='avatar9'/></div><input required onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
                                    </div>
                            </div>
                            <div className='dog-next-btn-box'>
                                <button onClick={() => {this.goToNext(this.formPage5)}} disabled={this.state.isValidated === false}>Next</button>
                            </div>
                        </form>
                    </div>
                    
                    <div className={this.state.page === 6 ? 'dog-part-6' : 'hidden'}>
                        <img src='/' alt='add-dog'/>
                        <div className='dog-part-6-box'>
                            <p>That was it for the general information! Let’s build {this.state.name} an office dog guide for coworkers to research! Chapters:</p>
                            <div className='dog-chapters'>
                                <div className='dog-chapter'><img src='/' alt='chapter-icon'/><p>Dietary information</p></div>
                                <div className='dog-chapter'><img src='/' alt='chapter-icon'/><p>Activity information</p></div>
                                <div className='dog-chapter'><img src='/' alt='chapter-icon'/><p>Emergency contacts</p></div>
                                <div className='dog-chapter'><img src='/' alt='chapter-icon'/><p>Commands dictionary</p></div>
                            </div>
                            <div className='dog-next-btn-box'>
                                <button onClick={() => {this.goToNext(this.formPage5)}} disabled={this.state.isValidated === false}>Next</button>
                            </div>
                        </div>
                    </div>

                    <div className={this.state.page === 7 ? 'dog-part-7' : 'hidden'}>
                        <form ref={form => this.formPage7 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                            <div className='dog-chapter-title-box'>
                                <img src='/' alt='chapter-icon'/>
                                <h1>Dietery information</h1>
                            </div>
                           <label>Food brand {this.state.name} eats</label>
                           <input required onChange={this.handleChange} value={this.state.foodBrand} placeholder="Food brand" type="text" name="foodBrand"/>
                           <label>Times fed a day</label>
                            <div className='diet-amount-box'>
                                <img src='/' alt='min' onClick={() => {this.decreaseNumber('foodFreq')}}/>
                                <div className='diet-amount'><p>{this.state.foodFreq}</p></div>
                                <img src='/' alt='plus' onClick={() => {this.increaseNumber('foodFreq')}}/>
                            </div>
                           <label>Amount fed per feeding</label>
                           <div className='diet-amount-box'>
                                <div className='empty'></div>
                                <input id='diet-grams'required onChange={this.handleChange} placeholder='100' type="number" name="foodGrams"/>
                                <p>grams</p>
                           </div>
                            <label>Treats per day</label>
                            <div className='diet-amount-box'>
                                <img src='/' alt='min' onClick={() => {this.decreaseNumber('cookieFreq')}}/>
                                <div className='diet-amount'><p>{this.state.cookiesAvgFreq}</p></div>
                                <img src='/' alt='plus' onClick={() => {this.increaseNumber('cookieFreq')}}/>
                            </div>
                           <label>Is {this.state.name} allowed to have human food?</label>
                           <div className='human-food-btn-box'>
                                <button onClick={() => {this.handleSelect('no')}}>no</button>
                                <button onClick={() => {this.handleSelect('yes')}}>yes</button>
                            </div>
                           <div className='dog-next-btn-box'>
                                <button className='food-next-btn' onClick={() => {this.goToNext(this.formPage7)}} disabled={this.state.isValidated === false}>Next</button>
                           </div>
                        </form>
                    </div>

                    <div className={this.state.page === 8 ? 'dog-part-8' : 'hidden'}>
                            <div className='dog-chapter-title-box'>
                                <img src='/' alt='chapter-icon'/>
                                <h1>Activity information</h1>
                            </div>
                           <label>How much do you usually walk {this.state.name}?</label>
                           <div className='activity-box'>
                                <div className='empty'></div>
                                <div className='activity-amount-box'>
                                        <img src='/' alt='min' onClick={() => {this.decreaseNumber('walkFreq')}}/>
                                        <div className='activity-amount'><p>{this.state.walkAvgFreq}</p></div>
                                        <img src='/' alt='plus' onClick={() => {this.increaseNumber('walkFreq')}}/>
                                </div>
                                <p>times <br/> a day</p>
                           </div>
                           <div className='activity-box'>
                                <div className='empty'></div>
                                <div className='activity-amount-box'>
                                        <img src='/' alt='min' onClick={() => {this.decreaseNumber('walkKm')}}/>
                                        <div className='activity-amount'><p>{this.state.walkAvgKm}</p></div>
                                        <img src='/' alt='plus' onClick={() => {this.increaseNumber('walkKm')}}/>
                                </div>
                                <p>km <br/> a day</p>
                           </div>
                           <div className='activity-box'>
                                <div className='empty'></div>
                                <div className='activity-amount-box'>
                                        <img src='/' alt='min' onClick={() => {this.decreaseNumber('walkMinutes')}}/>
                                        <div className='activity-amount'><p>{this.state.walkAvgMinutes}</p></div>
                                        <img src='/' alt='plus' onClick={() => {this.increaseNumber('walkMinutes')}}/>
                                </div>
                                <p>minutes <br/> a day</p>
                           </div>
                           <label>How much does {this.state.name} poop?</label>
                           <div className='activity-box'>
                                <div className='empty'></div>
                                <div className='activity-amount-box'>
                                        <img src='/' alt='min' onClick={() => {this.decreaseNumber('poopFreq')}}/>
                                        <div className='activity-amount'><p>{this.state.poopAvgFreq}</p></div>
                                        <img src='/' alt='plus' onClick={() => {this.increaseNumber('poopFreq')}}/>
                                </div>
                                <p>poops <br/> a day</p>
                           </div>
                           <div className='dog-next-btn-box'>
                                <button onClick={() => {this.goToNext()}} disabled={this.state.isValidated === false}>Next</button>
                           </div>
                    </div>   

                    <div className={this.state.page === 9 ? 'dog-part-9' : 'hidden'}>
                        <div className='dog-part-9-chapter'>
                            <div className='dog-chapter-title-box'>
                                    <img src='/' alt='chapter-icon'/>
                                    <h1>Emergency card</h1>
                            </div>
                        </div>
                        <form ref={form => this.formPage9 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                           <label>Dutch Animal Ambulance</label>
                           <p>0900 0245</p>
                           <label>{this.state.name}'s Owner</label>
                           <p>{this.state.user.name}</p>
                           <p>{this.state.user.phone}</p>
                           <label>Emergency contact 1</label>
                           <input required onChange={this.handleChange} value={this.state.ice1Name} placeholder="Name" type="text" name="ice1Name"/>
                           <input required onChange={this.handleChange} value={this.state.ice1Phone} placeholder="Phone number" type="text" name="ice1Phone"/>
                           <label>Emergency contact 2</label>
                           <input onChange={this.handleChange} value={this.state.ice2Name} placeholder="Name" type="text" name="ice2Name"/>
                           <input onChange={this.handleChange} value={this.state.ice2Phone} placeholder="Phone number" type="text" name="ice2Phone"/>
                           <label>Veterinary</label>
                           <input required onChange={this.handleChange} value={this.state.vetName} placeholder="Name" type="text" name="vetName"/>
                           <input required onChange={this.handleChange} value={this.state.vetCompany} placeholder="Company name" type="text" name="vetCompany"/>
                           <input required onChange={this.handleChange} value={this.state.vetPhone} placeholder="Phone number" type="text" name="vetPhone"/>
                           <div className='dog-next-btn-box'>
                                <button onClick={() => {this.goToNext(this.formPage9)}} disabled={this.state.isValidated === false}>Next</button>
                           </div>
                        </form>
                    </div>

                    <div className={this.state.page === 10 ? 'dog-part-10' : 'hidden'}>
                        <div className='dog-chapter-title-box'>
                            <img src='/' alt='chapter-icon'/>
                            <h1>Commands</h1>
                        </div>
                        <h2>Pick the commands {this.state.name} knows so your coworkers can start communicate! </h2>
                        <form ref={form => this.formPage10 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                           {this.commandList.map((command, index) => {
                               return (
                                   <div key={index} className='dog-command-option-box'>
                                        <div className='dog-command-option'>
                                            <label><div className='dog-command-box'>{command.commando}</div><input key={index} onChange={this.handleCheckbox} value={command._id} type="checkbox" name="commands"/></label>
                                        </div>
                                   </div>
                               )
                           })}
                        </form>
                        <div className='dog-translate'>
                            <label className='translate-label'>Translate commands to english</label> 
                            <div class="switch-container">
                                <label class="switch" for="checkbox">
                                    <input onChange={this.handleCheckbox} type="checkbox" id="checkbox" name='translation'/>
                                    <div class="slider round"></div>
                                </label>
                            </div>
                        </div>
                        <div className='dog-next-btn-box'>
                            <button onClick={this.handleSubmit} disabled={this.state.isValidated === false}>Next</button>
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


