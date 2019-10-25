import React, { Component } from 'react';
import axios from "axios";
import qs from "querystring";
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

export default class AddDogspace extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.handleRadio = this.handleRadio.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        id: "",
        name: "",
        breed: "", 
        birthday: "",
        gender: "",
        // avatar: "",
        foodBrand: "",
        foodFreq: null,
        foodGrams: null,
        foodHuman: "",
        foodDanger: [], 
        walkAvgFreq: null,
        walkAvgKm: null,
        walkAvgMinutes: null,
        poopAvgFreq: null,
        cookiesAvgFreq: null,
        chipNumber: "",
        ice1Name: "",
        ice1Phone: "",
        ice2Name: "",
        ice2Phone: "",
        vetName: "",
        vetPhone: "",
        commands: [],
        breedList: [], 
        iconList: [],
        commandList: [],
        owner: JSON.parse(localStorage.getItem('user'))
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
            this.setState({breedList: breeds.data});
            this.setState({commandList: commands.data});
       })
       .catch((err) => console.log(err));
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value 
        })
    }

    handleCheckbox(e){
        let array = [];
        if(e.target.checked){         
            array.push(e.target.value)
        };

        this.setState({
            [e.target.name]: array 
        })
    }

    handleCommands(e){
        let commands = [];
        if(e.target.checked){
            commands.push(e.target.id)
        };

        this.setState({ commands: commands})
    }

    handleRadio(e){
        if(e.target.checked){
            this.setState({
                [e.target.name]: e.target.value
            })
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/dogs/add-dog`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(this.state),
        })
        .then((res) => {
            let dog = [...this.state];
            dog.id = res._id;
            this.setState({dog});
            history.push({pathname: '/confirm-dog', state: this.state}); 
        })
        .catch((err) => {
            console.log(err.message);
        })
    }

    render() {
        return (
                <div className='add-dog-container'>
                    <form onSubmit={this.handleSubmit}>
                        <div className='add-dog-box'>
                            <h1>Lets get started!</h1>
                            <h2>Description</h2>
                            <label>What is your office dog's name?</label>
                            <input onChange={this.handleChange} value={this.state.name} placeholder="Name" type="text" name="name"/>
                            <p className='next-btn'>Next</p>
                        </div>

                        <div className='add-dog-box'>
                            <p className='skip-btn'>Skip</p>
                            <label>What breed is {this.state.name}?</label>
                            <select onChange={this.handleChange} name='breed' placeholder='Breed' value={this.state.breed}>
                                {this.state.breedList.map((breed) => {
                                    return (
                                        <option>{breed.name}</option>
                                    )
                                })}
                            </select>
                            <p className='next-btn'>Next</p>
                        </div>

                        <div className='add-dog-box'>
                            <p className='skip-btn'>Skip</p>
                            <label>What is {this.state.name}'s day of birth?</label>
                            <input onChange={this.handleChange} value={this.state.birthday} placeholder="Birthday" type="date" name="birthday"/>
                            <p className='next-btn'>Next</p>
                        </div>

                        <div className='add-dog-box'>
                            <label>What is the gender of {this.state.name}?</label>
                            <select onChange={this.handleChange} name='gender' placeholder='Gender' value={this.state.gender}>
                                <option>Female</option>
                                <option>Male</option>
                            </select>
                            <p className='next-btn'>Next</p>
                        </div>

                        <div className='add-dog-box'>  {/* Edit this! */}
                            <label>Choose an avatar for {this.state.name}</label>
                            <p className='next-btn'>Next</p>
                        </div>

                        <div className='add-dog-box'>
                            <p>Lets build {this.state.name} an office dog guide for co-workers!</p>
                            <ul>
                                <li>Dietary info</li>
                                <li>Activity info</li>
                                <li>Emergency card</li>
                                <li>Commands</li>
                            </ul>
                            <p className='next-btn'>Next</p>
                        </div>

                       <div className='add-dog-box'>
                           <p>Dietery info</p>
                           <label>Food brand</label>
                           <input onChange={this.handleChange} value={this.state.foodBrand} placeholder="Food brand" type="text" name="foodBrand"/>
                           <label>Times fed a day</label>
                           <input onChange={this.handleChange} value={this.state.foodFreq} type="number" name="foodFreq"/>
                           <label>Grams per feeding</label>
                           <input onChange={this.handleChange} value={this.state.foodGrams} type="number" name="foodGrams"/>
                           <label>Allowed human food?</label>
                           <input onChange={this.handleRadio} value={this.state.foodHuman} type="radio" checked name="foodHuman">Yes</input>
                           <input onChange={this.handleRadio} value={this.state.foodHuman} type="radio" name="foodHuman">No</input>
                           <label>Considered dangerous for {this.state.name}</label>
                           <input onChange={this.handleCheckbox} value={this.state.foodDanger} type="checkbox" name="foodDanger">Chocolate</input>
                           <input onChange={this.handleCheckbox} value={this.state.foodDanger} type="checkbox" name="foodDanger">Grapes</input>
                           <input onChange={this.handleCheckbox} value={this.state.foodDanger} type="checkbox" name="foodDanger">Gum</input>
                           <input onChange={this.handleCheckbox} value={this.state.foodDanger} type="checkbox" name="foodDanger">Milk</input>
                           <input onChange={this.handleCheckbox} value={this.state.foodDanger} type="checkbox" name="foodDanger">Nuts</input>
                           <input onChange={this.handleCheckbox} value={this.state.foodDanger} type="checkbox" name="foodDanger">Coffee</input>
                           <input onChange={this.handleCheckbox} value={this.state.foodDanger} type="checkbox" name="foodDanger">Candy</input>
                           <input onChange={this.handleCheckbox} value={this.state.foodDanger} type="checkbox" name="foodDanger">Bacon</input>
                           <p className='next-btn'>Next</p>
                       </div>

                       <div className='add-dog-box'>
                           <p>Activity info</p>
                           <label>How much does {this.state.name} usually walk a day?</label>
                           <input onChange={this.handleChange} value={this.state.walkAvgFreq} type="number" name="walkAvgFreq"/>
                           <p>times</p>
                           <input onChange={this.handleChange} value={this.state.walkAvgKm} type="number" name="walkAvgKm"/>
                           <p>km</p>
                           <input onChange={this.handleChange} value={this.state.walkAvgMinutes} type="number" name="walkAvgMinutes"/>
                           <p>minutes</p>
                           <label>How many poopies?</label>
                           <input onChange={this.handleChange} value={this.state.poopAvgFreq} type="number" name="poopAvgFreq"/>
                           <img src='/' alt='poop'/>
                           <p>a day</p>
                           <label>How many treats does {this.state.name} get?</label>
                           <input onChange={this.handleChange} value={this.state.cookiesAvgFreq} type="number" name="cookiesAvgFreq"/>
                           <img src='/' alt='cookie'/>
                           <p>a day</p>
                           <p className='next-btn'>Next</p>
                       </div>

                       <div className='add-dog-box'>
                           <p>Emergency card</p>
                           <label>Chip nr {this.state.name}</label>
                           <input onChange={this.handleChange} value={this.state.chipNumber} placeholder="0000 1234578" type="text" name="chipNumber"/>
                           <label>Your phone nr</label>
                           <p>{this.state.owner.phone}</p>
                           <label>Emergency contact 1</label>
                           <input onChange={this.handleChange} value={this.state.ice1Name} placeholder="Name" type="text" name="ice1Name"/>
                           <input onChange={this.handleChange} value={this.state.ice1Phone} placeholder="Phone nr" type="text" name="ice1Phone"/>
                           <label>Emergency contact 2</label>
                           <input onChange={this.handleChange} value={this.state.ice2Name} placeholder="Name" type="text" name="ice2Name"/>
                           <input onChange={this.handleChange} value={this.state.ice2Phone} placeholder="Phone nr" type="text" name="ice2Phone"/>
                           <label>Vet</label>
                           <input onChange={this.handleChange} value={this.state.vetName} placeholder="Name" type="text" name="vetName"/>
                           <input onChange={this.handleChange} value={this.state.vetPhone} placeholder="Phone nr" type="text" name="vetPhone"/>
                           <p className='next-btn'>Next</p>
                       </div>
                      
                      <div className='add-dog-box'>
                          <p>Command dictionary</p>
                           <label>Choose commands {this.state.name} knows</label>
                           {this.state.commandList.map((command) => {
                               return (
                                    <input onChange={this.handleCommands} id={command.id} type="checkbox" name="commands">{command.commando}</input>
                               )
                           })}
                           <label>English translation</label>     {/* What is suppose to happen here? */}
                           <button type="submit">Add dog</button> 
                      </div>
                    </form>
                </div>
        )
    }
};


