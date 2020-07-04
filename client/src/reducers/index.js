import { combineReducers } from "redux";
// Reducers
import categoryReducer from "./categoryReducer";
import authReducer from "./authReducer";
import productReducer from "./productReducer";
import featureReducer from "./featureReducer";
import supplierReducer from "./supplierReducer";



export default combineReducers({
  categoryReducer,
  authReducer,
  productReducer,
  featureReducer,
  supplierReducer
});
