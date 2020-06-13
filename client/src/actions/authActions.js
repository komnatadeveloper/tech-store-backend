import axios from "axios";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  TOKEN_FAIL,
  APP_INITIALISED,
} from "../actions/types";
import setAuthToken from "../utils/setAuthToken";


// Login User
export const login = (  email, password ) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify( { email, password});

  try {
    const res = await axios.post( '/api/admin-auth/auth', body, config);
    console.log("Client -> authActions -> login response.data ->", res.data);

    dispatch( {
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    localStorage.setItem(
      "token", 
      JSON.stringify(res.data.token)
    );
    setAuthToken(res.data.token)

  } catch (err) {
    const errors = err.response.data.errors;

    if( errors ) {
      console.log('Client -> authActions -> login errors ->', errors)
    }    
    dispatch( {
      type: LOGIN_FAIL
    });    
  }
}  // End of  Login User

// Logout
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};

// Handle Token Fail
export const handleTokenFail = () => (dispatch) => {
  dispatch({ type: TOKEN_FAIL });
};

// Handle App Init
export const handleAppInit = () => (dispatch) => {
  dispatch({ type: APP_INITIALISED });
};