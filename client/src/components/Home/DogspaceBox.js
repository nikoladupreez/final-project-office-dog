import React from 'react';
import {Link} from 'react-router-dom';

import '../../styles/Home.scss';

export default function DogspaceBox(props) {
    return (
        <Link to={`/dog/${props.id}/home`}>
            <div className='dogspace-box'>
                <div className='dogspace-subbox'>
                    <div className='dogspace-img-box'>
                        <img src={props.avatar} alt='dog'/>
                    </div>
                    { props.owner === 'true' ? 
                        <div className='asterix-owner'></div>
                     : <></> }
                    <h1 className={props.owner === 'true' ? 'owner' : 'coworker'}>{props.name}</h1>
                </div>
            </div>
        </Link>
    )
}
