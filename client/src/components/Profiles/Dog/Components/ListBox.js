import React from 'react';
import crossIcon from '../../../../images/cross.svg';

export default function ListBox(props) {
    return (
        <div key={props.index} className='manager-box'>
            <div className='manager-img-box'>
                <img src={props.avatar} alt='user'/>
            </div>
            <div className='manager-name-box'>
                <h2>{props.name}</h2>
                <h3>{props.displayName}</h3>
                <h3>{props.phone}</h3>
            </div>
            <div onClick={props.deleteManager} className='delete-manager'><img src={crossIcon} alt='delete'/></div>
        </div>
    )
}
