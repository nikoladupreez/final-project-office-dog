import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {getUser} from '../../../../utils/auth';


//style
import '../../../../styles/DogManager.scss';

export default class ManagerList extends Component {
    state = {
        dogId: this.props.match.params.id,
        dog: {},
        managerList: [],
        managers: false,
        dogOwnerId: "",
        userId: ""
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/dogs/dog/${this.state.dogId}`
        })
        .then((dog) => {
            this.setState({dog: dog.data})
            this.setState({dogOwnerId: dog.data.owner._id});
            this.setState({userId: getUser()._id});
            this.setState({managerList: dog.data.dog_managers})
            if (dog.data.dog_managers.length > 0){
                this.setState({managers: true});
            }
        })
        .catch((err) => console.log(err.message));
    }

    render() {
        return (
            <div className='manager-container'>
                {this.state.dogOwnerId ?
                    <div className='back-box'>
                        <Link to={`/dog/${this.state.dogId}/profile`}><div className='close-icon'></div></Link>
                        {this.state.dogOwnerId === this.state.userId ? 
                            <Link to={`/dog/${this.state.dogId}/profile/managers/add`}><div className='edit-btn'></div></Link>
                        : <></>}
                    </div>
                : <></> }
                <div className='manager-title'>
                    <h1>Dog Managers</h1>
                </div>
                {this.state.managers ? 
                    <div className='manager-list'>
                        {this.state.managerList.map((manager, index) => {
                        return (
                            <div key={index} className='manager-box'>
                                <div className='manager-img-box'>
                                    <img src={manager.avatar} alt='user'/>
                                </div>
                                <div className='manager-name-box'>
                                    <h2>{manager.name}</h2>
                                    <h3>{manager.display_name}</h3>
                                    <h3>{manager.phone}</h3>
                                </div>
                            </div>
                        )
                        })}
                    </div>  
                :
                    <div className='no-managers'>
                        <p>There are no dog managers yet, add dog managers under edit.</p>
                    </div>
                }
            </div>
        )
    }
}
