import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

//components
import Tracker from './Components/Tracker';

//style
import '../../../styles/DogHome.scss';

export default class DogHome extends Component {
    state = {
        dogId: this.props.match.params.id,
        dateToday: "",
        weekDay: '',
        dateDay: 0,
        trackings: false,
        cookiesList: [],
        poopsList: [],
        walksList: [],
        cookieCountToday: 0,
        poopCountToday: 0,
        walkCountToday: 0,
        walkKmToday: 0,
        walkMinToday: 0
    }

    getCookiesToday() {
        let cookiesTotal = [...this.state.cookiesList];
        let cookies = cookiesTotal.filter((cookie) => {
            let cookieDate = this.getDateString(new Date(cookie.added_at));
            return (cookieDate === this.state.dateToday)
        })
        
        let cookieCount = 0;
        cookies.forEach((cookie) => {
            cookieCount = cookieCount + cookie.quantity;
        })

        this.setState({cookieCountToday: cookieCount});
    }

    getPoopsToday() {
        let poopsTotal = [...this.state.poopsList];
        let poops = poopsTotal.filter((poop) => {
            let poopDate = this.getDateString(poop.added_at);
            return (poopDate === this.state.dateToday)
        })

        this.setState({poopCountToday: poops.length});
    }

    getWalksToday() {
        let walksTotal = [...this.state.walksList];
        let walks = walksTotal.filter((walk) => {
            let walkDate = this.getDateString(walk.added_at);
            return (walkDate === this.state.dateToday)
        })

        let seconds = 0;
        let meters = 0;

        walks.forEach((walk) => {
            seconds = seconds + walk.time_seconds;
            meters = meters + walk.distance_meters;
        })

        let minutes = Math.floor(seconds / 60);
        let km = Math.floor(meters / 1000);
        
        this.setState({walkCountToday: walks.length});
        this.setState({walkKmToday: km});
        this.setState({walkMinToday: minutes});
    }

    componentDidMount() {
        this.initializeDates();

        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/dogs/dog/${this.state.dogId}`
        })
        .then((dog) => {
            this.setState({cookiesList: dog.data.cookies})
            this.setState({poopsList: dog.data.poops})
            this.setState({walksList: dog.data.walks})

            this.getCookiesToday();
            this.checkForTrackings();
        })
        .catch((err) => console.log(err.message));
    }

    initializeDates() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let dateShort = `${year}/${month}/${day}`;

        let weekDay = date.getDay();
        let dayName = '';

        switch (weekDay) {
            case 0:
              dayName = "Sun";
              break;
            case 1:
              dayName = "Mon";
              break;
            case 2:
               dayName = "Tue";
              break;
            case 3:
              dayName = "Wed";
              break;
            case 4:
              dayName = "Thu";
              break;
            case 5:
              dayName = "Fri";
              break;
            case 6:
              dayName = "Sat";
              break;
            default:
              break;
          }

        this.setState({dateDay: day});
        this.setState({weekDay: dayName});
        this.setState({dateToday: dateShort});
    }

    getDateString(date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let dateShort = `${year}/${month}/${day}`;

        return dateShort;
    }

    checkForTrackings() {
        if (this.state.cookieCountToday > 0 || this.state.poopCountToday > 0 || this.state.walkCountToday > 0) {
            this.setState({trackings: true})
        } else {
            this.setState({trackings: false})
        }
    }

    render() {
        return (
            <>
                <div className='nav'>
                    <Link to={`/dog/${this.state.dogId}/profile`}><div className='dogprofile-icon'></div></Link>
                    <Link to={`/dog/${this.state.dogId}/home`}><div className='doghome-icon'></div></Link>
                    <Link to={`/user/profile`}><div className='userprofile-icon'></div></Link>
                </div>
                <div className='dogspace-container'>
                    <div>
                        {this.state.trackings ? 
                            <div>
                                <h1>{this.state.weekDay}</h1>
                                <h1>{this.state.dateDay}</h1>
                                <Tracker
                                    cookieCount={this.state.cookieCountToday}
                                    poopCount={this.state.poopCountToday}
                                    walkCount={this.state.walkCountToday}
                                    walkKm={this.state.walkKmToday}
                                    walkMin={this.state.walkMinToday}
                                />
                            </div>
                        :

                            <div className='no-trackings'>
                                <p>No trackings yet today. <br/><span>Start tracking!</span></p>
                            </div>
                        }
                        <div className='dogspace-btn-box'>
                            <Link to={`/dog/${this.state.dogId}/home/walk`}><div className='walk-btn'></div></Link>
                            <Link to={`/dog/${this.state.dogId}/home/cookie`}><div className='cookie-btn'></div></Link>
                            <Link to={`/dog/${this.state.dogId}/home/ice`}><div className='ice-btn'></div></Link>
                            <Link to={`/dog/${this.state.dogId}/home/dictionary`}><div className='dictionary-btn'></div></Link>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
