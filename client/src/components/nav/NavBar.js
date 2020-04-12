import React from "react";
import LogOutButton from "../users/LogOutButton";
import { Link } from "react-router-dom";
import ProtectedComponent from "../util/ProtectedComponent";
import NavBarPlayerCount from "./NavBarPlayerCount";

const NavBar = ({ data, noData }) => {
  return (
    <>
      <div className="nav-bar-wrapper">
        <div className="left-nav">
          {!noData && (
            <ProtectedComponent component={NavBarPlayerCount} data={data} />
          )}
        </div>
        <div className="other-left">&nbsp;</div>
        <div className="logo-wrapper">
          <Link to="/" className="logo-nav">
            CodeDueler
          </Link>
        </div>
        <div>
          <ProtectedComponent component={LogOutButton} />
        </div>
      </div>
      <div className="spacer">&nbsp;</div>
    </>
  );
};

export default NavBar;
