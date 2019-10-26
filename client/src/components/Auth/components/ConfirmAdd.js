import React, {Component} from 'react'
import {Link} from 'react-router-dom';
import { getUser } from '../../../utils/auth';

export default class ConfirmAdd extends Component {
    state = {
        dog: this.props.location.state,
        user: getUser()
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className='add-dog-box'>
                <h1>Done!</h1>
                <img src='/' alt='check'/>
                <p>Description</p>
                <div>
                    <img src='/' alt='owner'/>
                    <p>{this.state.user.name}</p>
                </div>
                <div>
                    <img src='/' alt='dog'/>
                    <p>{this.state.dog.name}</p>
                </div>
                <img src='/' alt='gif'/>
                <Link to={`/dog/${this.state.dog._id}/home`}><button>Go to dogspace</button></Link>
            </div>
        )
    }
}
