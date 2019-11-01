import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

//components
import {getUser} from "../../../../utils/auth";

//style
import '../../../../styles/UserProfile.scss';
import woman from '../../../../images/woman.png';
import mix from '../../../../images/mix.png';
import man from '../../../../images/man.png';


export default class UserProfileEdit extends Component {
    constructor(props){
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRadio = this.handleRadio.bind(this);
    }

    state = {
        userId: getUser()._id,
        avatar: "",
        name: "",
        displayName: "",
        phone: "",
        avatarList: [man, mix, woman],
        nonChosenAvatars: []
    }

    componentDidMount() {
        let user = getUser();

        this.setState({
            avatar: user.avatar,
            name: user.name,
            displayName: user.display_name,
            phone: user.phone
        })
        this.sortAvatars();
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/users/${this.state.userId}/edit`,
            headers: { 'content-type': 'application/json' },
            data: JSON.stringify(this.state),
        })
        .then((res) => {
            this.props.history.goBack();
        })
        .catch((err) => {
            console.log(err.message);
        })
    }

    handleRadio(e){
        if(e.target.checked){
            this.setState({
                [e.target.name]: e.target.value
            })
        }
    }

    sortAvatars() {
        let chosenAvatar = this.state.avatar;
        let avatarList = [...this.state.avatarList];
        let nonChosenAvatars = avatarList.filter((avatar) => {
            return !(chosenAvatar === avatar);
        });

        this.setState({nonChosenAvatars: nonChosenAvatars});
    }

    render () {
        return (
            <div className='edit-userprofile-container'>
                    <div className='back-box'>
                        <Link to='/home'><div className='back-icon'></div></Link>
                    </div>
                    <div className='edit-user-title'>
                        <h1>Edit Profile</h1>
                    </div>
                <form onSubmit={(e) => {e.preventDefault(); return false}}>
                    <div className='avatar-option-box'>
                        <div className='avatar-small-container'>
                            {this.state.nonChosenAvatars.map((avatar, index) => {
                                return (
                                        <div className='avatar-small-box' key={index}>
                                            <label><div className='avatar-small'><img src={avatar} alt='avatar'/></div><input onChange={this.handleRadio} className='avatar-small-input' type='radio' name='avatar'/></label>
                                        </div>
                                )
                            })}
                        </div>
                        <div className='avatar-big-box'>
                            <label className='avatar-big-label'><div className='avatar-big'><img src={this.state.avatar} alt='avatar-user'/></div><input checked value={this.state.avatar} onChange={this.handleRadio} className='avatar-big-input' type='radio' name='avatar'/></label>
                        </div>
                    </div>
                    <label className='label-profile'>Name</label>
                    <input className='text-input-profile' onChange={this.handleChange} name='name' placeholder={this.state.name}/>
                    <label className='label-profile'>Display name</label>
                    <input className='text-input-profile' onChange={this.handleChange} name='displayName' placeholder={this.state.displayName}/>
                    <label className='label-profile'>Phone number</label>
                    <input className='text-input-profile' onChange={this.handleChange} name='phone' placeholder={this.state.phone}/>
                    <div className='btn-box'>
                        <button onClick={this.handleSubmit}>Save</button>
                    </div>
                </form>
            </div>
        )
    }
}
