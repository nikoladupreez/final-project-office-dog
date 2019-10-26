import React, { Component } from 'react';
import axios from "axios";
// import qs from "querystring";
import {getUser} from "../../../utils/auth";

//components

export default class AddDogspace extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.handleRadio = this.handleRadio.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.formPage1 = React.createRef();
        this.formPage2 = React.createRef();
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
        gender: "",
        avatar: "",
        foodBrand: "",
        foodFreq: 0,
        foodGrams: 0,
        foodHuman: "",
        foodDanger: [], 
        walkAvgFreq: 0,
        walkAvgKm: 0,
        walkAvgMinutes: 0,
        poopAvgFreq: 0,
        cookiesAvgFreq: 0,
        chipNumber: "",
        ice1Name: "",
        ice1Phone: "",
        ice2Name: "",
        ice2Phone: "",
        vetName: "",
        vetPhone: "",
        commands: [],
        owner: getUser(),
        page: 1
    }

    goToNext(form){
        let newPageNr = this.state.page + 1;
        if (form.checkValidity()){
            this.setState({page: newPageNr});
        }
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
       })
       .catch((err) => console.log(err));
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value 
        })
    }

    handleCheckbox(e){
        debugger; 
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
            url: `${process.env.REACT_APP_API}/dogs/add-dog`,
            headers: { 'content-type': 'application/json' },
            data: JSON.stringify(this.state)
        })
        .then((res) => {
            this.props.history.push({pathname: '/add-dog/confirm', state: res.data}); 
        })
        .catch((err) => console.log(err.message));
    }

    render() {
        return (
                <div className='add-dog-container'>
                    <div className={this.state.page === 1 ? 'part-1' : 'hidden'}>
                        <form ref={form => this.formPage1 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                            <label>What is your dog's name?</label>
                            <input required onChange={this.handleChange} value={this.state.name} placeholder="Takkie" type="text" name="name"/>
                            <button onClick={() => {this.goToNext(this.formPage1)}}>Next</button>
                        </form>
                    </div>

                    <div className={this.state.page === 2 ? 'part-2' : 'hidden'}>
                        <form ref={form => this.formPage2 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                            <label>What breed is {this.state.name}?</label>
                            <select onChange={this.handleChange} name='breed' placeholder='Breed' value={this.state.breed}>
                                {this.breedList.map((breed, index) => {
                                    return (
                                        <option key={index}>{breed.name}</option>
                                    )
                                })}
                            </select>
                            <button onClick={() => {this.goToNext(this.formPage2)}}>Next</button>
                        </form>
                    </div>

                    <div className={this.state.page === 3 ? 'part-3' : 'hidden'}>
                        <form ref={form => this.formPage3 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                            <label>What is {this.state.name}'s day of birth?</label>
                            <input onChange={this.handleChange} value={this.state.birthday} placeholder="Birthday" type="date" name="birthday"/>
                            <button onClick={() => {this.goToNext(this.formPage3)}}>Next</button>
                        </form>
                    </div>

                    <div className={this.state.page === 4 ? 'part-4' : 'hidden'}>
                        <form ref={form => this.formPage4 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                            <label>What is the gender of {this.state.name}?</label>
                            <select required onChange={this.handleChange} name='gender' placeholder='Gender' value={this.state.gender}>
                                <option>Female</option>
                                <option>Male</option>
                                <option>Other</option>
                            </select>
                            <button onClick={() => {this.goToNext(this.formPage4)}}>Next</button>
                        </form>
                    </div>

                    <div className={this.state.page === 5 ? 'part-5' : 'hidden'}>
                        <form ref={form => this.formPage5 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                            <label>Choose an avatar for {this.state.name}</label>
                            <div>
                                <label><input required onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/><img src='/' alt='avatar1'/></label>
                                <label><input onChange={this.handleRadio} type='radio' value='/2.png' name='avatar'/><img src='/' alt='avatar2'/></label>
                                <label><input onChange={this.handleRadio} type='radio' value='/3.png' name='avatar'/><img src='/' alt='avatar3'/></label>
                                <label><input onChange={this.handleRadio} type='radio' value='/4.png' name='avatar'/><img src='/' alt='avatar4'/></label>
                                <label><input onChange={this.handleRadio} type='radio' value='/5.png' name='avatar'/><img src='/' alt='avatar5'/></label>
                                <label><input onChange={this.handleRadio} type='radio' value='/6.png' name='avatar'/><img src='/' alt='avatar6'/></label>
                            </div>
                            <button onClick={() => {this.goToNext(this.formPage5)}}>Next</button>
                        </form>
                    </div>
                    
                    <div className={this.state.page === 6 ? 'part-6' : 'hidden'}>
                            <p>Lets build {this.state.name} an office dog guide for co-workers!</p>
                            <ul>
                                <li>Dietary info</li>
                                <li>Activity info</li>
                                <li>Emergency card</li>
                                <li>Commands</li>
                            </ul>
                            <button onClick={() => {this.goToNext(this.formPage5)}}>Next</button>
                    </div>

                    <div className={this.state.page === 7 ? 'part-7' : 'hidden'}>
                        <form ref={form => this.formPage7 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                            <p>Dietery info</p>
                           <label>Food brand</label>
                           <input required onChange={this.handleChange} value={this.state.foodBrand} placeholder="Food brand" type="text" name="foodBrand"/>
                           <label>Times fed a day</label>
                           <input required onChange={this.handleChange} value={this.state.foodFreq} type="number" name="foodFreq"/>
                           <label>Grams per feeding</label>
                           <input required onChange={this.handleChange} value={this.state.foodGrams} type="number" name="foodGrams"/>
                           <label>Allowed human food?</label>
                           <label><input required onChange={this.handleRadio} value='Yes' type="radio" name="foodHuman"/>Yes</label>
                           <label><input required onChange={this.handleRadio} value='No' type="radio" name="foodHuman"/>No</label>
                           <label>Considered dangerous for {this.state.name}</label>
                           <div>
                                <label><input onChange={this.handleCheckbox} value='Chocolate' type="checkbox" name="foodDanger"/>Chocolate</label>
                                <label><input onChange={this.handleCheckbox} value='Grapes' type="checkbox" name="foodDanger"/>Grapes</label>
                                <label><input onChange={this.handleCheckbox} value='Gum' type="checkbox" name="foodDanger"/>Gum</label>
                                <label><input onChange={this.handleCheckbox} value='Milk' type="checkbox" name="foodDanger"/>Milk</label>
                                <label><input onChange={this.handleCheckbox} value='Nuts' type="checkbox" name="foodDanger"/>Nuts</label>
                                <label><input onChange={this.handleCheckbox} value='Coffee' type="checkbox" name="foodDanger"/>Coffee</label>
                                <label><input onChange={this.handleCheckbox} value='Candy' type="checkbox" name="foodDanger"/>Candy</label>
                                <label><input onChange={this.handleCheckbox} value='Bacon' type="checkbox" name="foodDanger"/>Bacon</label>
                           </div>
                           <button onClick={() => {this.goToNext(this.formPage7)}}>Next</button>
                        </form>
                    </div>

                    <div className={this.state.page === 8 ? 'part-8' : 'hidden'}>
                        <form ref={form => this.formPage8 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                         <p>Activity info</p>
                           <label>How much does {this.state.name} usually walk a day?</label>
                           <input required onChange={this.handleChange} value={this.state.walkAvgFreq} type="number" name="walkAvgFreq"/>
                           <p>times</p>
                           <input required onChange={this.handleChange} value={this.state.walkAvgKm} type="number" name="walkAvgKm"/>
                           <p>km</p>
                           <input required onChange={this.handleChange} value={this.state.walkAvgMinutes} type="number" name="walkAvgMinutes"/>
                           <p>minutes</p>
                           <label>How many poopies?</label>
                           <input required onChange={this.handleChange} value={this.state.poopAvgFreq} type="number" name="poopAvgFreq"/>
                           <img src='/' alt='poop'/>
                           <p>a day</p>
                           <label>How many treats does {this.state.name} get?</label>
                           <input required onChange={this.handleChange} value={this.state.cookiesAvgFreq} type="number" name="cookiesAvgFreq"/>
                           <img src='/' alt='cookie'/>
                           <p>a day</p>
                           <button onClick={() => {this.goToNext(this.formPage8)}}>Next</button>
                        </form>
                    </div>   

                    <div className={this.state.page === 9 ? 'part-9' : 'hidden'}>
                        <form ref={form => this.formPage9 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                            <p>Emergency card</p>
                           <label>Chip nr {this.state.name}</label>
                           <input required onChange={this.handleChange} value={this.state.chipNumber} placeholder="0000 1234578" type="text" name="chipNumber"/>
                           <label>Your phone nr</label>
                           <p>{this.state.owner.phone}</p>
                           <label>Emergency contact 1</label>
                           <input required onChange={this.handleChange} value={this.state.ice1Name} placeholder="Name" type="text" name="ice1Name"/>
                           <input required onChange={this.handleChange} value={this.state.ice1Phone} placeholder="Phone nr" type="text" name="ice1Phone"/>
                           <label>Emergency contact 2</label>
                           <input onChange={this.handleChange} value={this.state.ice2Name} placeholder="Name" type="text" name="ice2Name"/>
                           <input onChange={this.handleChange} value={this.state.ice2Phone} placeholder="Phone nr" type="text" name="ice2Phone"/>
                           <label>Vet</label>
                           <input required onChange={this.handleChange} value={this.state.vetName} placeholder="Name" type="text" name="vetName"/>
                           <input required onChange={this.handleChange} value={this.state.vetPhone} placeholder="Phone nr" type="text" name="vetPhone"/>
                           <button onClick={() => {this.goToNext(this.formPage9)}}>Next</button>
                        </form>
                    </div>

                    <div className={this.state.page === 10 ? 'part-10' : 'hidden'}>
                        <form ref={form => this.formPage10 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                            <p>Command dictionary</p>
                           <label>Choose commands {this.state.name} knows</label>
                           {this.commandList.map((command, index) => {
                               return (
                                    <label><input key={index} onChange={this.handleCheckbox} value={command._id} type="checkbox" name="commands"/>{command.commando}</label>
                               )
                           })}
                           <label>English translation</label>     {/* What is suppose to happen here? */}
                           <button onClick={this.handleSubmit}>Add dog</button>
                        </form>
                    </div>
                </div>
        )
    }
};


