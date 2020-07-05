import axios from "axios";
import { handleTokenFail } from "./authActions";


// Add Order
export const addOrder = ({ formData, callBack }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    console.log(
      "Client -> actions -> orderActions -> addOrder -> formData ->", formData
    );

    const res = await axios.post(`/api/order/order`, formData, config);
    console.log('Client -> actions -> orderActions -> addOrder -> response.data ->', res.data);
    // dispatch({
    //   type: SUPPLIER_ADDED,
    //   payload: res.data.supplier,
    // });
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