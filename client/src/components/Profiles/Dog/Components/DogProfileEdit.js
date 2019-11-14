import React, { Component } from 'react';
import axios from "axios";
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

//style
import '../../../../styles/AddDog.scss';
import dog1 from '../../../../images/akita.svg';
import dog2 from '../../../../images/bulldog.svg';
import dog3 from '../../../../images/corgi.svg';
import dog4 from '../../../../images/frenchdog.svg';
import dog5 from '../../../../images/husky.svg';
import dog6 from '../../../../images/retriever.svg';
import dog7 from '../../../../images/rotweiler.svg';
import dog8 from '../../../../images/samson.svg';
import dog9 from '../../../../images/shepherd.svg';

const TextFieldComponent = (props) => {
    return <TextField {...props} disabled={true}/>
}

export default class DogProfileEdit extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleRadio        = this.handleRadio.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.selectBreed = this.selectBreed.bind(this);
        this.deleteBreed = this.deleteBreed.bind(this);
        this.increaseNumber = this.increaseNumber.bind(this);
        this.decreaseNumber = this.decreaseNumber.bind(this);
        this.goBack = this.goBack.bind(this);
        this.getDogAge = this.getDogAge.bind(this);
        this.goToNext           = this.goToNext.bind(this);
        this.breedList = [];
    }

    state = {
        dogId: this.props.match.params.id,
        dog: {},
        name: "",
        breed: "", 
        birthday: "",
        age: 0,
        gender: "",
        avatar: "",
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

    getDog() {
        return (
            axios({
                method: "GET",
                url: `${process.env.REACT_APP_API}/dogs/dog/${this.state.dogId}`
            })
        )
    }

    componentDidMount() {
        Promise.all([this.getBreedList(), this.getDog()])
        .then(([breeds, dog]) => {
             this.breedList = breeds.data;
             this.setState({breedsShown: breeds.data});
             this.setState({
                dog: dog.data,
                name: dog.data.name,
                breed: dog.data.breed,
                birthday: dog.data.birthday,
                gender: dog.data.gender,
                avatar: dog.data.avatar
            })
            this.setState({loading: false});
            this.getDogAge(dog.data.birthday);
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
            this.setBirthday();
        } else {
            this.setState({[e.target.name]: e.target.value})
        }
    }

    handleRadio(e){
        if(e.target.checked){
            this.setState({
                [e.target.name]: e.target.value
            })
        }
    }

    handleSubmit(e) {
        debugger;
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/dogs/dog/${this.state.dogId}/profile-edit`,
            headers: { 'content-type': 'application/json' },
            data: JSON.stringify(this.state)
        })
        .then((dog) => {
           this.props.history.push({pathname: `/dog/${this.state.dogId}/profile`, state: dog.data}); 
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
        } else {
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
        let age = this.state.age;
        let newAge = age + 1
        this.setState({age: newAge});
    }

    decreaseNumber(target) {
        if(this.state.age > 0){
            let age = this.state.age;
            let newAge = age - 1
            this.setState({age: newAge});
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
        let age = 0;
        if (dogBirthday) {
            let today = new Date();
            let yearToday = today.getFullYear();
            let birthYear = dogBirthday.getFullYear();
    
            age = yearToday - birthYear;
        }
        this.setState({age: age});
    }

    render() {
        return (
                <div className='dog-guide-edit-container'>
                <div className='back-box'>
                        <div onClick={this.goBack} className='back-icon'></div>
                    </div>
                    <div className={this.state.page === 1 ? 'dog-part-1' : 'hidden'}>
                        <div className='dog-part-1-box'>
                            <form onSubmit={(e) => {e.preventDefault(); return false}}>
                                <label>What is your dog's name?</label>
                                <input onChange={this.handleChange} value={this.state.name} placeholder={this.state.dog.name} type="text" name="name"/>
                                <div className='dog-btn-box'>
                                    <button onClick={this.goToNext} disabled={!this.state.name}>Next</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className={this.state.page === 2 ? 'dog-part-2' : 'hidden'}>
                        <div className='dog-breed-label'>
                            <label>What breed is {this.state.name}?</label>
                            <input type='text' name='breed-search' onChange={this.handleSearch} placeholder={this.state.dog.breed}/>
                        </div>
                        {this.state.loading ? <h1>Loading...</h1> : 
                            <>
                                {this.state.breed ? 
                                    <div className='dog-breed-select-box'>
                                        <div className='dog-breed-selected'>
                                            <h2>{this.state.breed}</h2>
                                            <div className='close-icon-manager' onClick={this.deleteBreed}></div>
                                        </div>
                                        <button onClick={this.goToNext} disabled={!this.state.breed}>Next</button>
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
                                TextFieldComponent={TextFieldComponent}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                        <p className='part-3-text'>Don’t know {this.state.name}'s exact date of birth? <br/> Share it's estimated age:</p>
                        <div className='dog-age-control'>
                            <div className={this.state.birthday ? 'hidden' : 'age-control age-min disabled'} id={this.state.age > 0 ? 'active' : 'disabled'} src='/' alt='min' onClick={() => {this.decreaseNumber('age')}}><div className='min-icon'></div></div>
                            <div className='dog-age-box'>
                                <p>{this.state.age}</p>
                            </div>
                            <div className={this.state.birthday ? 'hidden' : 'age-control age-plus active'} id='active' src='/' alt='plus' onClick={() => {this.increaseNumber('age')}}><div className='plus-icon'></div></div>
                        </div>
                        <div className='dog-age-text'>
                            <p>years old</p>
                        </div>
                        <div className='dog-next-btn-box'>
                            <button className='nxt-btn' onClick={this.goToNext}>Next</button>   
                        </div>        
                    </div>

                    <div className={this.state.page === 4 ? 'dog-part-4' : 'hidden'}>
                        <label>What is {this.state.name}'s <br/> gender?</label>
                        <div className='gender-btn-box'>
                            <button id={this.state.gender === 'Male' ? 'male' : 'non-active'} onClick={() => {this.handleSelect('Male')}}>male</button>
                            <button id={this.state.gender === 'Female' ? 'female' : 'non-active'} onClick={() => {this.handleSelect('Female')}}>female</button>
                        </div>
                        <div className='dog-next-btn-box'>
                            <button onClick={this.goToNext} disabled={!this.state.gender}>Next</button>
                        </div>
                    </div>

                    <div className={this.state.page === 5 ? 'dog-part-5' : 'hidden'}>
                        <form onSubmit={(e) => {e.preventDefault(); return false}}>
                            <h1>Choose an avatar <br/> for {this.state.name}</h1>
                            <div className='dog-avatar-container'>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src={dog1} alt='avatar1'/></div><input checked={this.state.avatar === dog1 ? true : false} onChange={this.handleRadio} type='radio' value={dog1} name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src={dog2}  alt='avatar2'/></div><input checked={this.state.avatar === dog2 ? true : false} onChange={this.handleRadio} type='radio' value={dog2} name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src={dog3}  alt='avatar3'/></div><input checked={this.state.avatar === dog3 ? true : false} onChange={this.handleRadio} type='radio' value={dog3} name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src={dog4}  alt='avatar4'/></div><input checked={this.state.avatar === dog4 ? true : false}onChange={this.handleRadio} type='radio' value={dog4} name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src={dog5}  alt='avatar5'/></div><input checked={this.state.avatar === dog5 ? true : false} onChange={this.handleRadio} type='radio' value={dog5} name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src={dog6}  alt='avatar6'/></div><input checked={this.state.avatar === dog6 ? true : false} onChange={this.handleRadio} type='radio' value={dog6} name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src={dog7}  alt='avatar7'/></div><input checked={this.state.avatar === dog7 ? true : false}onChange={this.handleRadio} type='radio' value={dog7} name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src={dog8}  alt='avatar8'/></div><input checked={this.state.avatar === dog8 ? true : false} onChange={this.handleRadio} type='radio' value={dog8}name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src={dog9}  alt='avatar9'/></div><input checked={this.state.avatar === dog9 ? true : false} onChange={this.handleRadio} type='radio' value={dog9}name='avatar'/></label> 
                                    </div>
                            </div>
                            <div className='dog-next-btn-box'>
                                <button onClick={this.handleSubmit}>Save</button>
                            </div>
                        </form>
                    </div>

                </div>
        )
    }
}
