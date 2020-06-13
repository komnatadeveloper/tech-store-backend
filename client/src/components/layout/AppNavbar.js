import React from "react";
import { connect } from "react-redux";
import { logout } from '../../actions/authActions'
import {   withRouter } from "react-router-dom";
import {
  Navbar,
  Nav,
} from "react-bootstrap";

const AppNavbar = ({history, location,  isAuthenticated, appInitialised, logout }) => {
  console.log("AppNavbar -> isAuthenticated ->", isAuthenticated);
  console.log("AppNavbar -> location.pathname ->", location.pathname);
  return (
    <Navbar bg='light' expand='lg' className='sticky-top'>
      <Navbar.Brand href='/'>React-Bootstrap</Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav'>
        <Nav className='mr-auto'>
          {
            (isAuthenticated && appInitialised) && (
              <>
                <Nav.Link href='/category'>Categories</Nav.Link>
                <Nav.Link href='/product'>Products</Nav.Link>
                <Nav.Link href='/add-product'>Add Product</Nav.Link>
                <Nav.Link
                  onClick={() => {
                    logout();
                    history.push("/");
                  }}
                >
                  Logout
                </Nav.Link>
              </>
            )
          }          
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.authReducer.isAuthenticated,
  appInitialised: state.authReducer.appInitialised,
});


export default connect(mapStateToProps, { logout })(withRouter(AppNavbar));
