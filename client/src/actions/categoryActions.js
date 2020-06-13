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


// Add Category
export const addCategory = ({formData}) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.post(`/api/category/`, formData, config);
    console.log('Client -> actions -> CategoryActions -> addCategory -> response.data ->', res.data );
   dispatch({
     type: CATEGORY_ADDED,
     payload: res.data.category,
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