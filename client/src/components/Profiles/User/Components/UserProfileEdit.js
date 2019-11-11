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
        avatarOld: "",
        name: "",
        displayName: "",
        phone: "",
        avatarList: [man, mix, woman],
        nonChosenAvatar1: "",
        nonChosenAvatar2: ""
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/users/${this.state.userId}`
        })
        .then((user) => {
            this.setState({
                avatar: user.data.avatar,
                avatarOld: user.data.avatar,
                name: user.data.name,
                displayName: user.data.display_name,
                phone: user.data.phone
            })
            this.sortAvatars(user.data.avatar);
        })
        .catch((err) => console.log(err.message));
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        debugger;
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

    sortAvatars(userAvatar) {
        let chosenAvatar = userAvatar;
        let avatarList = [...this.state.avatarList];
        let nonChosenAvatars = avatarList.filter((avatar) => {
            return !(chosenAvatar === avatar);
        });

        this.setState({nonChosenAvatar1: nonChosenAvatars[0]});
        this.setState({nonChosenAvatar2: nonChosenAvatars[1]});
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
                            <div className='avatar-small-box'>
                                <label><div className='avatar-small'><img src={this.state.nonChosenAvatar1} alt='avatar'/></div><input onChange={this.handleRadio} value={this.state.nonChosenAvatar1} className='avatar-small-input' type='radio' name='avatar'/></label>
                            </div>
                        </div>
                        <div className='avatar-big-box'>
                            <label className='avatar-big-label'><div className='avatar-big'><img src={this.state.avatarOld} alt='avatar-user'/></div><input checked value={this.state.avatar} onChange={this.handleRadio} className='avatar-big-input' type='radio' name='avatar'/></label>
                        </div>
                        <div className='avatar-small-container'>
                            <div className='avatar-small-box'>
                                <label><div className='avatar-small'><img src={this.state.nonChosenAvatar2} alt='avatar'/></div><input onChange={this.handleRadio} value={this.state.nonChosenAvatar2} className='avatar-small-input' type='radio' name='avatar'/></label>
                            </div>
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
