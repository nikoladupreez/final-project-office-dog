import React from 'react';
import {Link} from 'react-router-dom';

export default function ProfileLink(props) {
    return (
            <Link to={props.url}>
                <div>
                    <img src={props.icon} alt='icon'/>
                    <h1>{props.title}</h1>
                </div>
            </Link>
    )
};
