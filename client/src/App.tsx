  
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Auth from './hoc/auth';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VideoUploadPage from './pages/VideoUploadPage';

function App() {
  return (
    <Router>
      <NavBar />
      <div style={{ paddingTop: '75px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/video/upload" component={Auth(VideoUploadPage, true)} />
        </Switch>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
