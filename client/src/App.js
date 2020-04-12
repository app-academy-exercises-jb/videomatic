import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import GlobalLobby from "./pages/GlobalLobby";
import GameScreen from "./pages/GameScreen";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/util/ProtectedRoute";
import AuthRoute from "./components/util/AuthRoute";
import "./stylesheets/application.scss";
import Spectator from "./pages/Spectator";

export default () => {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute exact path="/" component={GlobalLobby} />
        <ProtectedRoute path="/game/:id" component={GameScreen} />
        {/* <ProtectedRoute path="/game/:id" component={Spectator} /> */}
        <AuthRoute path="/login" component={Login} />
        <AuthRoute path="/signup" component={SignUp} />
        <Route path="/" component={ErrorPage} />
      </Switch>
    </BrowserRouter>
  );
};
