import { SET_SEARCH_RESULTS } from "../actionCreators/searchResultAction";

const initialState = {
  searchResults: [],
};

const searchResultReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload };
    default:
      return state;
  }
};

export default searchResultReducer;
