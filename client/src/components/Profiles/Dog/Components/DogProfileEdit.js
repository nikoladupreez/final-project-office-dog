import React, { Component } from 'react';
import axios from "axios";
import {getUser} from "../../../../utils/auth";
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

//style
import '../../../../styles/AddDog.scss';

export default class DogProfileEdit extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
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
        userId: getUser()._id,
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
            this.getDogAge(this.state.birthday)
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

    handleSubmit(e) {
        this.setBirthday();

        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/dogs/edit/profile`,
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
        let today = new Date();
        let yearToday = today.getFullYear();
        let birthYear = dogBirthday.getFullYear();
   
        let age = yearToday - birthYear;
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
                            <form ref={form => this.formPage1 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                                <label>What is your dog's name?</label>
                                <input onChange={this.handleChange} value={this.state.name} placeholder={this.state.dog.name} type="text" name="name"/>
                                <div className='dog-btn-box'>
                                    <button onClick={() => {this.goToNext(this.formPage1)}} disabled={this.state.isValidated === false}>Next</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className={this.state.page === 2 ? 'dog-part-2' : 'hidden'}>
                        <div className='dog-breed-label'>
                            <label>What is the breed of {this.state.name}?</label>
                            <input type='text' name='breed-search' onChange={this.handleSearch} placeholder={this.state.dog.breed}/>
                        </div>
                        {this.state.loading ? <h1>Loading...</h1> : 
                            <>
                                {this.state.breed ? 
                                    <div className='dog-breed-select-box'>
                                        <div className='dog-breed-selected'>
                                            <h2>{this.state.breed}</h2>
                                            <div className='delete-icon' onClick={this.deleteBreed}></div>
                                        </div>
                                        <button onClick={() => {this.goToNext()}}>Next</button>
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
                                enableToolbar
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
                            <button className='nxt-btn' onClick={() => {this.goToNext()}}>Next</button>   
                        </div>        
                    </div>

                    <div className={this.state.page === 4 ? 'dog-part-4' : 'hidden'}>
                        <label>What is {this.state.name}'s <br/> gender?</label>
                        <div className='gender-btn-box'>
                            <button className='male' onClick={() => {this.handleSelect('male')}}>male</button>
                            <button className='female' onClick={() => {this.handleSelect('female')}}>female</button>
                        </div>
                        <div className='dog-next-btn-box'>
                            <button onClick={() => {this.goToNext()}}>Next</button>
                        </div>
                    </div>

                    <div className={this.state.page === 5 ? 'dog-part-5' : 'hidden'}>
                        <form ref={form => this.formPage5 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                            <h1>Choose an avatar <br/> for {this.state.name}</h1>
                            <div className='dog-avatar-container'>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src='/' alt='avatar1'/></div><input onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src='/' alt='avatar2'/></div><input onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src='/' alt='avatar3'/></div><input onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src='/' alt='avatar4'/></div><input onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src='/' alt='avatar5'/></div><input onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src='/' alt='avatar6'/></div><input onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src='/' alt='avatar7'/></div><input onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src='/' alt='avatar8'/></div><input onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
                                    </div>
                                    <div className='dog-avatar-option'>
                                        <label><div className='dog-avatar-box'><img src='/' alt='avatar9'/></div><input onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
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
