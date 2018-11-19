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
import ShareDialog from '../../components/ShareDialog'

import {gender, careerKind} from '../../components/Constant'

import {getUserCarte} from '../../reducers/userReducer'

import './edit'

import './style.scss'

const mapStateToProps = (state) => {
  return {userReducer: state.userReducer, commonReducer: state.commonReducer}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getUserCarte
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {

  static defaultProps = {}
  config = {
    navigationBarTitleText: '我的名片'
  }
  constructor(props) {
    super(props);
    this.state = {
      showshare: false
    }
  }
  componentWillMount() {}
  onShareAppMessage() {
    const {usercarte} = this.props.userReducer
    return {title: usercarte.name}
  }
  getCareerName = (value) => {
    if (!value) {
      return null
    }
    careerKind.find(item => item.value == value).name
  }
  handleEdit = () => {
    Taro.navigateTo({url: '/pages/userinfo/edit'})
  }
  handleShareShow = () => {
    this.setState({showshare: true})
  }
  handleShareClose = () => {
    this.setState({showshare: false})
  }
  render() {
    const {showshare} = this.state
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
            {usercarte.corp || '公司未填写'}
            | {usercarte.office || '职位未填写'}</View>
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
          <AtButton type='primary' size='small' onClick={this.handleShareShow}>
            <AtIcon value='share-2' size={15}></AtIcon>分享好友
          </AtButton>
        </View>
      </View>
      <HeightView height={20} color='transparent'></HeightView>
      <View className='paneltitle bg_white'>基本信息</View>
      <AtList>
        <AtListItem title='姓名' extraText={usercarte.name}/>
        <AtListItem title='手机' extraText={usercarte.contactPhonenum}/>
        <AtListItem title='身份' extraText={this.getCareerName(usercarte.careerKind)}/>
        <AtListItem title='公司' extraText={usercarte.corp}/>
        <AtListItem title='职位' extraText={usercarte.office}/>
      </AtList>

      <HeightView height={20} color='transparent'></HeightView>
      <View className='paneltitle bg_white'>个人简介</View>
      <HeightView height={1} color='#d6e4ef'></HeightView>
      <View className='userdesc bg_white'>{usercarte.desc}</View>

      <HeightView height={100} color='transparent'></HeightView>
      <ShareDialog isOpened={showshare} onClose={this.handleShareClose}></ShareDialog>
    </BaseView>
  }
}