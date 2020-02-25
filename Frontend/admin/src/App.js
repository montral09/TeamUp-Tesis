import React from 'react';
import ReactDOM from 'react-dom';
// import registerServiceWorker from './registerServiceWorker';
import { unregister } from './registerServiceWorker';

import { HashRouter } from 'react-router-dom';
import './assets/base.css';
import Home from './Pages/Home';
import configureStore from './config/configureStore';
import store from './config/configureStore';
import { Provider } from 'react-redux';



const storeInitial = store;

class App extends React.Component {
   render() {
      return (
        <Provider store={storeInitial}>
            <HashRouter>
            <Home />
            </HashRouter>
        </Provider>        
      );
   }
}

export default App; 