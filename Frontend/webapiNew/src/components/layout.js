import React from 'react';
import { Route, Switch } from 'react-router-dom';

// Layout Components
import HomePage from './home';
import Login from './account/login';
import Register from './account/register';
import Modify from './account/modify';
import ForgotPassword from './account/forgotPassword';
import ValidateEmail from './account/validateemail';
import CreatePublication from './publications/createPublication/createPublicationMaster';
import ViewPublication from './publications/viewPublication/viewPublication';
import MyPublicationsList from './publications/myPublishedPublications/myPublicationsList';

const Page = () => {
  return (
    <>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/account/login" component={Login} />
        <Route path="/account/register" component={Register} />
        <Route path="/account/modify" component={Modify} />
        <Route path="/account/forgotPassword" component={ForgotPassword} />
        <Route path="/account/validateemail/:emailtoken" component={ValidateEmail} />
        <Route path="/publications/createPublication/createPublicationMaster" component={CreatePublication} />
        <Route path="/publications/viewPublication/viewPublication/:publicationID" component={ViewPublication} />
        <Route path="/publications/myPublishedPublications/myPublicationsList" component={MyPublicationsList} />
      </Switch>
    </>
  );
}

export default Page;