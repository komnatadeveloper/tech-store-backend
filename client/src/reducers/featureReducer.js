import { FEATURE_ADDED, FEATURES_FETCHED, FEATURE_DELETED } from "../actions/types";

const initialState = {
  features: [],
  loading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case FEATURES_FETCHED:
      return {
        ...state,
        features: [...payload],
      };
    case FEATURE_ADDED:
      return {
        ...state,
        features: [...state.features, payload],
      };
    case FEATURE_DELETED:
      return {
        ...state,
        features: [ 
          ...state.features.filter( 
            featureItem => featureItem._id !== payload._id 
          )
        ],
      };


    default:
      return state;
  }
}