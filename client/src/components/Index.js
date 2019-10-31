import React from 'react';
import {Link} from 'react-router-dom';

//style
import '../styles/Index.scss';

export default function Index() {
        return (
            <div className='background-onboarding'>
                <div className='index-container'>
                    <div className='index-title-box'>
                        <div className='dogspace-logo'></div>
                        <h2>Office dog management</h2>
                    </div>
                    <div className='index-illustration'></div>
                    <Link to='/login'><button>Sign in</button></Link>
                    <p>Don't have an account?  <Link to='/signup'><span>Signup</span></Link></p>
                </div>
            </div>
        )
}