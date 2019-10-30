import React, {Component} from 'react'
import {Link} from 'react-router-dom';
import { getUser } from '../../../utils/auth';

//style
import '../../../styles/ConfirmDog.scss';

export default class ConfirmAdd extends Component {
    state = {
        dog: this.props.location.state,
        user: getUser()
    }

    render() {
        return (
            <div className='add-dog-box'>
                <div className='confirm-img'></div>
                <p>The office dog guide is finished! Let’s start the office dog management!</p>
                <div className='btn-box'>
                    <Link to={`/dog/${this.state.dog._id}/home`}><button>GO TO DOGSPACE OF {this.state.dog.name}</button></Link>
                </div>
            </div>
        )
    }
}
