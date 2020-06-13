import axios from "axios";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  TOKEN_FAIL,
  APP_INITIALISED,
} from "../actions/types";
import setAuthToken from "../utils/setAuthToken";



const initialState = {
  token: localStorage.getItem("token"),
  appInitialised: false,
  isAuthenticated: false,
  loading: true,
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    // case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case LOGOUT:
    case LOGIN_FAIL:
      localStorage.removeItem("token");
      setAuthToken(null);
      return {
        ...state,
        isAuthenticated: false,
      };
    case TOKEN_FAIL:
      console.log('authReducer -> TOKEN_FAIL ->')
      localStorage.removeItem("token");
      setAuthToken(null);
      return {
        ...state,
        isAuthenticated: false,
      };
    case APP_INITIALISED:
      if ( localStorage.token ) {
        console.log("authReducer -> APP_INITIALISED -> localStorage.token exists");        
        return {
          ...state,
          isAuthenticated: true,
          appInitialised: true,
        };
      }
      console.log(
        "authReducer -> APP_INITIALISED -> localStorage.token DOESNT EXIST"
      ); 
      return {
        ...state,
        appInitialised: true,
      };

    default:
      return state;
  }
}
