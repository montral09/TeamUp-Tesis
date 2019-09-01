import React from 'react';
import { Route, Switch } from 'react-router-dom';

// Layout
import HomePage from './home';

import Login from './account/login';
import Register from './account/register';

const Page = () => {
  return (
    <>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/account/login" component={Login} />
        <Route path="/account/register" component={Register} />
      </Switch>
    </>
  );
}

export default Page;