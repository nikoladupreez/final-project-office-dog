import React, { Component } from 'react'
import {Route, Switch, Redirect} from 'react-router-dom';

//components
import DogProfile from './Components/DogProfile';
import DogProfileEdit from '../Dog/Components/DogProfileEdit';
import DogGuide from './Components/DogGuide';
import DogGuideEdit from './Components/DogGuideEdit';
import DogManagerSpace from './DogManagerSpace';
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

export default class DogProfileSpace extends Component {
    render() {
        return (
                <Switch>
                    <SecureRouteOwner exact path='/dog/:id/profile/edit'  component={DogProfileEdit} />
                    <Route exact path='/dog/:id/profile/guide' component={DogGuide}/>
                    <SecureRouteOwner exact path='/dog/:id/profile/guide/edit' component={DogGuideEdit} />
                    <Route path='/dog/:id/profile/managers' component={DogManagerSpace}/>
                    <Route exact path='/dog/:id/profile' component={DogProfile}/>
                </Switch>
        )
    }
}