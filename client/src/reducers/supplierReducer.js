
import {
  SUPPLIER_ADDED
} from "../actions/types";

const initialState = {
  suppliers: [],
  // loading: true,
  // queriedProducts: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SUPPLIER_ADDED:
      return {
        ...state,
        supplier: [...state.suppliers, payload],
      };
    


    default:
      return state;
  }
}
