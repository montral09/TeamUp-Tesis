import React from 'react';
import { Route, Switch } from 'react-router-dom';

// Layout Components
import HomePage from './home';
import LoginPage from './account/loginPage';
import Register from './account/register';
import Modify from './account/modify';
import ForgotPassword from './account/forgotPassword';
import ValidateEmail from './account/validateemail';
import CreatePublication from './publications/createPublication/createPublicationMaster';
import ViewPublication from './publications/viewPublication/viewPublication';
import MyPublicationsList from './publications/myPublishedPublications/myPublicationsList';
import MainPublications from './publications/listPublications/mainPublications';
import MyReservedSpacesList from './reservations/myReservedSpaces/myReservedSpacesList';
import MyReservedPublications from './publications/reservedPublications/reservedPublications';
import FavPublications from './publications/favPublications/favPublications';
import NotFoundPage from './pages/404';
import DeleteUser from './account/deleteUser';

const Page = () => {
  return (
    <>
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/account/login" component={LoginPage} />
        <Route path="/account/deleteUser" component={DeleteUser} />
        <Route path="/account/register" component={Register} />
        <Route path="/account/modify" component={Modify} />
        <Route path="/account/forgotPassword" component={ForgotPassword} />
        <Route path="/account/validateemail/:emailtoken" component={ValidateEmail} />
        <Route path="/publications/createPublication/createPublicationMaster" component={CreatePublication} />
        <Route path="/publications/viewPublication/viewPublication/:publicationID" component={ViewPublication} />
        <Route path="/publications/myPublishedPublications/myPublicationsList" component={MyPublicationsList} />
        <Route path="/publications/listPublications/mainPublications/:spacetype/:capacity/:city" component={MainPublications} />
        <Route path="/publications/listPublications/mainPublications" component={MainPublications} />
        <Route path="/reservations/myReservedSpaces/myReservedSpacesList" component={MyReservedSpacesList} />
        <Route path="/publications/reservedPublications/reservedPublications" component={MyReservedPublications} />
        <Route path="/publications/favPublications" component={FavPublications} />
        <Route component={NotFoundPage} />
      </Switch>
    </>
  );
}

export default Page;