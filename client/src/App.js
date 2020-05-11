import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import GlobalLobby from "./pages/GlobalLobby";
import GameFilter from "./components/game/GameFilter";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/util/ProtectedRoute";
import AuthRoute from "./components/util/AuthRoute";
import "./stylesheets/application.scss";
import Splash from "./pages/Splash";

export default () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Splash} />
        <ProtectedRoute exact path="/" component={GlobalLobby} />
        <ProtectedRoute path="/game/:id" component={GameFilter} />
        <AuthRoute path="/login" render={() => <Auth action="login" />} />
        <AuthRoute path="/signup" render={() => <Auth action="signup" />} />
        <Route path="/" component={ErrorPage} />
      </Switch>
    </BrowserRouter>
  );
};
