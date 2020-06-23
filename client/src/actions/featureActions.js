import axios from "axios";
import { FEATURE_ADDED, FEATURES_FETCHED, FEATURE_DELETED } from "./types";

// Add Feature
export const addFeature = ({ formData, image, callBack }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  try {
    const _formData = new FormData()
    _formData.append('jsonText', JSON.stringify(formData))
    _formData.append("image", image);



    const res = await axios.post(`/api/feature/feature`, _formData, config);
    console.log('Client -> actions -> FeatureActions -> addFeature -> response.data ->', res.data);
    dispatch({
      type: FEATURE_ADDED,
      payload: res.data.feature,
    });
    callBack()
  } catch (err) {
    console.log(err)
    console.log(err.response)
    callBack()
  }
}

// Fetch Features
export const fetchFeatures = ({  callBack }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.get(`/api/feature/feature`, null, config);
    console.log('Client -> actions -> FeatureActions -> fetchFeature -> response.data ->', res.data);
    dispatch({
      type: FEATURES_FETCHED,
      payload: res.data.featuresList,
    });
    callBack()
  } catch (err) {
    console.log(err)
    console.log(err.response)
    callBack()
  }
}

// Delete a Feature
export const deleteFeature = ({ featureId,   callBack }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.delete(`/api/feature/feature/${featureId}`, null, config);
    console.log('Client -> actions -> FeatureActions -> fetchFeature -> response.data ->', res.data);
    dispatch({
      type: FEATURE_DELETED,
      payload: res.data.feature,
    });
    callBack()
  } catch (err) {
    console.log(err)
    console.log(err.response)
    callBack()
  }
}