import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import qs from "querystring";
import {getUser} from "../../../../utils/auth";

export default class Cookie extends Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        count: 0,
        user: getUser(),
        dogId: this.props.match.params.id
    }

    handleChange(e) {
        this.setState({count: e.target.value})
    }

    handleSubmit() {
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/dog/${this.state.dogId}/add-cookie`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(this.state)
        })
        .then((res) => {
            this.props.history.push(`/dog/${this.state.dogId}`);
        })
        .catch((err) => console.log(err.message));
    }

    render() {
        return (
            <div>
                <Link to={`/dog/${this.state.dogId}`}><img src='/' alt='back-link'/></Link>
                <h1>Cookies</h1>
                <img src='/' alt='cookie'/>
                <input onChange={this.handleChange} type='number' />
                <button onClick={this.handleSubmit}>Add cookies</button>
            </div>
        )
    }
}
