import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Report from './components/SavedReport';
import Styles from './components/Styles';
import Profile from './components/Profile';
import { Home } from './menuitems/Home';
import { AddReport } from './menuitems/AddReport';
import Translator from './Translator';

export const App: React.FC = () => {
  return (
    <Styles>
      <div style={{ marginBottom: 5, width: '50%', display: 'inline-block', minWidth: '75px' }}>
        <img
          alt='Ovation.io'
          src='https://www.ovation.io/wp-content/webpc-passthru.php?src=https://www.ovation.io/wp-content/uploads/2021/07/ovationlogo@2x.png&nocache=1'
        />
        <Translator />
      </div>
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/report/:id' component={Report} />
          <Route path='/add-report/'>
            <AddReport />
          </Route>
        </Switch>
      </Router>
      <Profile />
    </Styles>
  );
};

export default App;
