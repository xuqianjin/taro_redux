import Taro, {Component} from '@tarojs/taro'
import {connect} from '@tarojs/redux'
import {bindActionCreators} from 'redux'
import {View, ScrollView} from '@tarojs/components'
import {AtTabBar, AtTabs, AtTabsPane, AtLoadMore, AtIcon} from 'taro-ui'

import ArticleItem from './ArticleItem'
import HeightView from '../../components/HeightView'
import {getSysArticle, getUserArticleCreate, getUserArticleForward, getUserArticleCollect} from '../../reducers/articleReducer'
import {getTags} from '../../reducers/commonReducer'

import './style.scss'

const mapStateToProps = (state) => {
  return {articleReducer: state.articleReducer, commonReducer: state.commonReducer}
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    getUserArticleCreate,
    getUserArticleForward,
    getUserArticleCollect,
    getSysArticle,
    getTags
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
      current: 0,
      choosetag: -1,
      chooseuser: 1,
      userarticle: '',
      articleTag:[]
    }
  }
  componentWillMount() {
    this.props.getTags({kind:2}).then(res => {
      this.setState({articleTag: res.value})
    })
    this.props.getSysArticle()
    this.props.getUserArticleCreate().then(res => {
      this.setState({userarticle: res.value})
    })
  }
  handleChangeTab = (value) => {
    this.setState({current: value})
  }
  handleTagClick = (id) => {
    const {choosetag} = this.state
    if (id == choosetag) {
      this.setState({choosetag: -1})
    } else {
      this.setState({choosetag: id})
    }
  }
  handleUserClick = (value) => {
    const {chooseuser} = this.state
    if (value == chooseuser) {} else {
      this.setState({chooseuser: value})
      switch (value) {
        case 1:
          this.props.getUserArticleCreate().then(res => {
            this.setState({userarticle: res.value})
          })
          break;
        case 2:
          this.props.getUserArticleCollect().then(res => {
            this.setState({userarticle: res.value})
          })
          break;
        case 3:
          this.props.getUserArticleForward().then(res => {
            this.setState({userarticle: res.value})
          })
          break;
        default:
      }
    }
  }
  handUpload = () => {
    Taro.navigateTo({url: '/pages/article/upload'})
  }
  render() {
    const {choosetag, chooseuser, userarticle,articleTag} = this.state
    const {deviceinfo} = this.props.commonReducer
    const tabList = [
      {
        title: '全部文章'
      }, {
        title: '我的文章'
      }
    ]
    const usertag = [
      {
        name: '我的上传',
        value: 1
      }, {
        name: '我的收藏',
        value: 2
      }, {
        name: '我的转发',
        value: 3
      }
    ]

    const scrollheight = Taro.pxTransform(deviceinfo.windowHeight * 750 / deviceinfo.windowWidth - 160)
    return (<View>
      <AtTabs className='attabs' current={this.state.current} tabList={tabList} onClick={this.handleChangeTab.bind(this)}>
        <AtTabsPane current={this.state.current} index={0}>
          <View className='at-row bg_white fixtag'>
            {
              articleTag.map(tag => {
                let color = tag.id == choosetag
                  ? 'text_black'
                  : 'text_black_light'
                return <View className={`at-col text_center ${color}`} key={tag.id} onClick={this.handleTagClick.bind(this, tag.id)}>{tag.name}</View>
              })
            }
          </View>
          <ScrollView scrollY={true} style={`height:${scrollheight}`}>
            <HeightView height={10}></HeightView>
            {
              userarticle && userarticle.map((item, index) => {
                return <ArticleItem key={item.id} item={item} line={index < userarticle.length - 1}></ArticleItem>
              })
            }
            <AtLoadMore status={'noMore'}></AtLoadMore>
          </ScrollView>
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={1}>
          <View className='at-row bg_white fixtag'>
            {
              usertag.map(tag => {
                let color = tag.value == chooseuser
                  ? 'text_black'
                  : 'text_black_light'
                return <View className={`at-col text_center ${color}`} key={tag.value} onClick={this.handleUserClick.bind(this, tag.value)}>{tag.name}</View>
              })
            }
          </View>
          <ScrollView scrollY={true} style={`height:${scrollheight}`}>
            <HeightView height={10}></HeightView>
            {
              userarticle && userarticle.map((item, index) => {
                return <ArticleItem key={item.id} item={item} line={index < userarticle.length - 1}></ArticleItem>
              })
            }
            <AtLoadMore status={'noMore'}></AtLoadMore>
          </ScrollView>
        </AtTabsPane>
      </AtTabs>
      <View className='fix bg_theme opacity' onClick={this.handUpload}>
        <AtIcon value='share-2' size={18}></AtIcon>
        <HeightView height={5} color='transparent'></HeightView>
        <Text>
          上传文章
        </Text>
      </View>
    </View>)
  }
}