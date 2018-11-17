import {
  combineReducers
} from 'redux'
import counter from './counter'
import commonReducer from './commonReducer'
import userReducer from './userReducer'
import articleReducer from './articleReducer'

const rootReducer = combineReducers({
  counter,
  commonReducer,
  userReducer,
  articleReducer
})

export default rootReducer