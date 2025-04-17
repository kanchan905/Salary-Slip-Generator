import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Index from './views/Index';
import Login from './views/examples/Login';
import Register from './views/examples/Register';
import routes from './routes';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Switch>
            <Route path="/index" component={Index} />
            <Route path="/login" component={Login} />
            <Route path="/sign-up" component={Register} />
            {routes.dashboard.map((route, index) => (
              <Route key={index} path={route.path} component={route.component} />
            ))}
            {routes.management.map((route, index) => (
              <Route key={index} path={route.path} component={route.component} />
            ))}
            <Route path={routes.masters.path} component={routes.masters.component} />
            <Route path={routes.pentioner.path} component={routes.pentioner.component} />
            {routes.processing.map((route, index) => (
              <Route key={index} path={route.path} component={route.component} />
            ))}
            <Route path={routes.report.path} component={routes.report.component} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;