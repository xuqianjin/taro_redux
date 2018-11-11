import Taro, {Component} from '@tarojs/taro'
import {View, Text, ScrollView, Image} from '@tarojs/components'

import {AtList, AtListItem, AtTabsPane} from 'taro-ui'
const testimage = require('../static/image/test.jpg')
const userheader = 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
export default class extends Component {
  static options = {
    addGlobalClass: true
  }
  static defaultProps = {
    deviceinfo: {}
  }
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  componentDidUpdate() {}
  componentWillUnmount() {}

  render() {
    const userCard = <AtList>
      <AtListItem title='标题文字' arrow='right' thumb={userheader}></AtListItem>
    </AtList>
    const image = <View>
      <Image src={testimage}></Image>
    </View>

    return (<ScrollView scrollY={true} style='display:flex;flex-direction:column;'>
      <View className='at-row'>
        <View className='at-col'>A</View>
        <View className='at-col'>B</View>
        <View className='at-col'>C</View>
      </View>
      <View className='at-row'>
        <View className='at-col'>A</View>
        <View className='at-col'>B</View>
        <View className='at-col'>C</View>
      </View>
      <View className='at-row'>
        <View className='at-col'>A</View>
        <View className='at-col'>B</View>
        <View className='at-col'>C</View>
      </View>
      {image}
      {image}
      {image}
      {image}
      {image}
      {image}
      {image}
      {image}
      {image}
    </ScrollView>)
  }

}