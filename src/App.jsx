import React from 'react';
import { Template } from 'govuk-react-jsx';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import HeaderService from './components/HeaderService';
import Home from "./pages/Home";
import CreateRecord from "./pages/CreateRecord";
import Feedback from "./pages/Feedback";
import Cookies from "./pages/Cookies";

import './App.css';

const headerProps = {
  serviceUrlHref: '/',
  navigationClassName: 'govuk-header__navigation--end',
  productName:'Kainos Testing',
  navigation: [
    {
      children: 'Home',
      to: '/',
    },
    {
      children: 'Create Record',
      to: '/create-record',
    },
    {
      children: 'Cookies',
      to: '/cookies',
    },
    {
      children: 'Feedback',
      to: '/feedback',
    },
  ],
};

const footerProps = {
  meta: {
    children: [
      'Kainos Testing Tools'
    ]
  }
}

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Template header={headerProps} footer={footerProps}>
        <Helmet>
          <title>Kainos Testing</title>
        </Helmet>
        <HeaderService />

        <Route exact path="/">
          <Home />
        </Route>

        <Route path="/cookies">
          <Cookies />
        </Route>

        <Route path="/create-record">
          <CreateRecord />
        </Route>

        <Route path="/feedback">
          <Feedback />
        </Route>
      </Template>
    </Router>
  );
}

export {
  App
};
