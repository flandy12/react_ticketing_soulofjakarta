import { combineReducers, createStore } from "redux";

import VotingReducer from "../reducer/reducer";

const rootReducer = combineReducers({
  VotingReducer,
});

const store = createStore(rootReducer);

export default store;