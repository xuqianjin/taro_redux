import {
  combineReducers
} from 'redux'
import counter from './counter'
import commonReducer from './commonReducer'

const rootReducer = combineReducers({
  counter,
  commonReducer
})

export default rootReducer