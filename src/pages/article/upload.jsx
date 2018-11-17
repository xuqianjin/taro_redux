import Taro, {Component} from '@tarojs/taro'
import {connect} from '@tarojs/redux'
import {bindActionCreators} from 'redux'
import {View} from '@tarojs/components'
import {AtTextarea, AtButton, AtMessage, AtTag} from 'taro-ui'

import BaseView from '../../components/BaseView'
import HeightView from '../../components/HeightView'
import {articleTag} from '../../components/Constant'

import './style.scss'

import {postSysArticle} from '../../reducers/articleReducer'

const mapStateToProps = (state) => {
  return {articleReducer: state.articleReducer}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    postSysArticle
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {
  static defaultProps = {}
  config = {
    navigationBarTitleText: '上传文章'
  }
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      tags: []
    }
  }
  handleTagClick = (value) => {
    const {name, active} = value
    const {tags} = this.state
    if (tags.includes(Number(name)) && active) {
      tags.splice(tags.indexOf(Number(name)), 1);
    } else {
      tags.push(Number(name))
    }
    this.setState({tags})
  }
  handleChange = (value) => {
    const {detail} = value
    this.setState({url: detail.value})
  }
  handleCancel = () => {
    Taro.navigateBack()
  }
  handleSubmit = () => {
    const urltest = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/
    const {url, tags} = this.state
    if (!urltest.test(url)) {
      Taro.atMessage({'message': '请输入正确网址', 'type': 'error'})
      return
    }
    if (tags.length == 0) {
      Taro.atMessage({'message': '请输入文章标签', 'type': 'error'})
      return
    }
    Taro.showLoading()
    this.props.postSysArticle({originUrl: url, tags}).then(res => {
      Taro.hideLoading()
      this.handleCancel()
    }).catch(err => {
      Taro.atMessage({'message': '上传失败,请检查链接是否正确', 'type': 'error'})
      Taro.hideLoading()
    })
  }
  render() {
    const {tags} = this.state
    return <BaseView baseclassname='bg_white'>
      <AtMessage></AtMessage>
      <View className='content'>
        <HeightView height={20} color='transparent'></HeightView>
        <View className='tips'>
          粘贴原文链接
        </View>
        <HeightView height={20} color='transparent'></HeightView>
        <AtTextarea height='200' placeholder='请将已复制的微信文章链接,粘贴到此处' onChange={this.handleChange}></AtTextarea>
        <HeightView height={50} color='transparent'></HeightView>
        <View>
          <View style='font-size:15px'>选择文章标签</View>
          <HeightView height={20} color='transparent'></HeightView>
          {
            articleTag.map(tag => {
              return <AtTag active={tags.includes(tag.value)} key={tag.value} name={'' + tag.value} type='primary' circle={true} onClick={this.handleTagClick}>{tag.name}</AtTag>
            })
          }
        </View>
        <HeightView height={50} color='transparent'></HeightView>
        <View className='at-row'>
          <View className='at-col'>
            <AtButton type='secondary' size='normal' onClick={this.handleCancel}>取消</AtButton>
          </View>
          <View className='at-col at-col-1 at-col--auto'></View>
          <View className='at-col'>
            <AtButton type='primary' size='normal' onClick={this.handleSubmit}>生成我的文章</AtButton>
          </View>
        </View>
        <HeightView height={50} color='transparent'></HeightView>
        <View className='title text_black_light text_center'>上传说明</View>
        <HeightView height={20} color='transparent'></HeightView>
        <View className='seq text_black_light'>1.上传文章请先征得原创作者的授权;</View>
        <View className='seq text_black_light'>2.为维护原作者版权,如原作者追诉版权,我们将下线用户生成文章;</View>
        <View className='seq text_black_light'>3.我们仅提供名片文章生成工具与共享内容平台,用户所上传文章法律责任由上传者自负;</View>
      </View>
    </BaseView>
  }
}