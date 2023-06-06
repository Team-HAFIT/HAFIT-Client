import { configureStore } from "@reduxjs/toolkit";
import { composeWithDevTools } from "@redux-devtools/extension";
import tokenReducer from "./Auth";

export default configureStore({
  reducer: {
    authToken: tokenReducer,
  },
}, composeWithDevTools());
