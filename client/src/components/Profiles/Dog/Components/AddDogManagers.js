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
        this.getUser = this.getUser.bind(this);
    }

    state = {
        dog: {},
        dogId: this.props.match.params.id,
        dogManagers: [],
        user: getUser(),
        users: [],
        isOwner: false,
        notFound: false,
        alreadyManager: false
    }

    getUser(email){
       axios({
                method: "GET",
                url: `${process.env.REACT_APP_API}/users/email/${email}`
        })
        .then((user) => {
            return user.data;
        })
        .catch((err) => console.log(err.message));
    }

    getDog(){
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

    componentDidMount() {
        this.getDog();
    }

    handleSearch(e) {
        let dogManagers = [...this.state.dogManagers];
        this.setState({notFound: false});
        this.setState({alreadyManager: false});
        this.setState({isOwner: false});

        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/users/email/${this.searchValue.current.value}`
        })
        .then((user) => {
            let managerList = [...this.state.dogManagers];
            let managerFound = managerList.filter((manager) => {
                return (user.data === manager)
            });

            if(user.data._id === this.state.user._id){
                this.setState({isOwner: true});
            }else if(managerFound.length > 0){
                return;
            }else if(user.data.dog_manager){
                let dogFound = user.data.dog_manager.dogs.filter((dog) => {
                    return (dog._id === this.state.dogId)
                });
                if (dogFound.length > 0){
                    this.setState({alreadyManager: true});
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
                    <div className='manager-search-box'>
                        <input type='text' placeholder="Search Coworker's email" ref={this.searchValue}/>
                        <div onClick={this.handleSearch} className='search-icon'></div>
                    </div>
                    { this.state.isOwner ? 
                            <p>That is your own email adress silly!</p>
                        : <></>}
                    { this.state.notFound ? 
                        <p>User is not found in the database!</p>
                    : <></>}
                    { this.state.alreadyManager ?
                        <p>User is already a dogmanager of {this.state.dog.name}!</p>
                    : <></>}
                    <div className='manager-list-add'>
                        {this.state.dogManagers.map((manager, index) => {
                            return (
                                <ListBox
                                    key={index}
                                    id={manager._id}
                                    name={manager.name}
                                    avatar={manager.avatar}
                                    displayName={manager.display_name}
                                    deleteManager={() => this.deleteManager(manager._id)}
                                />
                            )
                        })}  
                    </div>
                    {this.state.dogManagers.length > 0 ? 
                        <button onClick={this.handleSubmit}>Add</button>
                    : <></>}
                </div>
        )
    }
};