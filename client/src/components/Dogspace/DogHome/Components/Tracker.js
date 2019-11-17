import React from 'react';
import { Progress } from 'reactstrap';
import '../../../../styles/Tracker.scss';

function checkStatus(percentage){
    if(percentage > 100) {
        return 'danger'
    }
};

export default function Tracker(props){
        return (
            <div className='tracker-container'>
                <div className='walks-container trackings'>
                    <h1>walks</h1>
                    <Progress className={checkStatus(props.walkPercentage)} animated color="info" max='100' value={props.walkPercentage}>{props.walkCount}</Progress>
                </div>
                <div className='poops-container trackings'>
                    <h1>poops</h1>
                    <Progress className={checkStatus(props.poopPercentage)} animated color="info" max='100' value={props.poopPercentage}>{props.poopCount}</Progress>
                </div>
                <div className='cookies-container trackings'>
                    <h1>cookies</h1>  
                    <Progress className={checkStatus(props.cookiePercentage)} animated color="info" max='100' value={props.cookiePercentage}>{props.cookieCount}</Progress>

                </div>
            </div>
        )
}
