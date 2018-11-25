import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import { View } from "@tarojs/components";
import {
  AtButton,
  AtInput,
  AtForm,
  Picker,
  AtTextarea,
  AtIcon,
  AtList,
  AtListItem,
  AtLoadMore
} from "taro-ui";
import HeightView from "../../components/HeightView";
import BaseView from "../../components/BaseView";
import ImageView from "../../components/ImageView";
import ShareDialog from "../../components/ShareDialog";

import ArticleItem from "../article/ArticleItem";

import { gender, careerKind } from "../../components/Constant";

import { getUserCarte, getUserCarteDesc } from "../../reducers/userReducer";

import "./edit";

import "./style.scss";

const mapStateToProps = state => {
  return { userReducer: state.userReducer, commonReducer: state.commonReducer };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getUserCarte,
      getUserCarteDesc
    },
    dispatch
  );
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  static defaultProps = {};
  config = {
    navigationBarTitleText: "我的名片"
  };
  constructor(props) {
    super(props);
    this.state = {
      showshare: false,
      timebegin: ""
    };
  }
  componentWillMount() {
    this.setState({ timebegin: new Date().getTime() });
  }
  componentDidMount() {
    const params = this.$router.params;
    this.props.getUserCarte(params.userId);
    this.props.getUserCarteDesc(params.userId);
  }
  onShareAppMessage() {
    const { usercarte } = this.props.userReducer;
    var pages = Taro.getCurrentPages(); //获取加载的页面
    var currentPage = pages[pages.length - 1]; //获取当前页面的对象
    var url = currentPage.route; //当前页面url
    return {
      title: usercarte.name,
      path: `/pages/index?path=${url}&id=${usercarte.id}`
    };
  }
  getCareerName = value => {
    if (!value) {
      return null;
    }
    return careerKind.find(item => item.value === value).name;
  };
  handleEdit = () => {
    Taro.navigateTo({ url: "/pages/userinfo/edit" });
  };
  handleEditMine = () => {
    Taro.redirectTo({ url: "/pages/userinfo/edit" });
  };
  handleShareShow = () => {
    this.setState({ showshare: true });
  };
  handleShareClose = () => {
    this.setState({ showshare: false });
  };
  render() {
    const params = this.$router.params;
    const { showshare } = this.state;
    const { usercarte, usercartedesc, userinfo } = this.props.userReducer;
    const isme = params.userId == userinfo.userId;
    let condition = false;
    if (usercartedesc) {
    } else {
      condition = {
        state: "viewLoading"
      };
    }
    return (
      <BaseView baseclassname="" condition={condition}>
        <HeightView height={20} color="transparent" />
        <View className="headderbox">
          <ImageView baseclassname="headerimg" src={usercarte.avatarUrl} />
          <View className="infotag bg_theme_opacity">
            <View className="title">{usercarte.name}</View>
            <View className="desc">
              {usercarte.corp || "公司未填写"} |
              {usercarte.office || "职位未填写"}
            </View>
          </View>
          {isme && (
            <View className="edittag opacity" onClick={this.handleEdit}>
              <AtIcon value="edit" size={15} />
              编辑名片
            </View>
          )}
        </View>
        <View className="at-row headerboxbottom shadow text_center bg_white">
          <View className="at-col text_black_light">
            <AtIcon value="eye" size={20} />
            人气 {usercarte.numView}
          </View>
          <View className="at-col text_black_light">
            <AtIcon value="heart" size={18} />
            收藏 {usercarte.numCollect}
          </View>
          <View className="at-col">
            <AtButton
              type="primary"
              size="small"
              onClick={this.handleShareShow}
            >
              <AtIcon value="share-2" size={15} />
              分享好友
            </AtButton>
          </View>
        </View>
        <HeightView height={20} color="transparent" />
        <View className="paneltitle bg_white">基本信息</View>
        <AtList>
          <AtListItem title="姓名" extraText={usercarte.name} />
          <AtListItem title="手机" extraText={usercarte.contactPhonenum} />
          <AtListItem
            title="身份"
            extraText={this.getCareerName(usercarte.careerKind)}
          />
          <AtListItem title="公司" extraText={usercarte.corp} />
          <AtListItem title="职位" extraText={usercarte.office} />
        </AtList>

        <HeightView height={20} color="transparent" />
        <View className="paneltitle bg_white">个人简介</View>
        <HeightView height={1} color="#d6e4ef" />
        <View className="userdesc content-min-height  bg_white">
          {usercarte.desc || ""}
        </View>

        <HeightView height={20} color="transparent" />
        <View className="paneltitle bg_white">名片文章</View>
        <HeightView height={1} color="#d6e4ef" />
        <View className="content-min-height bg_white">
          {usercartedesc.articles &&
            usercartedesc.articles.map((item, index) => {
              return (
                <ArticleItem
                  key={item.id}
                  item={item}
                  line={index < usercartedesc.articles.length - 1}
                />
              );
            })}
          <AtLoadMore status={"noMore"} />
        </View>

        <HeightView height={100} color="transparent" />
        <ShareDialog isOpened={showshare} onClose={this.handleShareClose} />
        {!isme && (
          <View
            onClick={this.handleEditMine}
            className="fixbottom text_center bg_theme_opacity"
          >
            生成我的名片
          </View>
        )}
      </BaseView>
    );
  }
}
