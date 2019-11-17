import React, { Component } from 'react'
import {Route, Switch, Redirect} from 'react-router-dom';

//components
import ManagerList from './Components/ManagerList';
import AddManagers from './Components/AddDogManagers';
import {isDogOwner, getUser} from '../../../utils/auth';

const SecureRouteOwner = ({ component: Component, ...rest }) => (
    <Route {...rest} render={ (props) => {
      if (isDogOwner(props.match.params.id, getUser()._id)) {
        return  <Component {...props} />
      } else {
        return <Redirect to='/dog/:id/profile' />
      }
    }}/>
  );

export default class DogManagerSpace extends Component {
    render() {
        return (
                <Switch>
                    <SecureRouteOwner exact path='/dog/:id/profile/managers/add' component={AddManagers} />
                    <Route exact path='/dog/:id/profile/managers' component={ManagerList}/>
                </Switch>
        )
    }
}