import { combineReducers } from "@reduxjs/toolkit";

import formBuilderReducer from "./formBuilderReducer.slice";

const rootReducer = combineReducers({
  formBuilder: formBuilderReducer
});

export default rootReducer;
