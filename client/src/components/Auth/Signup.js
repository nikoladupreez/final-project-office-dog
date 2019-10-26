import React, { Component } from 'react';
import {Link} from 'react-router-dom';

//style
import '../../styles/Signup.scss';

//components
import {signup} from "../../utils/auth";

class Signup extends Component {
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleRadio = this.handleRadio.bind(this);
        this.goToNext = this.goToNext.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.formPage1 = React.createRef();
        this.formPage2 = React.createRef();
    }

    state = {
        email: "",
        password: "",
        name: "",
        displayName: "",
        phone: "", 
        avatar: "",
        page: 1
    }

    goToNext(){
        if (this.formPage1.checkValidity()){
            this.setState({page: 2});
        }
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e){
        if (this.formPage2.checkValidity()){
            signup(this.state, this.props.history);
        }
    }

    handleRadio(e){
        if(e.target.checked){
            this.setState({
                [e.target.name]: e.target.value
            })
        }
    }

    render() {
        return (
                <div className='signup-container'>
                    <div>
                        <div>
                            <Link to='/'><img src='/' alt='back-link'/></Link>
                        </div>
                        <h1>Get started with ...</h1>
                            <div className={this.state.page === 1 ? 'part-1' : 'hidden'}>
                                <p>It's free!</p>
                                <form ref={form => this.formPage1 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                                    <label>Work email adress</label>
                                    <input required onChange={this.handleChange} value={this.state.email} type="text" name="email"/>
                                    <label>Full name</label>
                                    <input required onChange={this.handleChange} value={this.state.name} type="text" name="name"/>
                                    <label>Password</label>
                                    <input required onChange={this.handleChange} value={this.state.password} placeholder="Password"  type="password" name="password"/>
                                    <button onClick={this.goToNext}>Next</button>
                                </form>
                                <p>By signing up, you agree to ... <span>Terms of Service</span></p>
                            </div>
                 
                            <div className={this.state.page === 2 ? 'part-2' : 'hidden'}>
                                <p>Create your office dog management account!</p>
                                <form ref={form => this.formPage2 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                                    <label>Display name</label>
                                    <input required onChange={this.handleChange} value={this.state.displayName} type="text" name="displayName"/>
                                    <label>Phone number</label>
                                    <input required onChange={this.handleChange} value={this.state.phone} type="text" name="phone"/>
                                    <label>Choose avatar</label>
                                    <div>
                                        <label><input required onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/><img src='/' alt='avatar1'/></label>
                                        <label><input onChange={this.handleRadio} type='radio' value='/2.png' name='avatar'/><img src='/' alt='avatar2'/></label>
                                        <label><input onChange={this.handleRadio} type='radio' value='/3.png' name='avatar'/><img src='/' alt='avatar3'/></label>
                                    </div>
                                    <button onClick={this.handleSubmit}>Sign up</button>
                                </form>
                            </div>
                    </div>
                </div>
        )
    }
};

export default Signup;