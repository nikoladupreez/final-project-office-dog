import React, {Component} from 'react';
import axios from 'axios';
import {Link, Route, Switch} from 'react-router-dom';

//style
import '../styles/App.scss';

//components
import Login from '../components/Auth/Login';
import Home from '../components/Home/Home';

class App extends Component {
  state = {
    example: "",
    error: null, 
  }

  componentDidMount() {
      axios({
        method: "GET",
        url: `${process.env.REACT_APP_API}/example`
      })
      .then((res) => {
        this.setState({ example: res.data})
      })
      .catch((err) => {
        this.setState({ error: err.message})
      })
  }

  render() {
    return (
      <div className="App">
        {this.state.example.length > 0 ? 
            this.state.example.map((element) => 
              <Example/>
            );
            <h1>Fetching elements</h1>
        }
        {this.state.error &&
          <p>{this.state.error}</p>
        }
        <Switch>
          <Route exact path='/signup/dog-sitter' component={SignupSitter} />
          <Route exact path='/signup/dog-owner' component={SignupOwner} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/' component={Home} />
        </Switch>
      </div>
    );
  }
}

export default App;
