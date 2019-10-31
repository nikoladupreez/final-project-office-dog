import React, { Component } from 'react';
import axios from "axios";
import {getUser, setUser} from "../../../../utils/auth";

//style
import '../../../../styles/AddDog.scss';

export default class DictionaryEdit extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.goBack = this.goBack.bind(this);
        this.formPage10 = React.createRef();
        this.commandList = [];
    }

    state = {
        dog: {},
        commands: [],
        user: getUser(),
        translate: false,
        page: 10,
        loading: true
    }

    getCommandList() {
        return (
            axios({
                method: "GET",
                url: `${process.env.REACT_APP_API}/dogs/commands`, 
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
        Promise.all([this.getCommandList(), this.getDog()])
        .then(([commands, dog]) => {
             this.commandList = commands.data;
             this.setState({
                dog: dog.data,
                commands: dog.data.commands
            })
            this.setState({loading: false});
        })
        .catch((err) => console.log(err));
     }

     handleChange(e) {
        this.setState({[e.target.name]: e.target.value})
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

        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/dogs/edit-dictionary`,
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
                    this.props.history.push({pathname: `/dog/${this.state.dogId}/home/dictionary`, state: res.data}); 
                })
                .catch((err) => console.log(err.message));
            } else {
                this.props.history.push({pathname: `/dog/${this.state.dogId}/home/dictionary`, state: res.data}); 
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
                <div className='back-box'>
                    <div onClick={this.goBack} className='back-icon'></div>
                </div>
                <div className={this.state.page === 10 ? 'dog-part-10' : 'hidden'}>
                            <div className='dog-chapter-title-box'>
                                <div className='chapter-icon-big dictionary-big'></div>
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
                                <label className='translate-label'>Show english translation</label> 
                                <div className="switch-container">
                                    <label className="switch">
                                        <input onChange={this.handleCheckbox} type="checkbox" id="checkbox" name='translation'/>
                                        <div className="slider round"></div>
                                    </label>
                                </div>
                            </div>
                            <div className='dog-next-btn-box'>
                                <button id='food-next-btn' onClick={this.handleSubmit}>Save</button>
                            </div>
                </div>
            </div>
        )
    }
}
