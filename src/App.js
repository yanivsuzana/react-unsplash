import React from 'react';
import './App.css';
import SearchPhotos from "./components/searchphotos/searchPhotos"
import Login from "./components/userLogin/userLogin"
import { BrowserRouter, Redirect , Link , Route , Switch } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/searchphotos">Search</Link>
        </nav>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/SearchPhotos" component={SearchPhotos}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;