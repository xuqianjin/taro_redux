import Taro, {Component} from '@tarojs/taro'
import {connect} from '@tarojs/redux'
import {bindActionCreators} from 'redux'

import {View} from '@tarojs/components'
import {
  AtButton,
  AtInput,
  AtForm,
  Picker,
  AtTextarea,
  AtIcon,
  AtList,
  AtListItem
} from 'taro-ui'
import HeightView from '../../components/HeightView'
import BaseView from '../../components/BaseView'
import ImageView from '../../components/ImageView'
import {gender, careerKind} from '../../components/Constant'

import {getUserCarte} from '../../reducers/userReducer'

import './edit'

import './style.scss'

const mapStateToProps = (state) => {
  return {userReducer: state.userReducer}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getUserCarte
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {

  static defaultProps = {
    height: 1,
    color: APP_COLOR_GRAY
  }
  config = {
    navigationBarTitleText: '我的名片'
  }
  constructor(props) {
    super(props);
  }
  componentWillMount() {}
  handleEdit = () => {
    Taro.navigateTo({url: '/pages/userinfo/edit'})
  }
  render() {
    const {usercarte} = this.props.userReducer
    let condition = false
    if (usercarte) {} else {
      condition = {
        state: 'viewLoading'
      }
    }
    return <BaseView baseclassname='' condition={condition}>
      <HeightView height={20} color='transparent'></HeightView>
      <View className='headderbox'>
        <ImageView baseclassname='headerimg' src={usercarte.avatarUrl}></ImageView>
        <View className='infotag bg_theme_opacity'>
          <View className='title'>{usercarte.name}</View>
          <View className='desc'>
            {usercarte.corp}
            | {usercarte.office}</View>
        </View>
        <View className='edittag opacity' onClick={this.handleEdit}>
          <AtIcon value='edit' size={15}></AtIcon>
          编辑名片
        </View>
      </View>
      <View className='at-row headerboxbottom shadow text_center bg_white'>
        <View className='at-col text_black_light'>
          <AtIcon value='eye' size={20}></AtIcon>人气 {usercarte.numView}
        </View>
        <View className='at-col text_black_light'>
          <AtIcon value='heart' size={18}></AtIcon>收藏 {usercarte.numCollect}
        </View>
        <View className='at-col'>
          <AtButton type='primary' size='small'>
            <AtIcon value='share-2' size={15}></AtIcon>分享好友
          </AtButton>
        </View>
      </View>
      <HeightView height={20} color='transparent'></HeightView>
      <View className='paneltitle bg_white'>基本信息</View>
      <AtList>
        <AtListItem title='我的姓名' extraText={usercarte.name}/>
        <AtListItem title='联系方式' extraText={usercarte.contactPhonenum}/>
      </AtList>

      <HeightView height={20} color='transparent'></HeightView>
      <View className='paneltitle bg_white'>个人简介</View>
      <HeightView height={1} color='#d6e4ef'></HeightView>
      <View className='userdesc bg_white'>{usercarte.desc}</View>

      <HeightView height={20} color='transparent'></HeightView>
      <View className='paneltitle bg_white'>我的档案</View>
      <AtList>
        <AtListItem title='所属公司' extraText={usercarte.corp}/>
        <AtListItem title='公司职位' extraText={usercarte.office}/>
        <AtListItem title='所属工种' extraText={usercarte && careerKind.find(item => item.value == usercarte.careerKind).name}/>
      </AtList>
      <HeightView height={100} color='transparent'></HeightView>
    </BaseView>
  }
}