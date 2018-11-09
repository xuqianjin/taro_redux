import Taro, {Component} from '@tarojs/taro'
import {View, Button, Text, Input} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import {bindActionCreators} from 'redux'

import {add, minus, asyncAdd} from '../redux/counter'

const mapStateToProps = (state) => {
  return {counter: state.counter}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    add,
    minus,
    asyncAdd
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)

class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps)
  }
  handleClick = (type) => {
    console.log(type);
    this.props.minus('bbb')
  }
  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    let {num} = this.props.counter
    return (<View className='index'>
      <Input type='file'></Input>
      <View>
        <Button onClick={this.props.add}>+</Button>
        <Text>{num}</Text>
        <Text>Hello,sss aa</Text>
        <Button onClick={this.handleClick.bind(this, 123)}>-</Button>
        <Button onClick={this.props.asyncAdd}>asyncAdd</Button>
      </View>
    </View>)
  }
}

export default Index
