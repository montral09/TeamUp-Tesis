import React from 'react';
import ReactDOM from 'react-dom';
// import registerServiceWorker from './registerServiceWorker';
import { unregister } from './registerServiceWorker';

import { HashRouter } from 'react-router-dom';
import './assets/base.css';
import Main from './DemoPages/Main';
import configureStore from './config/configureStore';
import { Provider } from 'react-redux';

import Login from './DemoPages/Login';

const store = configureStore();

class App extends React.Component {
   render() {
      let userIsLogged = true;
      let showMainOrLogin = userIsLogged ? <Main /> : <Login />
      return (
        <Provider store={store}>
            <HashRouter>
            {showMainOrLogin}
            </HashRouter>
        </Provider>        
      );
   }
}

export default App; 