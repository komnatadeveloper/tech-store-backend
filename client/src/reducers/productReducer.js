import { PRODUCT_ADDED } from "../actions/types";

const initialState = {
  products: [],
  loading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case PRODUCT_ADDED:
      return {
        ...state,
        products: [...state.products, payload],
      };


    default:
      return state;
  }
}
