import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {getUser} from "../../../../utils/auth";

export default class Cookie extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.increaseCount = this.increaseCount.bind(this);
        this.decreaseCount = this.decreaseCount.bind(this);
    }

    state = {
        count: 0,
        user: getUser(),
        dogId: this.props.match.params.id
    }

    increaseCount() {
        let count = this.state.count;
        let countNew = count + 1;
        this.setState({count: countNew});
    }

    decreaseCount() {
        if (this.state.count > 0){
            let count = this.state.count;
            let countNew = count - 1;
            this.setState({count: countNew});
        }
    }

    handleSubmit() {
        debugger;
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/cookies/dog/${this.state.dogId}/add`,
            headers: { 'content-type': 'application/json' },
            data: JSON.stringify(this.state)
        })
        .then((res) => {
            this.props.history.push(`/dog/${this.state.dogId}/home`);
        })
        .catch((err) => console.log(err.message));
    }

    render() {
        return (
            <div>
                <Link to={`/dog/${this.state.dogId}`}><img src='/' alt='back-link'/></Link>
                <h1>Cookies</h1>
                <img onClick={this.increaseCount} src='/' alt='cookie'/>
                <p>{this.state.count}</p>
                <p onClick={this.decreaseCount}>Less</p>
                <button onClick={this.handleSubmit}>Add cookies</button>
            </div>
        )
    }
}
