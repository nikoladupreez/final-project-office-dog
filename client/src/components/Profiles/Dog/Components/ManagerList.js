import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

export default class ManagerList extends Component {
    state = {
        dogId: this.props.match.params.id,
        dog: {},
        managerList: this.state.dog.dog_managers
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/dogs/dog/${this.state.dogId}`
        })
        .then((dog) => this.setState({dog: JSON.parse(dog)}))
        .catch((err) => console.log(err.message));
    }

    render() {
        return (
            <div>
                <Link to={`/dog/${this.state.dogId}/profile`}><button>Back</button></Link>
                <h1>Dog managers</h1>
                <div>
                    {this.state.managerList.map((manager) => {
                       return (
                           <div>
                                <img src={manager.image_URL} alt='user'/>
                                <h2>{manager.name}</h2>
                                <h3>{manager.phone}</h3>
                           </div>
                       )
                    })}
                </div>  
                <Link to={`/dog/${this.state.dogId}/add-manager`}><button>Add dog manager</button></Link>
            </div>
        )
    }
}
