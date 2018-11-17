import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import moment from 'moment'
import ImageView from '../../components/ImageView'
import HeightView from '../../components/HeightView'
import './style.scss'

export default class extends Component {
  static options = {
    addGlobalClass: true
  }
  static defaultProps = {
    item: {}
  }
  constructor(props) {
    super(props);
  }

  render() {
    const {item, line} = this.props
    const color = APP_COLOR_GRAY
    return <View className='bg_white opacity'>
      <HeightView height={20} color='transparent'></HeightView>
      <View className='at-row articleitem '>
        <View className='at-col at-col--wrap'>
          <View className='title'>{item.title}</View>
          <View className='at-row text_black_light desc'>
            <View className='at-col'>阅读 {item.numView}</View>
            <View className='at-col'>收藏 {item.numCollect}</View>
            <View className='at-col'>转发 {item.numForward}</View>
            <View className='at-col'>{moment(item.createdAt).format('YYYY-MM-DD')}</View>
          </View>
        </View>
        <View className='at-col at-col-1 at-col--auto'>
          <ImageView baseclassname='img' src={item.thumbnail}></ImageView>
        </View>
      </View>
      <HeightView height={20} color='transparent'></HeightView>
      {line && <HeightView height={1} color={color}></HeightView>}
    </View>
  }
}