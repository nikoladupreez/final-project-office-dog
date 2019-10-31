import React, {Component} from 'react'
import {Link} from 'react-router-dom';

//style
import '../../../styles/ConfirmDog.scss';

export default class ConfirmAdd extends Component {
    state = {
        dog: this.props.location.state,
    }

    render() {
        return (
            <div className='add-dog-box'>
                <h1>Awesome.</h1>
                <p>The office dog guide is finished! Let’s start the office dog management!</p>
                <div id='confirm-btn-box'>
                    <Link to={`/dog/${this.state.dog._id}/home`}><button id='confirm-btn'>Go to {this.state.dog.name}'s dogspace</button></Link>
                </div>
            </div>
        )
    }
}
