import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";

// Bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

// Main css
import './App.css';

// Layouts
import Page from './components/layout';

// Redux
import store from './services/store';
import { Provider } from 'react-redux';

// Notify
import { ToastContainer } from 'react-toastify';

// Multilanguage
import translations from './constants/translations';
import { IntlReducer as Intl, IntlProvider } from 'react-redux-multilingual';

class App extends React.Component {

   render() {

      return (
         <Provider store={store}>
            <IntlProvider translations={translations} locale='es'>
               <Router basename={process.env.PUBLIC_URL}> 
                  <div className="standard-body">
                     <div id="main">
                        <Page />
                        <ToastContainer />
                     </div>
                  </div>
               </Router>
            </IntlProvider>
         </Provider>
      );
   }
}

export default App; 