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
  AtLoadMore,
  AtAvatar,
  AtTag
} from "taro-ui";
import HeightView from "../../components/HeightView";
import BaseView from "../../components/BaseView";
import ImageView from "../../components/ImageView";
import ShareDialog from "../../components/ShareDialog";
import PopRegion from "../../components/PopRegion";

import ArticleItem from "../article/ArticleItem";
import { changeSrc } from "../../lib/utils";

import { gender, careerKind } from "../../components/Constant";

import { getUserCarte, getUserCarteDesc } from "../../reducers/userReducer";
import { postViewlogs, putViewlogs } from "../../reducers/customerReducer";
import { getTags } from "../../reducers/commonReducer";

import "./edit";

import "./style.scss";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer,
    customerReducer: state.customerReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getUserCarte,
      getUserCarteDesc,
      postViewlogs,
      putViewlogs,
      getTags
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
    navigationBarTitleText: "查看名片"
  };
  constructor(props) {
    super(props);
    this.state = {
      showshare: false,
      timebegin: new Date().getTime() - 3000,
      kind: 1,
      isme: true,
      pageuserid: ""
    };
  }
  componentWillMount() {}
  componentDidMount() {
    const { usercarte, usercartedesc, userinfo } = this.props.userReducer;
    const params = this.$router.params;
    const isme = params.userId == userinfo.userId;
    this.props.getUserCarte(params.userId);
    this.props.getUserCarteDesc(params.userId);

    this.setState({ isme, pageuserid: params.userId });
  }

  componentWillUnmount() {
    this.postViewlog();
  }
  //上报数据
  postViewlog = () => {
    const { timebegin, kind, isme, pageuserid } = this.state;
    const duration = (new Date().getTime() - timebegin) / 1000;
    const postdata = {
      kind,
      sourceId: Number(pageuserid),
      duration: parseInt(duration)
    };
    if (!isme) {
      this.props.postViewlogs(postdata).then(({ value }) => {
        const { id } = value;
        this.props.putViewlogs(id, postdata);
      });
    }
  };
  onShareAppMessage() {
    const { usercarte } = this.props.userReducer;
    return {
      title: usercarte.name + "的名片",
      path: `/pages/index?goto=carte&userId=${usercarte.id}&name=${
        usercarte.name
      }`
    };
  }
  getRegionName = id => {
    if (!id) {
      return "未填写";
    }
    if (!this.PopRegion) {
      return null;
    }
    const name = this.PopRegion.getRegionNameById(id);
    return name;
  };
  getCareerName = value => {
    if (!value) {
      return null;
    }
    return careerKind.find(item => item.value === value).name;
  };
  handleSetClick = value => {
    switch (value) {
      case 1:
        Taro.navigateTo({ url: "/pages/userinfo/edit" });
        break;
      case 2:
        Taro.navigateTo({ url: "/pages/userinfo/adddesc" });
        break;
      case 3:
        Taro.navigateTo({ url: "/pages/userinfo/addtag" });
        break;
      case 4:
        Taro.navigateTo({ url: "/pages/userinfo/articles" });
        break;
      default:
    }
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
    const { showshare, isme } = this.state;
    const { usercarte, usercartedesc, userinfo } = this.props.userReducer;
    const { regions } = this.props.commonReducer;
    let condition = false;
    if (usercartedesc && regions) {
    } else {
      condition = {
        state: "viewLoading"
      };
    }
    const advantage =
      (usercarte &&
        usercarte.advantage &&
        JSON.parse(usercarte.advantage || "")) ||
      [];
    return (
      <BaseView baseclassname="" condition={condition}>
        <HeightView height={150} color={APP_COLOR_THEME} />
        <View className="bg_white">
          <HeightView height={20} color="transparent" />
          <View className="headderbox">
            <View className="headercontent">
              <View className="at-row at-row at-row__justify--between at-row__align--center">
                <View className="at-col  at-col-1 at-col--auto">
                  <View className="name">{`${usercarte.name}`}</View>
                  <View className="career">
                    {usercarte.office || "职位未填写"}
                  </View>
                  <View className="career">
                    {usercarte.corp || "公司未填写"}
                  </View>
                </View>
                <View className="at-col  at-col-1 at-col--auto">
                  <AtAvatar
                    size="large"
                    circle={true}
                    image={`${changeSrc(usercarte.avatarUrl)}`}
                  />
                </View>
              </View>
              {isme && (
                <View
                  className="userinfoedit text_theme text_right"
                  onClick={this.handleSetClick.bind(this, 1)}
                >
                  编辑
                </View>
              )}
              <View className="info ">
                <AtIcon size={15} value="phone" />
                <Text>{usercarte.contactPhonenum || "未填写"}</Text>
              </View>
              <View className="info">
                <AtIcon size={15} value="map-pin" />
                <Text>{this.getRegionName(usercarte.regionId)}</Text>
              </View>
            </View>
          </View>
          <HeightView height={30} color="transparent" />
          <View className="at-row headerboxbottom text_center bg_white">
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
                分享好友
              </AtButton>
            </View>
          </View>
        </View>

        <View>
          <HeightView height={20} color="transparent" />
          <View className="paneltitle bg_white">
            <Text>我的简介</Text>
            {isme && (
              <View
                className="extra text_theme"
                onClick={this.handleSetClick.bind(this, 2)}
              >
                编辑
              </View>
            )}
          </View>
          <HeightView height={1} color="#d6e4ef" />
          <View className="userdesc content-min-height  bg_white">
            {isme && !usercarte.desc ? (
              <AtButton onClick={this.handleSetClick.bind(this, 2)}>
                去添加
              </AtButton>
            ) : (
              usercarte.desc || ""
            )}
          </View>
        </View>

        <View>
          <HeightView height={20} color="transparent" />
          <View className="paneltitle bg_white">
            <Text>个性标签</Text>
            {isme && (
              <View
                className="extra text_theme"
                onClick={this.handleSetClick.bind(this, 3)}
              >
                编辑
              </View>
            )}
          </View>
          <HeightView height={1} color="#d6e4ef" />
          <View className="userdesc content-min-height bg_white">
            <HeightView height={20} color="transparent" />
            {isme && advantage.length == 0 ? (
              <AtButton onClick={this.handleSetClick.bind(this, 3)}>
                去添加
              </AtButton>
            ) : (
              advantage.map((tag, index) => {
                return (
                  <AtTag key={index} type="primary" circle={true}>
                    {tag}
                  </AtTag>
                );
              })
            )}
          </View>
        </View>

        <View>
          <HeightView height={20} color="transparent" />
          <View className="paneltitle bg_white">
            <Text>推荐好文</Text>
            {isme && (
              <View
                className="extra text_theme"
                onClick={this.handleSetClick.bind(this, 4)}
              >
                添加
              </View>
            )}
          </View>
          <HeightView height={1} color="#d6e4ef" />
          <View className="content-min-height bg_white">
            {usercartedesc.articles &&
              usercartedesc.articles.map((item, index) => {
                return <ArticleItem key={item.id} item={item} line={true} />;
              })}
            <AtLoadMore status={"noMore"} />
          </View>
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
        <PopRegion ref={ref => (this.PopRegion = ref)} />
      </BaseView>
    );
  }
}
