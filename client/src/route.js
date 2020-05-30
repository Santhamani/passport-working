
import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./container/home";
import Login from "./container/Login";
import NotFound from "./container/NotFound";
import Data from "./container/data";
import Signup from "./container/signup";
import Test from "./container/Test";
import Profile from "./container/profile";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
    <Route exact path="/login">
        <Login />
    </Route>
    <Route exact path="/data">
        <Data />
    </Route>
    <Route exact path="/test">
        <Test />
    </Route>
    <Route exact path="/signup">
        <Signup />
    </Route>
    <Route exact path="/profile">
        <Profile />
    </Route>
    {/* Finally, catch all unmatched routes */}
    <Route>
        <NotFound />
    </Route>
    </Switch>
  );
}

