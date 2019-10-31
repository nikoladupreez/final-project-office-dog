import React from 'react';
import {Link} from 'react-router-dom';

import '../../styles/DogProfile.scss';

export default function ProfileLink(props) {
    return (
            <Link to={props.url} className='link-of-box' id={props.id}>
                <div className='link-box'>
                    <h1>{props.title}</h1>
                </div>
            </Link>
    )
};
