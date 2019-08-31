import React from 'react';
import { Route, Switch } from 'react-router-dom';

// Layout
import HomePage from './home';

import Login from './account/login';

const Page = (props) => {
  return (  

    <>
      <Switch>
        <Route path="/" exact component={HomePage} />        
        <Route path="/account/login" component={Login} />
      </Switch>
    </>
  );
}

export default Page;