import axios from "axios";
import { PRODUCT_ADDED } from "./types";




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
    console.log(err)
    console.log(err.response)
    callBack()
  }
}
