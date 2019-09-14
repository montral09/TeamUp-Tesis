import React from 'react';
import { Route, Switch } from 'react-router-dom';

// Layout Components
import HomePage from './home';
import Login from './account/login';
import Register from './account/register';
import Modify from './account/modify';

const Page = () => {
  return (
    <>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/account/login" component={Login} />
        <Route path="/account/register" component={Register} />
        <Route path="/account/modify" component={Modify} />
      </Switch>
    </>
  );
}

export default Page;