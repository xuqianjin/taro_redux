import Taro, {Component} from '@tarojs/taro'
import {View, Text, ScrollView} from '@tarojs/components'
import {AtList, AtListItem, AtIcon} from 'taro-ui'

import ImageView from '../components/ImageView'
import HeightView from '../components/HeightView'
import './style.scss'

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
  getUserList = () => {
    return [
      {
        icon: 'sketch',
        title: 'VIP会员',
        extra: '1天1块钱'
      }, {
        icon: 'share',
        title: '邀请好友',
        extra: '享VIP折扣'
      }, {
        icon: 'help',
        title: '使用攻略',
        extra: '玩转小多机器人'
      }
    ]
  }
  getSysList = () => {
    return [
      {
        icon: 'phone',
        title: '联系我们'
      }
    ]
  }
  render() {
    const userCard = <View className='at-row bg_white home_card_container shadow opacity'>
      <View className='at-col at-col-1 at-col--auto'>
        <ImageView baseclassname='icon' src={userheader}></ImageView>
      </View>
      <View className='at-col'>
        <View className='title'>用户姓名</View>
        <View className='desc text_black_light'>职位未填写 | 公司未填写</View>
      </View>
      <View className='at-col at-col-1 at-col--auto right text_theme'>
        <Text>编辑</Text>
        <AtIcon value='chevron-right' size='15'></AtIcon>
      </View>
    </View>

    const list1data = this.getUserList()
    const list1 = list1data.map((item, index) => {
      return <View key={index}>
        <View className='at-row user_list_item bg_white opacity'>
          <View className='at-col at-col-1 at-col--auto icon'>
            <AtIcon value={item.icon} className='text_theme'></AtIcon>
          </View>
          <View className='at-col at-col-1 at-col--auto'>
            <View className='title'>{item.title}</View>
          </View>
          <View className='at-col right text_black_light text_right'>
            <Text>{item.extra}</Text>
            <AtIcon value='chevron-right' size='15'></AtIcon>
          </View>
        </View>
        {index < list1data.length - 1 && <HeightView height={2} color='transparent'></HeightView>}
      </View>
    })
    const list2data = this.getSysList()
    const list2 = list2data.map((item, index) => {
      return <View key={index}>
        <View className='at-row user_list_item bg_white opacity'>
          <View className='at-col at-col-1 at-col--auto icon'>
            <AtIcon value={item.icon} className='text_theme'></AtIcon>
          </View>
          <View className='at-col at-col-1 at-col--auto'>
            <View className='title'>{item.title}</View>
          </View>
          <View className='at-col right text_black_light text_right'>
            <Text>{item.extra}</Text>
            <AtIcon value='chevron-right' size='15'></AtIcon>
          </View>
        </View>
        {index < list1data.length - 1 && <HeightView height={2} color='transparent'></HeightView>}
      </View>
    })
    return (<ScrollView scrollY={true}>
      <HeightView height={20} color='transparent'></HeightView>
      {userCard}
      <HeightView height={80} color='transparent'></HeightView>
      {list1}
      <HeightView height={50} color='transparent'></HeightView>
      {list2}
    </ScrollView>)
  }

}