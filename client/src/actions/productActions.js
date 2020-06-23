import axios from "axios";
import { PRODUCT_ADDED, QUERIED_PRODUCTS_FETCHED, PRODUCT_DELETED } from "./types";
import { handleTokenFail } from "./authActions";

// Get BrandList of Products of Related Category
export const getFilterListOfCategory = ({
  categoryId
}) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.get(`/api/product/product?categoryId=${categoryId}&brandList=1&onlyFilterList=1`, null, config);
    console.log('productActions -> getFilterListOfCategory -> res.data ->', res.data)
    return {
      brandList: res.data.brandList
    }
  } catch (err) {
    console.log(err)
    console.log(err.response)
    if (err.response.status === 401) {
      console.log(
        "categoryActions -> getCategories -> err.response.status === 401"
      );
      dispatch(handleTokenFail());
    }
  }

}



// Add Product
export const addProduct = ({formData, imageList, callBack}) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  try {
    const _formData = new FormData()
    _formData.append('jsonText', JSON.stringify(formData))  
    imageList.forEach(fileItem => {

      _formData.append("images[]", fileItem);
    })
    console.log(
      "Client -> actions -> ProductActions -> addProduct -> imageList ->",
      imageList
    );
    console.log(
      "Client -> actions -> ProductActions -> addProduct -> _formData ->",
      _formData
    );
    const res = await axios.post(`/api/product/product`, _formData, config);
    console.log('Client -> actions -> ProductActions -> addProduct -> response.data ->', res.data );
   dispatch({
     type: PRODUCT_ADDED,
     payload: res.data,
   });
   callBack()
  } catch (err) {
    if (err.response.status === 401) {
      console.log(
        "categoryActions -> getCategories -> err.response.status === 401"
      );
      dispatch(handleTokenFail());
    }
    console.log(err)
    console.log(err.response)
    callBack()
  }
}




export const deleteProduct = ({ productId }) => async dispatch => {
  console.log(
    "Client -> actions -> ProductActions -> deleteProduct -> productId ->",
    productId
  );
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.delete(`/api/product/product/${productId}`, null, config);
    console.log('productActions -> deleteProduct -> res.data ->', res.data);
    dispatch({
      type: PRODUCT_DELETED,
      payload: res.data.product,
    });

  } catch (err) {
    console.log(err)
    console.log(err.response)
    if (err.response.status === 401) {
      console.log(
        "categoryActions -> getCategories -> err.response.status === 401"
      );
      dispatch(handleTokenFail());
    }
  }
}




export const queryProducts = ({ search }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    if(search === '') {
      dispatch({
        type: QUERIED_PRODUCTS_FETCHED,
        payload: [],
      });
      return;
    }
    const res = await axios.post(`/api/product/query?search=${search}`, null, config);
    console.log('productActions -> queryProducts -> res.data ->', res.data);
    dispatch({
      type: QUERIED_PRODUCTS_FETCHED,
      payload: res.data.productList,
    });
    
  } catch (err) {
    console.log(err)
    console.log(err.response)
    if (err.response.status === 401) {
      console.log(
        "categoryActions -> getCategories -> err.response.status === 401"
      );
      dispatch(handleTokenFail());
    }
  }
}
