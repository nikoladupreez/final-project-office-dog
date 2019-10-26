import React from 'react';

export default function ListBox(props) {
    return (
        <div>
            <p>{props.name}</p>
            <button onClick={props.deleteManager}>Delete</button>
        </div>
    )
}
