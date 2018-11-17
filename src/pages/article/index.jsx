import Taro, {Component} from '@tarojs/taro'
import {connect} from '@tarojs/redux'
import {bindActionCreators} from 'redux'
import {View} from '@tarojs/components'
import {AtTabBar, AtTabs, AtTabsPane, AtLoadMore, AtIcon} from 'taro-ui'

import ArticleItem from './ArticleItem'
import HeightView from '../../components/HeightView'
import {getSysArticle, getUserArticleCreate} from '../../reducers/articleReducer'

import './style.scss'

const mapStateToProps = (state) => {
  return {articleReducer: state.articleReducer}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getUserArticleCreate,
    getSysArticle
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class extends Component {

  static defaultProps = {}
  config = {
    navigationBarTitleText: '获客文章'
  }
  constructor(props) {
    super(props);
    this.state = {
      current: 0
    }
  }
  componentWillMount() {
    this.props.getSysArticle()
    this.props.getUserArticleCreate()
  }
  handleChangeTab(value) {
    this.setState({current: value})
  }
  handUpload = () => {
    Taro.navigateTo({url: '/pages/article/upload'})
  }
  render() {
    const {userarticle} = this.props.articleReducer
    const tabList = [
      {
        title: '全部文章'
      }, {
        title: '我的文章'
      }
    ]
    return (<View>
      <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleChangeTab.bind(this)}>
        <AtTabsPane current={this.state.current} index={0}>
          <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页一的内容</View>
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={1}>
          {
            userarticle && userarticle.map((item, index) => {
              return <ArticleItem key={item.id} item={item} line={index < userarticle.length - 1}></ArticleItem>
            })
          }
          <AtLoadMore status={'noMore'}></AtLoadMore>
        </AtTabsPane>
      </AtTabs>
      <View className='fix bg_theme shadow opacity' onClick={this.handUpload}>
        <AtIcon value='share-2' size={18}></AtIcon>
        <HeightView height={5} color='transparent'></HeightView>
        <Text>
          上传文章
        </Text>
      </View>
    </View>)
  }
}