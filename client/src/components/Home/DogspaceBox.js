import React from 'react';
import {Link} from 'react-router-dom';

export default function DogspaceBox(props) {
    return (
        <Link to={`/dog/${props.id}/home`}>
            <div>
                <img src={props.avatar} alt='dog'/>
                <h1>{props.name}</h1>
            </div>
        </Link>
    )
}
