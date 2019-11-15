import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

//style
import '../../../../styles/Dictionary.scss';
import Loader from '../../../../images/spacedog1.svg';

export default class Dictionary extends Component {
    state = {
        commandList: [],
        dogId: this.props.match.params.id,
        dog: {},
        loading: true
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/dogs/dog/${this.state.dogId}`
        })
        .then((dog) => {
            this.setState({
                            commandList: dog.data.commands,
                            dog: dog.data
                         });
        })
        .catch((err) => console.log(err.message))
        .finally(() => {
            setTimeout(() => {
                this.setState({loading: false});
            }, 1000)
        })
    }

    render() {
        return (
                <div className='dictionary-container'>
                    <div className='back-box'>
                            <Link to={`/dog/${this.state.dogId}/home`}><div className='back-icon'></div></Link>
                            {/* <Link to={`/dog/${this.state.dogId}/home/dictionary/edit`}><div id='edit-btn'></div></Link> */}
                    </div>
                    <div className='dictionary-title'>
                        <h1>Commands</h1>
                    </div>
                    {this.state.loading ?
                        <div className='loader-container-small'>
                                <div className='loader-box'>
                                    <img src={Loader} alt='spacedog'/>
                                    <p>Fetching balls...</p>
                                </div> 
                        </div>
                    :
                        <div className='commands'>
                            {this.state.commandList.map((command, index) => {
                                return (
                                    <div className='command-box' key={index}>
                                        <h1>{command.commando}</h1>
                                        {this.state.dog.english ?
                                            <h2>{command.translation}</h2>
                                        :<></>}
                                        <p>{command.description}</p>
                                    </div>
                                )
                            })}
                            <div className='bottom-spacer'></div>
                        </div>
                    }
                </div>
        )
    }
}
