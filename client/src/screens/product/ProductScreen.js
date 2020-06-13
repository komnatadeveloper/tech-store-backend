import React from 'react'
import { connect } from "react-redux";
import {Redirect} from 'react-router-dom'

const ProductScreen = ({
  // from state
  appInitialised,
  isAuthenticated,
}) => {
  if( !isAuthenticated && appInitialised ) {
    return  <Redirect to='/' />;
  }
  return <div>Product Screen</div>;
};


const mapStateToProps = (state) => ({
  appInitialised: state.authReducer.appInitialised,
  isAuthenticated: state.authReducer.isAuthenticated,
});

export default connect(mapStateToProps, {
})(ProductScreen);
