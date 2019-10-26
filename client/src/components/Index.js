import React from 'react';
import {Link} from 'react-router-dom';

//style
import '../styles/Index.scss';

export default function Index() {
        return (
            <div className='index-container'>
                <h1>App name</h1>
                <h2>App subtitle</h2>
                <img src='/' alt='start-img'/>
                <Link to='/login'><button>Sign in</button></Link>
                <p>Don't have an account?  <Link to='/signup'><span>Signup</span></Link></p>
            </div>
        )
}