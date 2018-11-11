import {
  combineReducers
} from 'redux'
import counter from '../redux/counter'
import commonReducer from '../redux/commonReducer'

const rootReducer = combineReducers({
  counter,
  commonReducer
})

export default rootReducer