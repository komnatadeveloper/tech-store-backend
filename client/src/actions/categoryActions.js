import axios from "axios";
import {
  CATEGORIES_FETCHED,
  CATEGORY_ADDED,
  QUERIED_CATEGORIES_FETCHED,
  CLEAR_QUERIED_CATEGORIES,
} from "./types";
import { handleTokenFail } from "./authActions";


// Get Categories
export const getCategories = () => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.get(`/api/category/`);
    console.log('Client -> actions -> CategoryActions -> getCategories -> response.data ->', res.data )
    dispatch({
      type: CATEGORIES_FETCHED,
      payload: res.data,
    });
  } catch (err) {
    console.log(err)
    console.log(err.response.status)
    if(err.response.status === 401) {
      console.log(
        "categoryActions -> getCategories -> err.response.status === 401"
      );
      dispatch(handleTokenFail());
    }
  }
}  // End of  Get Categories

// Query Categories
export const queryCategories = (searched) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (searched && !searched.isEmpty  ) {
      const res = await axios.get(
        `/api/category/query?searched=${searched}`,
        config
      );
      dispatch({
        type: QUERIED_CATEGORIES_FETCHED,
        payload: res.data,
      });
    } else {
      dispatch({
        type: CLEAR_QUERIED_CATEGORIES,
      });
    }
  } catch (err) {
    console.log(err);
    console.log(err.response);
    if (err.response.status === 401) {
      console.log(
        "categoryActions -> getCategories -> err.response.status === 401"
      );
      dispatch(handleTokenFail());
    }
  }
};

// Query Only Special Categories
export const querySpecialCategories = (searched) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    if (searched && searched !== ''  ) {
      const res = await axios.get(
        `/api/category/query?searched=${searched}&showOnlySpecial=true`,
        config
      );
      return res.data;
    } else {
      return [];
    }
  } catch (err) {
    console.log(err);
    console.log(err.response);
    if (err.response.status === 401) {
      console.log(
        "categoryActions -> getCategories -> err.response.status === 401"
      );
      dispatch(handleTokenFail());
    }
  }
};


// Add Category
export const addCategory = ({formData, image, cb}) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  try {
    const _formData = new FormData()
    if(image) {
      _formData.append("image", image);
    }
    _formData.append('jsonText', JSON.stringify(formData)) 
    const res = await axios.post(`/api/category/`, _formData, config);
    console.log('Client -> actions -> CategoryActions -> addCategory -> response.data ->', res.data );
   dispatch({
     type: CATEGORY_ADDED,
     payload: res.data.category,
   });
   cb()
  } catch (err) {
    console.log(err)
    console.log(err.response)
    cb()
    if (err.response.status === 401) {
      console.log(
        "categoryActions -> getCategories -> err.response.status === 401"
      );
      dispatch(handleTokenFail());
    }
  }
}