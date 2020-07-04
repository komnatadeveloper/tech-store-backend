import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import AppNavbar from './components/layout/AppNavbar';
// Set Auth Token
import setAuthToken from "./utils/setAuthToken";
// Init App
import {handleAppInit} from './actions/authActions'
// Screens
import {
  LoginScreen,
  CategoryScreen,
  ProductScreen,
  AddProductScreen,
  NotFound,
  FeaturedScreen,
  AddSupplierScreen,
  AddIncomingInvoiceScreen,
} from './screens'

// Redux
import { Provider } from "react-redux";
import store from "./store";

// Git Test

// if (localStorage.token) {
//   setAuthToken(
//     JSON.parse(localStorage.token)
//   );
// }


function App() {
  if (localStorage.token) {
    setAuthToken(JSON.parse(localStorage.token));
  }
  useEffect( () => {
    store.dispatch(handleAppInit())
  }, [])
  return (
    <Provider store={store}>
      <Router>
        <AppNavbar />
        <Switch>
          <Route exact path='/' component={LoginScreen} />
          <Route exact path='/category' component={CategoryScreen} />
          <Route exact path='/product' component={ProductScreen} />
          <Route exact path='/add-product' component={AddProductScreen} />
          <Route exact path='/featured' component={FeaturedScreen} />
          <Route exact path='/add-supplier' component={AddSupplierScreen} />
          <Route exact path='/add-incoming-invoice' component={AddIncomingInvoiceScreen} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
