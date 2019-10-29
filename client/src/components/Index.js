import React from 'react';
import {Link} from 'react-router-dom';

//style
import '../styles/Index.scss';

export default function Index() {
        return (
            <div className='index-container'>
                <div className='index-title-box'>
                    <h1>DOGSPACE</h1>
                    <h2>Office dog management</h2>
                </div>
                <img src='/' alt='start-img'/>
                <Link to='/login'><button>Sign in</button></Link>
                <p>Don't have an account?  <Link to='/signup'><span>Signup</span></Link></p>
            </div>
        )
}