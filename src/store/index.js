import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./counter";
import tasksReducer from "./tasks";
import devicesReducer from "./devices";
import modelsReducer from "./models";
import applicationsReducer from "./applications";
import sourcesReducer from "./sources";
import areasReducer from "./areas";




const store = configureStore({
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
  reducer: { 
    counter: counterReducer, 
    tasks:tasksReducer,
    devices:devicesReducer,
    models:modelsReducer,
    applications:applicationsReducer,
    sources:sourcesReducer,
    areas:areasReducer,
  }
});

export default store;