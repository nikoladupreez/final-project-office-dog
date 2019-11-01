import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

//style
import '../../../../styles/Dictionary.scss';
import crossIcon from '../../../../images/cross.svg';

export default class Dictionary extends Component {
    state = {
        commandList: [],
        dogId: this.props.match.params.id,
        dog: {}
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/dogs/dog/${this.state.dogId}`
        })
        .then((dog) => {
            this.setState({commandList: dog.data.commands});
            this.setState({dog: dog.data});
        })
        .catch((err) => console.log(err.message));
    }

    render() {
        return (
            <div className='dictionary-container'>
                 <div className='back-box'>
                        <Link to={`/dog/${this.state.dogId}/home`}><div className='back-icon'></div></Link>
                        <Link to={`/dog/${this.state.dogId}/home/dictionary/edit`}><div id='edit-btn'></div></Link>
                </div>
                <div className='dictionary-title'>
                    <h1>Commands</h1>
                </div>
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
                </div>
            </div>
        )
    }
}
