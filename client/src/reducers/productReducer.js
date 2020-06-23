import { 
  PRODUCT_ADDED,
  PRODUCT_DELETED,
  QUERIED_PRODUCTS_FETCHED
} from "../actions/types";

const initialState = {
  products: [],
  loading: true,
  queriedProducts: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case PRODUCT_ADDED:
      return {
        ...state,
        products: [...state.products, payload],
      };
    case PRODUCT_DELETED:
      return {
        ...state,
        products: [
          ...state.products.filter( 
            productItem => productItem._id !== payload._id
          )
        ],
        queriedProducts: [
          ...state.queriedProducts.filter(
            productItem => productItem._id !== payload._id
          )
        ]
      };
    case QUERIED_PRODUCTS_FETCHED:
      return {
        ...state,
        queriedProducts: [...payload],
      };


    default:
      return state;
  }
}
