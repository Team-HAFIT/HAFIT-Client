import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";

import { composeWithDevTools } from "@redux-devtools/extension";
import tokenReducer from "./Auth";

const reducers = combineReducers({
  authToken: tokenReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authToken"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
}, composeWithDevTools());
