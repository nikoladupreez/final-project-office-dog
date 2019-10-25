import React from 'react'
import {Link} from 'react-router-dom';

export default function ConfirmAdd(props) {
    return (
        <div className='add-dog-box'>
            <h1>Done!</h1>
            <img src='/' alt='check'/>
            <p>Description</p>
            <div>
                <img src='/' alt='owner'/>
                <p>{props.ownerName}</p>
            </div>
            <div>
                <img src='/' alt='dog'/>
                <p>{props.dogName}</p>
            </div>
            <img src='/' alt='gif'/>
            <Link to={`/dog/${props.dogId}`}><button>Go to dogspace</button></Link> {/* How to add dog id? */}
        </div>
    )
}
