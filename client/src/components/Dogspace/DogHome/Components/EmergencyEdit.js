import React, { Component } from 'react';
import axios from "axios";
import {getUser, setUser} from "../../../../utils/auth";


//style
import '../../../../styles/AddDog.scss';

export default class IceEdit extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goBack = this.goBack.bind(this);
        this.formPage9 = React.createRef();
    }

    state = {
        dog: {},
        ice1Name: "",
        ice1Phone: "",
        ice2Name: "",
        ice2Phone: "",
        vetName: "",
        vetCompany: "",
        vetPhone: "",
        user: getUser(),
        page: 9,
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
                ice1Name: dog.data.food_info.brand,
                ice1Phone: dog.data.food_info.frequency,
                ice2Name: dog.data.food_info.grams,
                ice2Phone: dog.data.food_info.human,
                vetName: dog.data.walk_info.avg_frequency,
                vetCompany: dog.data.walk_info.avg_km,
                vetPhone: dog.data.walk_info.avg_minutes
            })
        })
        .catch((err) => console.log(err.message));
    }

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    handleSubmit(e) {
        let user = this.state.user;

        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/dogs/edit/dog-guide`,
            headers: { 'content-type': 'application/json' },
            data: JSON.stringify(this.state)
        })
        .then((dog) => {
            if(!user.owner){
                axios({
                    method: "GET",
                    url: `${process.env.REACT_APP_API}/users/${user._id}`
                })
                .then((updatedUser) => {
                    setUser(updatedUser.data);
                    this.props.history.push({pathname: `/dog/${this.state.dogId}/home`, state: dog.data}); 
                })
                .catch((err) => console.log(err.message));
            } else {
                this.props.history.push({pathname: `/dog/${this.state.dogId}/home`, state: dog.data}); 
            }
        })
        .catch((err) => console.log(err.message));
    }

    goBack() {
        this.props.history.go(-1);
     }

     render() {
         return (
             <div className='add-dog-container'>
             {!this.state.dog.owner ? 
                        <h1>Loading...</h1>
                    :
                        <div className={this.state.page === 9 ? 'dog-part-9' : 'hidden'}>
                                <div className='dog-part-9-chapter'>
                                    <div className='dog-chapter-title-box'>
                                            <div className='chapter-icon-big emergency-big'/>
                                            <h1>Emergency card</h1>
                                    </div>
                                </div>
                                <form ref={form => this.formPage9 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                                <label>Dutch Animal Ambulance</label>
                                <p className='ambulance-nr'>0900 0245</p>
                                <label>{this.state.name}'s Owner</label>
                                <p className='owner-info'>{this.state.dog.owner.name}</p>
                                <p className='owner-info'>{this.state.dog.owner.phone}</p>
                                <label>Emergency contact 1</label>
                                <input className='ice-contact-info' onChange={this.handleChange} placeholder={this.state.dog.ice1.name} type="text" name="ice1Name"/>
                                <input className='ice-contact-info' onChange={this.handleChange}  placeholder={this.state.dog.ice1.phone} type="text" name="ice1Phone"/>
                                <label>Emergency contact 2</label>
                                <input className='ice-contact-info' onChange={this.handleChange} placeholder={this.state.dog.ice2.name} type="text" name="ice2Name"/>
                                <input className='ice-contact-info' onChange={this.handleChange} placeholder={this.state.dog.ice2.phone} type="text" name="ice2Phone"/>
                                <label>Veterinary</label>
                                <input className='vet-info' onChange={this.handleChange} placeholder={this.state.dog.vet.name} type="text" name="vetName"/>
                                <input className='vet-info' onChange={this.handleChange} placeholder={this.state.dog.vet.company} type="text" name="vetCompany"/>
                                <input className='vet-info' onChange={this.handleChange} placeholder={this.state.dog.vet.phone} type="text" name="vetPhone"/>
                                <div className='dog-next-btn-box'>
                                        <button id='food-next-btn' onClick={this.handleSubmit}>Save</button>
                                </div>
                                </form>
                        </div>
             }
             </div>

         )
     }
};
 
