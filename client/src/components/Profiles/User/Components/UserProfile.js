import React, { Component } from 'react';
import axios from 'axios';

//components
import ProfileLinkUser from '../../ProfileLinkUser';
import {getUser, logout} from "../../../../utils/auth";

//style
import '../../../../styles/UserProfile.scss';

export default class UserProfile extends Component {
    constructor(props){
        super(props)
        this.state = {
            userPopulated: {},
            userId: getUser()._id
        }
        this.logoutUser = this.logoutUser.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/users/${this.state.userId}`
        })
        .then((user) => {
            this.setState({userPopulated: user.data})
        })
        .catch((err) => console.log(err.message));
    }

    logoutUser() {
        logout(this.props.history);
    }

    goBack() {
        this.props.history.go(-1);
    }

    render() {
        return (
                    <div className='userprofile-container'>
                        <div className='nav-profile'>
                            <div onClick={this.goBack}className='doghome-icon-small'></div>
                            <div className='userprofile-icon-big'></div>
                            <div className='empty'></div>
                        </div>
                        <div className='user-profile-info-box'>
                            <div className='user-profile-info'>
                                <h1>{this.state.userPopulated.name}</h1>
                                <h2>{this.state.userPopulated.display_name}</h2>
                                <h2>{this.state.userPopulated.phone}</h2>
                            </div>
                            <div className='user-profile-img'>
                                <img src={this.state.userPopulated.avatar} alt='user-icon'/>
                            </div>
                        </div>
                        <div className='link-container'>
                            <ProfileLinkUser url='/user/profile/edit' title='Edit Profile' id='link-box-user'/>
                            <div onClick={this.logoutUser} className='link-box link-box-user'>
                                <h1>Log out</h1>
                            </div>
                        </div>
                    </div>
        )
    }
};
