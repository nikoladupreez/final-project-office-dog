import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import {getUser} from "../../../utils/auth";

//components
import Tracker from './Components/Tracker';

//style
import '../../../styles/DogHome.scss';

export default class DogHome extends Component {
    constructor(props){
        super(props)
        this.handleShowCookie = this.handleShowCookie.bind(this);
        this.handleCloseCookie = this.handleCloseCookie.bind(this);
        this.handleShowICE = this.handleShowICE.bind(this);
        this.handleCloseICE = this.handleCloseICE.bind(this);
        this.increaseCount = this.increaseCount.bind(this);
        this.decreaseCount = this.decreaseCount.bind(this);
        this.handleSubmitCookies = this.handleSubmitCookies.bind(this);
    }

    state = {
        dogId: this.props.match.params.id,
        dog: {},
        user: getUser(),
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
        walkMinToday: 0,
        cookieCount: 0,
        showCookie: false,
        setShowCookie: false,
        showICE: false,
        setShowICE: false
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
            this.setState({dog: dog.data})
            this.getCookiesToday();
            // this.checkForTrackings();
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

    handleShowCookie() {
        this.setState({setShowCookie: true})
        this.setState({showCookie: true})
    }

    handleCloseCookie() {
        this.setState({setShowCookie: false})
        this.setState({showCookie: false})
    }

    increaseCount() {
        let count = this.state.cookieCount;
        let countNew = count + 1;
        this.setState({cookieCount: countNew});
    }

    decreaseCount() {
        if (this.state.cookieCount > 0){
            let count = this.state.cookieCount;
            let countNew = count - 1;
            this.setState({cookieCount: countNew});
        }
    }

    handleShowICE() {
        this.setState({setShowICE: true})
        this.setState({showICE: true})
    }

    handleCloseICE() {
        this.setState({setShowICE: false})
        this.setState({showICE: false})
    }

    handleSubmitCookies() {
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_API}/cookies/dog/${this.state.dogId}/add`,
            headers: { 'content-type': 'application/json' },
            data: JSON.stringify(this.state)
        })
        .then((res) => {
            this.setState({cookieCount: 0});
            this.handleCloseCookie();
            // this.componentDidMount();
        })
        .catch((err) => console.log(err.message));
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
                            <div onClick={this.handleShowCookie} className='cookie-btn'></div>
                            <div onClick={this.handleShowICE} className='ice-btn'></div>
                            <Link to={`/dog/${this.state.dogId}/home/dictionary`}><div className='dictionary-btn'></div></Link>
                            
                        </div>
                        <Modal
                            show={this.state.showCookie}
                            onHide={this.handleCloseCookie}
                            centered='true'
                            dialogClassName="modal-90w"
                            aria-labelledby="cookie-modal"
                            style={{maxWidth: '90%', width: '90%', margin: '0 0 0 18px'}}
                        >
                            <Modal.Header closeButton id='modal-header'>
                                <Modal.Title id="cookie-title">
                                    Cookie <br/> Counter
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body id='cookie-body' style={{margin: '0 0 0 -3px'}}>
                                <div className='cookie-container'>
                                    <div className='cookie-box'>
                                        <img src='/' alt='cookie'/>
                                    </div>
                                    <div className='cookie-count-box'>
                                        <img onClick={this.decreaseCount} src='/' alt='min'/>
                                        <div className='cookie-count'>
                                            <p>{this.state.cookieCount}</p>
                                        </div>
                                        <img  onClick={this.increaseCount} src='/' alt='plus'/>
                                    </div>
                                    <div className='cookie-btn-box'>
                                        <button onClick={this.handleSubmitCookies}>Add</button>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>

                    {!this.state.dog.owner ? 
                        <h1>Loading...</h1>
                    :
                        <Modal
                            show={this.state.showICE}
                            onHide={this.handleCloseICE}
                            dialogClassName="modal-90w"
                            centered='true'
                            aria-labelledby="ice-modal"
                            style={{maxWidth: '90%', width: '90%', margin: '0 0 0 18px', borderRadius: "5px"}}
                        >
                            <Modal.Header closeButton id='modal-header'>
                            <Link to={`/dog/${this.state.dogId}/home/ice/edit`}><div className='edit-btn'></div></Link>
                            <Modal.Title id="ice-title">
                                Emergency <br/> Card
                            </Modal.Title>
                            </Modal.Header>
                                <Modal.Body id='ice-body' style={{margin: '0 0 0 -15px'}}>
                                    <div className='ice-info-container'>
                                        <div className='ambulance-box'>
                                            <h1>Dutch Animal Ambulance</h1>
                                            <Link to='tell:09000245'><p>0900 0245</p></Link>
                                        </div>
                                        <div className='box-text box4'>
                                                <p>{this.state.dog.name}<br/>
                                                   {this.state.dog.breed}<br/>
                                                   {this.state.dog.birthday}<br/>
                                                   {this.state.dog.gender}</p>
                                        </div>
                                        <h1 className='ice-label'>Contact Owner {this.state.dog.name}</h1>
                                        <div className='box-text box2'>
                                                <p>{this.state.dog.owner.name}<br/>
                                                <Link to={`tell:{this.state.dog.owner.phone}`}>{this.state.dog.owner.phone}</Link></p>
                                        </div>
                                        <h1 className='ice-label'>Emergency contact 1</h1>
                                        <div className='box-text box2'>
                                            <p>{this.state.dog.ice_1.name}<br/>
                                            <Link to={`tell:${this.state.dog.ice_1.phone}`}>{this.state.dog.ice_1.phone}</Link></p>
                                        </div>
                                        <h1 className='ice-label'>Emergency contact 2</h1>
                                        <div className='box-text box2'>
                                            <p>{this.state.dog.ice_2.name}<br/>
                                            <Link to={`tell:${this.state.dog.ice_2.phone}`}>{this.state.dog.ice_2.phone}</Link></p>
                                        </div>
                                        <h1 className='ice-label'>Veterinary</h1>
                                        <div className='box-text box3'>
                                            <p>{this.state.dog.vet.name}<br/>
                                            {this.state.dog.vet.company}<br/>
                                            <Link to={`tell:${this.state.dog.vet.phone}`}>{this.state.dog.vet.phone}</Link></p>
                                        </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                        }
                    </div>
                </div>
            </>
        )
    }
}
