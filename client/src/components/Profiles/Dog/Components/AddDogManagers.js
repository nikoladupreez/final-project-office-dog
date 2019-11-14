import React, { Component } from 'react';
import axios from "axios";
import {Link} from 'react-router-dom';

//compontents
import ListBox from './ListBox';
import {getUser} from '../../../../utils/auth';

//style
import '../../../../styles/DogManager.scss';
import chevronIcon from '../../../../images/light.png';

export default class AddDogManagers extends Component {
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.searchValue = React.createRef();
        this.removeError = this.removeError.bind(this);
    }

    state = {
        dog: {},
        dogId: this.props.match.params.id,
        dogManagers: [],
        userId: getUser()._id,
        users: [],
        isOwner: false,
        notFound: false,
        alreadyManager: false,
        error: false
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/dog/${this.state.dogId}`
        })
        .then((dog) => {
            this.setState({dog: dog.data});
            this.setState({dogManagers: dog.data.dog_managers})
        })
        .catch((err) => console.log(err.message));
    }

    removeError() {
        if(this.state.error){
            this.setState({error: false});
            this.setState({notFound: false});
            this.setState({alreadyManager: false});
            this.setState({isOwner: false});
        }
    }

    handleSearch(e) {
        let dogManagers = [...this.state.dogManagers];
    
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/users/email/${this.searchValue.current.value}`
        })
        .then((user) => {
            let managerFound = dogManagers.filter((manager) => {
                return (user.data._id === manager._id)
            });

            if(user.data._id === this.state.userId){
                this.setState({isOwner: true});
                this.setState({error: true});
            }else if(managerFound.length > 0){
                return;
            }else if(user.data.dog_manager){
                let dogFound = user.data.dog_manager.dogs.filter((dog) => {
                    return (dog._id === this.state.dogId)
                });
                if (dogFound.length > 0){
                    this.setState({alreadyManager: true});
                    this.setState({error: true});
                } else {
                    dogManagers.push(user.data);
                    this.setState({dogManagers: dogManagers});
                }
            } else {
                dogManagers.push(user.data);
                this.setState({dogManagers: dogManagers});
            }
        })
        .catch((err) => {
            if(err.response && err.response.status === 404){
                this.setState({notFound: true});
                this.setState({error: true});
            } else {
                console.log(err.message);
            }
        })
    }

    handleSubmit(e) {
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/dogs/dog/${this.state.dogId}/add-managers`,
            headers: { 'content-type': 'application/json' },
            data: JSON.stringify(this.state.dogManagers),
        })
        .then((res) => {
            this.props.history.push(`/dog/${this.state.dogId}/profile/managers`); 
        })
        .catch((err) => {
            console.log(err.message);
        })
    }

    deleteManager(id){
        let dogManagers = [...this.state.dogManagers];
        let dogManagersNew = dogManagers.filter((manager) => {
            return !(manager._id === id)
        });

        this.setState({dogManagers: dogManagersNew});
    }

    render() {
        return (
                <div className='add-manager-container'>
                    <div className='back-box'>
                        <Link to={`/dog/${this.state.dogId}/profile`}><img src={chevronIcon} alt='back'/></Link>
                    </div>
                    <div className='manager-title'>
                        <h1>Dog Managers</h1>
                    </div>
                    <div className='search-error-box'>
                            <div className='manager-search-box'>
                                <input id={this.state.error ? 'error' : ''} onChange={this.removeError}type='text' placeholder="Search Coworker's email" ref={this.searchValue}/>
                                <div id={this.state.error ? 'error-btn' : ''} onClick={this.handleSearch} className='search-icon'></div>
                            </div>
                            <div className={this.state.isOwner ? 'error-box-manager' : 'hidden'}><p className={this.state.isOwner ? 'error-message-manager error-owner' : 'hidden'}>Silly, that's yours!</p></div>
                            <div className={this.state.notFound ? 'error-box-manager' : 'hidden'}><p className={this.state.notFound ? 'error-message-manager error-not-found' : 'hidden'}>User not found!</p></div>
                            <div className={this.state.alreadyManager ? 'error-box-manager' : 'hidden'}><p className={this.state.alreadyManager ? 'error-message-manager error-dogmanager' : 'hidden'}>Already a dog manager!</p></div>
                    </div>

                    {this.state.dogManagers ?
                        <div className='manager-list-add'>
                            {this.state.dogManagers.map((manager, index) => {
                                return (
                                    <ListBox
                                        key={index}
                                        id={manager._id}
                                        name={manager.name}
                                        avatar={manager.avatar}
                                        phone={manager.phone}
                                        displayName={manager.display_name}
                                        deleteManager={() => this.deleteManager(manager._id)}
                                    />
                                )
                            })}  
                        </div>
                    : <></>}
                    
                    {this.state.dogManagers && this.state.dogManagers.length > 0 ? 
                        <button onClick={this.handleSubmit}>Add</button>
                    : <></>}
                </div>
        )
    }
};