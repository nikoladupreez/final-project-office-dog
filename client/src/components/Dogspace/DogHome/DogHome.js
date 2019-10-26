import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

//components
import Nav from '../../Nav';
import Tracker from './Components/Tracker';

export default class DogHome extends Component {
    state = {
        dogId: this.props.match.params.id,
        dateNow: Date.now(),
        dateToday: this.getDateString(this.state.dateNow),
        weekDay: this.state.dateNow.getUTCDay(),
        dateDay: this.state.dateNow.getUTCDate(),
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
        let cookies = cookiesTotal.filter((cookie) => {
            let cookieDate = this.getDateString(cookie.added_at);
            return (cookieDate === this.state.dateToday)
        })
        this.setState({cookiesToday: cookies});
    }

    getPoopsToday() {
        let poopsTotal = [...this.state.poopsList];
        let poops = poopsTotal.filter((poop) => {
            let poopDate = this.getDateString(poop.added_at);
            return (poopDate === this.state.dateToday)
        })
        this.setState({poopsToday: poops});
    }

    getWalksToday() {
        let walksTotal = [...this.state.walksList];
        let walks = walksTotal.filter((walk) => {
            let walkDate = this.getDateString(walk.added_at);
            return (walkDate === this.state.dateToday)
        })
        this.setState({walksToday: walks});
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/dogs/dog/${this.state.dogId}`
        })
        .then((dog) => {
            this.setState({cookiesList: JSON.parse(dog.cookies)})
            this.setState({cookiesList: JSON.parse(dog.poops)})
            this.setState({cookiesList: JSON.parse(dog.walks)})
        })
    }

    getDateString(date) {
        let month = date.getUTCMonth() + 1;
        let day = date.getUTCDate();
        let year = date.getUTCFullYear();
        let dateShort = `${year}/${month}/${day}`;
        return dateShort;
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
                            <Tracker
                                cookies={this.state.cookiesToday}
                                poops={this.state.poopsToday}
                                walks={this.state.walksToday}
                            />
                        </div>
                     :

                        <div>
                            <p>No trackings yet today</p>
                            <p>Start tracking!</p>
                        </div>
                    }
                    <div>
                        <Link to={`/dog/${this.state.dogId}/home/walk`}><img src='/' alt='walk'/></Link>
                        <Link to={`/dog/${this.state.dogId}/home/cookie`}><img src='/' alt='cookie'/></Link>
                        <Link to={`/dog/${this.state.dogId}/home/ice`}><img src='/' alt='emergency'/></Link>
                        <Link to={`/dog/${this.state.dogId}/home/dictionary`}><img src='/' alt='dictionary'/></Link>
                    </div>
                </div>
            </>
        )
    }
}
