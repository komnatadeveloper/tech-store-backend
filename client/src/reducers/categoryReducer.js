import { CATEGORIES_FETCHED, QUERIED_CATEGORIES_FETCHED, CLEAR_QUERIED_CATEGORIES, CATEGORY_ADDED } from "../actions/types";

const initialState = {
  categories: [],
  queriedCategories: [],
  loading: true
}


export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CATEGORIES_FETCHED:
      return {
        ...state,
        categories: [...payload],
      };
    case QUERIED_CATEGORIES_FETCHED:
      return {
        ...state,
        queriedCategories: [...payload],
      };
    case CLEAR_QUERIED_CATEGORIES:
      return {
        ...state,
        queriedCategories: [],
      };
    case CATEGORY_ADDED:
      return {
        ...state,
        categories: [...state.categories, payload],
      };

    default:
      return state;
  }
}