import { combineReducers } from "redux";
// Reducers
import categoryReducer from "./categoryReducer";
import authReducer from "./authReducer";
import productReducer from "./productReducer";
import featureReducer from "./featureReducer";



export default combineReducers({
  categoryReducer,
  authReducer,
  productReducer,
  featureReducer
});
