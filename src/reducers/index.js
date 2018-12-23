import { combineReducers } from "redux";
import counter from "./counter";
import commonReducer from "./commonReducer";
import userReducer from "./userReducer";
import articleReducer from "./articleReducer";
import customerReducer from "./customerReducer";
import demoReducer from "./demoReducer";
import redpackReducer from "./redpackReducer";

const rootReducer = combineReducers({
  counter,
  commonReducer,
  userReducer,
  articleReducer,
  customerReducer,
  demoReducer,
  redpackReducer
});

export default rootReducer;
