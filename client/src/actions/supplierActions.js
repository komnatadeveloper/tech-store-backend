import axios from "axios";
import { SUPPLIER_ADDED } from "./types";
import { handleTokenFail } from "./authActions";

// Add Supplier
export const addSupplier = ({ formData,  callBack }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {

    console.log(
      "Client -> actions -> SupplierActions -> addSupplier FIRED",
    );

    const res = await axios.post(`/api/supplier/supplier`, formData, config);
    console.log('Client -> actions -> SupplierActions -> addSupplier -> response.data ->', res.data);
    dispatch({
      type: SUPPLIER_ADDED,
      payload: res.data.supplier,
    });
    callBack()
  } catch (err) {
    if (err.response.status === 401) {
      console.log(
        "supplierActions -> addSupplier -> err.response.status === 401"
      );
      dispatch(handleTokenFail());
    }
    console.log(err)
    console.log(err.response)
    callBack()
  }
}

// Query Suppliers
export const querySuppliers = ({ search,  callBack }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {

    console.log(
      "Client -> actions -> SupplierActions -> querySuppliers",
    );

    const res = await axios.get(`/api/supplier/query?search=${search}`, null, config);
    console.log('Client -> actions -> SupplierActions -> querySuppliers -> response.data ->', res.data);
    // dispatch({
    //   type: SUPPLIER_ADDED,
    //   payload: res.data.supplier,
    // });
    callBack()
    return res.data;
  } catch (err) {
    if (err.response.status === 401) {
      console.log(
        "supplierActions -> addSupplier -> err.response.status === 401"
      );
      dispatch(handleTokenFail());
    }
    console.log(err)
    console.log(err.response)
    callBack()
  }
}