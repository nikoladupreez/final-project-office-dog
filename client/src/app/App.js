import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faTimes, faChevronLeft, faUserCircle } from '@fortawesome/free-solid-svg-icons';

//style
import '../styles/App.scss';

//components
import Index from '../components/Index';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import Home from '../components/Home/Home';
import AddDogspace from '../components/Auth/AddDogspace';
import Dogspace from '../components/Dogspace/Dogspace';
import UserProfileSpace from '../components/Profiles/User/UserProfileSpace';

// library.add(faTimes, faChevronLeft, faUserCircle);

class App extends Component {
  state = {
    example: "",
    error: null, 
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={Index}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/signup' component={Signup}/>
          <Route exact path='/home' component={Home}/>
          <Route path='/add-dog' component={AddDogspace}/>
          <Route path='/dog' component={Dogspace}/>
          <Route path='/user' component={UserProfileSpace}/>
        </Switch>
      </div>
    );
  }
}

export default App;
