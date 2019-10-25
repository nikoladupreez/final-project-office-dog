import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

//components
import Nav from '../Nav';
import DataOverview from './DataOverview';

export default class Tracker extends Component {
    state = {
        dogId: this.props.match.params.id,
        weekDay: "",
        dateDay: null,
        trackings: false,
        cookiesList: [],
        poopsList: [],
        walksList: [],
        cookiesToday: [],
        poopsToday: [],
        walksToday: []
    }

    getCookiesToday() {
        let cookiesTotal = [...this.state.cookiesList];
        cookiesTotal.filter((cookie) => {
            return (cookie.added_at === Date.now()) //weergave verander
        })
    }

    getPoopsToday() {
        
    }

    getWalksToday() {
        
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/dogs/dog/${dogId}`
        })
        .then((dog) => {
            this.setState({cookiesList: JSON.parse(dog.cookies)})
            this.setState({cookiesList: JSON.parse(dog.poops)})
            this.setState({cookiesList: JSON.parse(dog.walks)})
        })
    }

    getDateToday() {
        return Date.now(); //weergave verander
    }

    checkForTrackings() {
        if (this.state.cookiesToday && this.state.poopsToday && this.state.walksToday === []) {
            this.setState({trackings: false})
        } else {
            this.setState({trackings: true})
        }
    }

    render() {
        return (
            <>
                <Nav/>
                <div>
                    <h1>{this.state.weekDay}</h1>
                    <h1>{this.state.dateDay}</h1>
                    {this.state.trackings ? 
                        <div>
                            <DataOverview/>
                        </div>
                     :

                        <div>
                            <p>No trackings yet today</p>
                            <p>Start tracking!</p>
                        </div>
                    }
                    <div>
                        <Link to=''><img src='' alt=''/></Link>
                        <Link to=''><img src='' alt=''/></Link>
                        <Link to=''><img src='' alt=''/></Link>
                        <Link to=''><img src='' alt=''/></Link>
                    </div>
                </div>
            </>
        )
    }
}
