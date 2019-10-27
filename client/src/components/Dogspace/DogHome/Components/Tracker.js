import React from 'react';

export default function Tracker(props) {
    return (
        <div>
            <div>
                <div>
                    <h1>Walks:</h1>
                    <p>{props.walkCount}</p>
                </div>
                <p><span>{props.walkKm}</span> km</p>
                <p><span>{props.walkMin}</span> min</p>
            </div>
            <div>
                <h1>Poops:</h1>
                <p>{props.poopCount}</p>
            </div>
            <div>
                <h1>Cookies:</h1>
                <p>{props.cookieCount}</p>
            </div>
        </div>
    )
}
