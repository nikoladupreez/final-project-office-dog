import React, {Component} from 'react';
import axios from 'axios';

//components
import DogspaceBox from './DogspaceBox';

export default class Home extends Component {
    state = {
        dogList: this.userPopulated.dogs,
        sessionUser: JSON.parse(localStorage.getItem('user')),
        userPopulated: {}
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/users/${this.state.sessionUser.id}`
        })
        .then((user) => this.setState({userPopulated: JSON.parse(user)}))
        .catch((err) => console.log(err.message));
    }

    render() {
        return (
            <div>
                <h1>Dogspaces</h1>
                <div>
                    {this.state.dogList.map((dog) => {
                        return (
                            <DogspaceBox
                                id={dog.id}
                                avatar={dog.avatar}
                                name={dog.name}
                            />
                        )
                    })}
                </div>       
            </div>
        )
    }
}
