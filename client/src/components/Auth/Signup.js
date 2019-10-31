import React, { Component } from 'react';
import {Link} from 'react-router-dom';

//style
import '../../styles/Signup.scss';
import woman from '../../images/woman.png';
import mix from '../../images/rotweiler.png';
import man from '../../images/rotweiler.jpg';

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
        page: 1, 
        isValidated: false
    }

    goToNext(){
        this.setState({page: 2});
        this.setState({isValidated: false})
    }

    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })

        if (this.formPage1.checkValidity() || this.formPage2.checkValidity()){
            this.setState({isValidated: true});
        } else {
            this.setState({isValidated: false});
        }
    }

    handleSubmit(e){
        this.setState({isValidated: false})
        signup(this.state, this.props.history);
    }

    handleRadio(e){
        if(e.target.checked){
            this.setState({
                [e.target.name]: e.target.value
            })
        }

        if (this.formPage1.checkValidity() || this.formPage2.checkValidity()){
            this.setState({isValidated: true});
        } else {
            this.setState({isValidated: false});
        }
    }

    render() {
        return (
                <div className='signup-container'>
                        { this.state.page === 1 ? 
                            <div className='signup-back-box'>
                                <Link to='/'><div className='close-icon'></div></Link>
                            </div>
                        : 

                            <div className='signup-back-box'>
                            </div>
                        }
        
                        <h1 className='signup-title'>Get started</h1>

                            <div className={this.state.page === 1 ? 'sign-part-1' : 'hidden'}>
                                <p className='signup-subtitle'><div className='dogspace-logo3'></div> is free!</p>
                                <form ref={form => this.formPage1 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                                    <label>Work email adress</label>
                                    <input className='inputText' required onChange={this.handleChange} value={this.state.email} type="text" name="email"/>
                                    <label>Name</label>
                                    <input className='inputText' required onChange={this.handleChange} value={this.state.name} type="text" name="name"/>
                                    <label>Password</label>
                                    <input className='inputText' required onChange={this.handleChange} value={this.state.password} placeholder="8 characters or more"  type="password" name="password"/>
                                    <div className='signup-btn-box'>
                                        <button onClick={this.goToNext} disabled={this.state.isValidated === false}>Sign up</button>
                                        <p className='signup-tos'>By signing up, you agree to DOGSPACE's <span>Terms of Service</span></p>
                                    </div>
                                </form>
                            </div>
                 
                            <div className={this.state.page === 2 ? 'sign-part-2' : 'hidden'}>
                                <div className='subtitle-container'>
                                    <p className='signup-subtitle2'>Create your office dog a <br/> account!</p><div className='dogspace-logo4'></div>
                                </div>
                                <form ref={form => this.formPage2 = form} onSubmit={(e) => {e.preventDefault(); return false}}>
                                    <label>Display name</label>
                                    <input className='inputText' required onChange={this.handleChange} value={this.state.displayName} type="text" name="displayName"/>
                                    <label>Phone number</label>
                                    <input className='inputText' required onChange={this.handleChange} value={this.state.phone} type="text" name="phone"/>
                                    <label id='signup-avatar-label'>Choose avatar</label>
                                    <div className='signup-avatar-container'>
                                        <div className='signup-avatar-option'>
                                            <label><div className='signup-avatar-box'><img src='/' alt='avatar1'/></div><input required onChange={this.handleRadio} type='radio' value='/1.png' name='avatar'/></label> 
                                        </div>
                                        <div className='signup-avatar-option'>
                                            <label><div className='signup-avatar-box'><img src='/' alt='avatar2'/></div><input onChange={this.handleRadio} type='radio' value='/2.png' name='avatar'/></label>
                                        </div>
                                        <div className='signup-avatar-option'>
                                            <label><div className='signup-avatar-box'><img src='/' alt='avatar3'/></div><input onChange={this.handleRadio} type='radio' value='/3.png' name='avatar'/></label>
                                        </div>
                                    </div>
                                    <div className='signup-btn-box'>
                                        <button onClick={this.handleSubmit} disabled={this.state.isValidated === false}>Done</button>
                                    </div>
                                </form>
                            </div>
                </div>
        )
    }
};

export default Signup;