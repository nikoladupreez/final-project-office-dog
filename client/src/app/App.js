import React, {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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
import {getUser, loggedIn} from '../utils/auth';


const SecureRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    loggedIn()
      ? <Component {...props} />
      : <Redirect to='/login' />
  )} />
);


class App extends Component {
  state = {
    user: getUser, 
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={Index}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/signup' component={Signup}/>
          <SecureRoute exact path='/home' component={Home} onEnter={this.requireAuth}/>
          <SecureRoute path='/add-dog' component={AddDogspace} onEnter={this.requireAuth}/>
          <SecureRoute path='/dog' component={Dogspace} onEnter={this.requireAuth}/>
          <SecureRoute path='/user' component={UserProfileSpace} onEnter={this.requireAuth}/>
        </Switch>
      </div>
    );
  }
}

export default App;
