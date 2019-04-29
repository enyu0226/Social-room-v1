import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavItem,
  MDBNavLink,
  MDBNavbarToggler,
  MDBCollapse
} from "mdbreact";

const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: "#ff9900" };
  else return { color: "#ffffff" };
};

class Menu extends Component {
  state = {
    isOpen: false
  };

  toggleCollapse = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    // const authuser = isAuthenticated();
    // console.log(authuser);
    const { history } = this.props;
    return (
      <div>
        <MDBNavbar className="nvbr" color="default-color" dark expand="md">
          <MDBNavbarBrand>
            <strong className="white-text">Social</strong>
          </MDBNavbarBrand>
          <MDBNavbarToggler onClick={this.toggleCollapse} />
          <MDBCollapse id="navbarCollapse3" isOpen={this.state.isOpen} navbar>
            <MDBNavbarNav left>
              <MDBNavItem active>
                <MDBNavLink style={isActive(history, "/")} to="/">
                  Home
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink style={isActive(history, "/users")} to="/users">
                  Users
                </MDBNavLink>
              </MDBNavItem>
              <MDBNavItem>
                <MDBNavLink
                  style={isActive(history, `/post/create`)}
                  to={`/post/create`}
                >
                  Create Post
                </MDBNavLink>
              </MDBNavItem>
            </MDBNavbarNav>
            <MDBNavbarNav right>
              {!isAuthenticated() && (
                <>
                  <MDBNavItem>
                    <MDBNavLink
                      className="nav-link"
                      style={isActive(history, "/signin")}
                      to="/signin"
                    >
                      Sign In
                    </MDBNavLink>
                  </MDBNavItem>
                  <MDBNavItem>
                    <MDBNavLink
                      className="nav-link"
                      style={isActive(history, "/signup")}
                      to="/signup"
                    >
                      Sign Up
                    </MDBNavLink>
                  </MDBNavItem>
                </>
              )}

              {isAuthenticated() && isAuthenticated().user.role === "admin" && (
                <MDBNavItem>
                  <MDBNavLink
                    to={`/admin`}
                    style={isActive(history, `/admin`)}
                    className="nav-link"
                  >
                    Admin
                  </MDBNavLink>
                </MDBNavItem>
              )}

              {isAuthenticated() && (
                <>
                  <li className="nav-item">
                    <Link
                      to={`/findpeople`}
                      style={isActive(history, `/findpeople`)}
                      className="nav-link"
                    >
                      Find People
                    </Link>
                  </li>

                  <li className="nav-item">
                    <span
                      className="nav-link"
                      style={
                        (isActive(history, "/signup"),
                        { cursor: "pointer", color: "#fff" })
                      }
                      onClick={() => signout(() => history.push("/"))}
                    >
                      Sign Out
                    </span>
                  </li>

                  <li className="nav-item">
                    <Link
                      to={`/user/${isAuthenticated().user._id}`}
                      style={isActive(
                        history,
                        `/user/${isAuthenticated().user._id}`
                      )}
                      className="nav-link"
                    >
                      {`${isAuthenticated().user.name}'s profile`}
                    </Link>
                  </li>
                </>
              )}
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBNavbar>
      </div>
    );
  }
}

export default withRouter(Menu);
