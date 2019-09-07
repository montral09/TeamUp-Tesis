import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";

// Main css
import './App.css';

import './teamUp.css';

// Layouts
import Page from './components/layout';

// Multilanguage
import translations from './constants/translations'
import { IntlReducer as Intl, IntlProvider } from 'react-redux-multilingual'


class App extends React.Component {

   state = {
      userName: ''
   }   

 
   render() {
      return (
               <Router basename={process.env.PUBLIC_URL}> 
                  <div className="standard-body">
                     <div id="main">
                        <Page />
                     </div>
                  </div>
               </Router>
      );
   }
}

export default App; 