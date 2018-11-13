import {
  combineReducers
} from 'redux'
import counter from './counter'
import commonReducer from './commonReducer'
import userReducer from './userReducer'

const rootReducer = combineReducers({
  counter,
  commonReducer,
  userReducer
})

export default rootReducer