import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import {getUser} from '../../../../utils/auth';

import Map from './Map';

import '../../../../styles/Walker.scss';

const AVG_WALKING_SPEED = 15; // 15 min per km

export default class Walker extends Component {
    constructor(props){
        super(props)
        this.handleShowCommands = this.handleShowCommands.bind(this);
        this.handleCloseCommands = this.handleCloseCommands.bind(this);
        this.handleShowICE = this.handleShowICE.bind(this);
        this.handleCloseICE = this.handleCloseICE.bind(this);
        this.increaseCount = this.increaseCount.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.submitCookies = this.submitCookies.bind(this);
        this.submitPoops = this.submitPoops.bind(this);
        this.submitWalk = this.submitWalk.bind(this);
        this.getDogAge = this.getDogAge.bind(this);
    }

    state = {
        dogId: this.props.match.params.id,
        userId: getUser()._id,
        age: 0,
        dog: {},
        poopCount: 0,
        cookieCount: 0,
        walkCount: 0,
        kmCount: 0,
        minActual: 0,
        minCount: 0,
        seconds: 0,
        meters: 0,
        path: [],
        commandList: [],
        showCommands: false,
        setShowCommands: false,
        showICE: false,
        setShowICE: false
    }

    componentDidMount() {
        axios({
            method: "GET",
            url: `${process.env.REACT_APP_API}/dogs/dog/${this.state.dogId}`
        })
        .then((dog) => {
            this.setState({dog: dog.data})
            this.setState({commandList: dog.data.commands});
            this.getDogAge();
        })
        .catch((err) => console.log(err.message));
    }

    getDogAge() {
        let today = new Date();
        let yearToday = today.getFullYear();

        let dog = {...this.state.dog};
        let birthday = dog.birthday;
        let birthYear = parseInt(birthday.slice(0,4));
   
        let age = yearToday - birthYear;
        this.setState({age: age});
    }

    handleShowCommands() {
        this.setState({setShowCommands: true})
        this.setState({showCommands: true})
    }

    handleCloseCommands() {
        this.setState({setShowCommands: false})
        this.setState({showCommands: false})
    }

    handleShowICE() {
        this.setState({setShowICE: true})
        this.setState({showICE: true})
    }

    handleCloseICE() {
        this.setState({setShowICE: false})
        this.setState({showICE: false})
    }

    increaseCount(data) {
        if (data === 'cookie'){
            let count = this.state.cookieCount;
            let countNew = count + 1;
            this.setState({cookieCount: countNew});
        } else if (data === 'poop') {
            let count = this.state.poopCount;
            let countNew = count + 1;
            this.setState({poopCount: countNew});
        }
    }

    startTracking() {
      
    }

    stopTracking(data) {
        this.setState({
            poopCount: data.poops.length,
            cookieCount: data.cookies.length,
            kmCount: this.round(data.distanceWalked/1000),
            meters: data.distanceWalked,
            seconds: this.round(data.timeWalked/1000),
            minActual: this.round(data.timeWalked/60000),
            minCount: this.round((data.distanceWalked/1000) * AVG_WALKING_SPEED),
            path: data.path
        });
    }

    calculateDistance(){
        let meters = 0
        this.setState({meters: meters});

        let km = 0
        this.setState({kmCount: km});
    }

    calculateTime(){
        let seconds = 0
        this.setState({seconds: seconds});

        let minutes = 0
        this.setState({minCount: minutes});
    }

    setPath(coordinates){
        let path = [...this.state.path];
        let pathNew = path.push(coordinates);
        this.setState({path: pathNew})
    }

    submitCookies() {
        return (
            axios({
                method: "POST",
                url: `${process.env.REACT_APP_API}/cookies/dog/${this.state.dogId}/add`,
                headers: { 'content-type': 'application/json' },
                data: JSON.stringify(this.state)
            })
        )
    }

    submitPoops() {
        return (
            axios({
                method: "POST",
                url: `${process.env.REACT_APP_API}/poops/dog/${this.state.dogId}/add`,
                headers: { 'content-type': 'application/json' },
                data: JSON.stringify(this.state)
            })
        )
    }

    submitWalk() {
      return (
            axios({
                method: "POST",
                url: `${process.env.REACT_APP_API}/walks/dog/${this.state.dogId}/add`,
                headers: { 'content-type': 'application/json' },
                data: JSON.stringify(this.state)
            })
      )
    }

    handleSubmit() {
        Promise.all([this.submitCookies(), this.submitPoops(), this.submitWalk()])
        .then((res) => {
            this.setState({poopCount: 0});
            this.setState({cookieCount: 0});
            this.setState({kmCount: 0});
            this.setState({minCount: 0});

            this.props.history.push(`/dog/${this.state.dogId}/home`);
        })
        .catch((err) => {

        })     
    }

    round = (num) => {
        return Math.round(num * 100) / 100
      }
    
    render() {
        return (
            <div className='walker-container'>
                    <div className='back-box'>
                        <Link to={`/dog/${this.state.dogId}/home`}><div className='back-icon'></div></Link>
                    </div>
                    <div className='manager-title'>
                        <h1>Walks</h1>
                    </div>
                        <Map 
                            onStart={this.startTracking}
                            onStop={ (data) => this.stopTracking(data)}
                            onPoop={() => {this.increaseCount('poop')}}
                            onCookie={() => {this.increaseCount('cookie')}}
                            onShowICE={this.handleShowICE}
                            onShowCommands={this.handleShowCommands}
                        />                        
                    <div className='walk-data-container'>
                        <div className='walk-data-box'>
                            <div className='walk-data'>
                                <p>{this.state.minActual}</p>
                            </div>
                            <h2>MIN</h2>
                            <div className='walk-data'>
                                <p>{this.state.kmCount}</p>
                            </div>
                            <h2>KM</h2>
                        </div>
                        <div className='button-data-box'>
                            <div className='button-data'>
                                <div className='poop-icon-small'></div>
                                <h3>{this.state.poopCount}</h3>
                            </div>
                            <div className='button-data'>
                                <div className='cookie-icon-small'></div>
                                <h3>{this.state.cookieCount}</h3>
                            </div>
                        </div>
                    </div>
                    <div className='walk-data-container'>
                        <div className='walk-data-box'>
                            <div hidden={!this.state.kmCount}><h3>Expected time based on {AVG_WALKING_SPEED} min/km is: <br/> <span>{this.state.minCount} min</span></h3></div>
                            <div hidden={this.state.kmCount}> </div>
                        </div>
                    </div>
                    <div className='walk-data-container'>
                        <div className='walk-btn-box'>
                            <button onClick={this.handleSubmit}>Save walk</button>
                        </div>    
                    </div>

                    {!this.state.dog.owner ? 
                        <div/>
                    :
                        <Modal
                                show={this.state.showICE}
                                onHide={this.handleCloseICE}
                                dialogClassName="modal-90w"
                                centered='true'
                                aria-labelledby="ice-modal"
                                container={document.querySelector('#root')}
                                style={{maxWidth: '85%', width: '85%', height: 'auto', left: '18px', top: '-90px', position: 'absolute', borderRadius: '5px'}}
                            >
                                <Modal.Header closeButton id='modal-header'>
                                <Modal.Title id="ice2-title">
                                    Emergency <br/> Card
                                </Modal.Title>
                                </Modal.Header>
                                    <Modal.Body id='ice-body' style={{margin: '0 0 0 -15px'}}>
                                            <div className='ice-info-container'>
                                                <div className='ambulance-box'>
                                                    <h1 className='ice-label'>Dutch Animal Ambulance</h1>
                                                    <Link to='tell:09000245'><p>0900 0245</p></Link>
                                                </div>
                                            <div className='box-text box4 dog-ice'>
                                                    <p>{this.state.dog.name}<br/>
                                                    {this.state.dog.breed}<br/>
                                                    {this.state.age} years old<br/>
                                                    {this.state.dog.gender}</p>
                                            </div>
                                            <h1 className='ice-label'>Contact Owner {this.state.dog.name}</h1>
                                            <div className='box-text box2 dog-ice'>
                                                    <p>{this.state.dog.owner.name}<br/>
                                                    <Link to={`tell:${this.state.dog.owner.phone}`}>{this.state.dog.owner.phone}</Link></p>
                                            </div>
                                            <h1 className='ice-label'>Emergency contact 1</h1>
                                            <div className='box-text box2 ice-ice'>
                                                <p>{this.state.dog.ice_1.name}<br/>
                                                <Link to={`tell:${this.state.dog.owner.phone}`}>{this.state.dog.ice_1.phone}</Link></p>
                                            </div>
                                            {this.state.dog.ice_2.name ?
                                                <>
                                                <h1 className='ice-label'>Emergency contact 2</h1>
                                                <div className='box-text box2 ice-ice'>
                                                    <p>{this.state.dog.ice_2.name}<br/>
                                                    <Link to={`tell:${this.state.dog.ice_2.phone}`}>{this.state.dog.ice_2.phone}</Link></p>
                                                </div>
                                                </>
                                            : <></>}
                                            <h1 className='ice-label'>Veterinary</h1>
                                            <div className='box-text box3 vet-ice'>
                                                <p>{this.state.dog.vet.name}<br/>
                                                {this.state.dog.vet.company}<br/>
                                                <Link to={`tell:${this.state.dog.vet.phone}`}>{this.state.dog.vet.phone}</Link></p>
                                            </div>
                                    </div>
                                </Modal.Body>
                            </Modal>
                         }
                        <Modal
                            show={this.state.showCommands}
                            onHide={this.handleCloseCommands}
                            dialogClassName="modal-90w"
                            centered='true'
                            aria-labelledby="command-modal"
                            container={document.querySelector('#root')}
                                style={{maxWidth: '85%', width: '85%', height: 'auto', left: '18px', top: '-90px', position: 'absolute', borderRadius: '5px'}}
                        >
                            <Modal.Header closeButton id='modal-header'>
                            <Modal.Title id="commands-title">
                                Commands 
                            </Modal.Title>
                            </Modal.Header>
                                <Modal.Body id='command-body' style={{margin: '0 0 0 -15px'}}>
                                    {this.state.commandList.map((command, index) => {
                                        return (
                                            <div className='walker-command-box' key={index}>
                                                <h1>{command.commando}</h1>
                                                <h3>{command.pronounce}</h3>
                                                {this.state.dog.english ?
                                                    <h2>{command.translation}</h2>
                                                :<></>}
                                                <p>{command.description}</p>
                                            </div>
                                        )
                                    })}
                            </Modal.Body>
                        </Modal>
            </div>
        )
    }
}
