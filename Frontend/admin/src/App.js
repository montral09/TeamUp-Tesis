import React from 'react';
import ReactDOM from 'react-dom';
// import registerServiceWorker from './registerServiceWorker';
import { unregister } from './registerServiceWorker';

import { HashRouter } from 'react-router-dom';
import './assets/base.css';
import Home from './DemoPages/Home';
import configureStore from './config/configureStore';
import { Provider } from 'react-redux';



const store = configureStore();

class App extends React.Component {
   render() {
      return (
        <Provider store={store}>
            <HashRouter>
            <Home />
            </HashRouter>
        </Provider>        
      );
   }
}

export default App; 