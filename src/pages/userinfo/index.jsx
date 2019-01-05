import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import { View, ScrollView } from "@tarojs/components";
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
  AtTag,
  AtMessage
} from "taro-ui";
import HeightView from "../../components/HeightView";
import BaseView from "../../components/BaseView";
import ImageView from "../../components/ImageView";
import ShareDialog from "../../components/ShareDialog";
import RedpackDialog from "../redpack/RedpackDialog";
import FormidButton from "../../components/FormidButton";
import PopRegion, { getRegionNameById } from "../../components/PopRegion";

import ArticleItem from "../article/ArticleItem";
import DemoItem from "../demo/DemoItem";
import { changeSrc } from "../../lib/utils";

import { gender, careerKind } from "../../components/Constant";

import {
  getUserCarteDesc,
  putUserCarteCollect,
  getUserCarteCollect
} from "../../reducers/userReducer";
import { postViewlogs, putViewlogs } from "../../reducers/customerReducer";
import {
  getRedPackDetail,
  getRedPackOpen
} from "../../reducers/redpackReducer";
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
      getUserCarteDesc,
      putUserCarteCollect,
      getUserCarteCollect,
      postViewlogs,
      putViewlogs,
      getTags,
      getRedPackDetail,
      getRedPackOpen
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
      pageuserid: "",
      showarticleall: false,
      showdemoall: false,
      showphotoall: false
    };
  }
  componentWillMount() {
    const { usercarte, usercartedesc, userinfo } = this.props.userReducer;
    const params = this.$router.params;
    console.log(params);
    const isme = params.userId == userinfo.userId;

    if (params.redpackId) {
      this.requstRedpack();
    }
    this.props.getUserCarteCollect();
    Taro.eventCenter.on("getUserCarteDesc", () => {
      this.props.getUserCarteDesc(params.userId);
    });

    Taro.eventCenter.trigger("getUserCarteDesc");
    this.setState({ isme, pageuserid: params.userId });
  }

  componentWillUnmount() {
    Taro.eventCenter.off("getUserCarteDesc");
    this.postViewlog();
  }
  handleRedpackOpen = () => {
    const { openRedpack, redpack } = this.state;
    if (redpack.status !== 1) {
      return;
    }
    if (openRedpack) {
      this.showOpen();
      return;
    }
    Taro.showLoading();
    this.props
      .getRedPackOpen(redpack.id)
      .then(res => {
        Taro.hideLoading();
        this.requstRedpack(true);
      })
      .catch(err => {
        Taro.atMessage({ message: err.message, type: "error" });
        Taro.hideLoading();
      });
  };
  requstRedpack = showme => {
    const { userinfo } = this.props.userReducer;
    const { redpackId } = this.$router.params;
    this.props.getRedPackDetail(redpackId).then(({ value }) => {
      const { RedpackPieces } = value;
      const openRedpack = RedpackPieces.find(
        item => item.Receiver.id === userinfo.userId
      );
      this.setState({ redpack: value, openRedpack });
      showme && this.showOpen();
    });
  };
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
    const { usercartedesc } = this.props.userReducer;
    const { carte } = usercartedesc;
    return {
      title: carte.name + "的名片",
      path: `/pages/index?goto=carte&userId=${carte.id}&name=${carte.name}`
    };
  }
  getRegionName = id => {
    if (!id) {
      return "未填写";
    }
    const { regions } = this.props.commonReducer;
    const name = getRegionNameById(id, regions);
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
      case 5:
        Taro.navigateTo({ url: "/pages/userinfo/demos" });
        break;
      case 6:
        Taro.navigateTo({ url: "/pages/userinfo/photos" });
        break;
      default:
    }
  };
  handleInfoClick = index => {
    const { usercartedesc } = this.props.userReducer;
    const { carte } = usercartedesc;
    switch (index) {
      case 0:
        Taro.navigateTo({ url: "/pages/share/index?type=4" });
        break;
      case 1:
        Taro.setClipboardData({ data: JSON.parse(carte.extra).wechat });
        break;
      case 2:
        this.handlePhoneCall(carte.contactPhonenum);
        break;
      default:
    }
  };
  handlePhoneCall = phoneNumber => {
    if (phoneNumber) {
      Taro.makePhoneCall({ phoneNumber });
    }
  };
  handleEdit = () => {
    Taro.navigateTo({ url: "/pages/userinfo/edit" });
  };
  handleEditMine = () => {
    Taro.redirectTo({ url: "/pages/userinfo/edit" });
  };
  handSendMessage = () => {
    const { usercartedesc } = this.props.userReducer;
    const { carte } = usercartedesc;
    Taro.navigateTo({
      url: `/pages/chat/index?to=${carte.id}`
    });
  };
  handleShareShow = () => {
    this.setState({ showshare: true });
  };
  handleSave = () => {
    const { usercartedesc } = this.props.userReducer;
    const { carte } = usercartedesc;
    Taro.addPhoneContact({
      nickName: carte.name,
      mobilePhoneNumber: carte.contactPhonenum,
      weChatNumber: carte.contactPhonenum
    });
  };
  handleShareClose = () => {
    this.setState({ showshare: false });
  };
  handleArticleClick = item => {
    Taro.navigateTo({
      url: `/pages/webview/index?id=${item.id}&overcarte=${item.isSystem}`
    });
  };
  handleDemoClick = item => {
    Taro.navigateTo({
      url: `/pages/webview/demo?id=${item.id}&overcarte=${item.isSystem}`
    });
  };
  handleCollect = isCollect => {
    const { isme } = this.state;
    const { usercartedesc } = this.props.userReducer;
    const { carte } = usercartedesc;
    if (!isme && !isCollect) {
      Taro.showLoading();
      this.props.putUserCarteCollect(carte.id).then(res => {
        Taro.hideLoading();
        Taro.atMessage({
          message: "名片已放到收藏夹",
          type: "success"
        });
        this.props.getUserCarteCollect();
      });
    }
  };
  handleShowAll = type => {
    switch (type) {
      case 1:
        this.setState({ showarticleall: true });
        break;
      case 2:
        this.setState({ showdemoall: true });
        break;
      case 3:
        this.setState({ showphotoall: true });
        break;
      default:
    }
  };
  render() {
    const { redpackId } = this.$router.params;
    const {
      showshare,
      isme,
      showarticleall,
      showdemoall,
      showphotoall
    } = this.state;
    const { regions } = this.props.commonReducer;
    const { cartecollect, usercartedesc } = this.props.userReducer;
    var { carte } = usercartedesc;
    let condition = false;
    if (carte && regions) {
    } else {
      condition = {
        state: "viewLoading"
      };
    }
    if (!carte) {
      carte = {};
    }
    const advantage =
      (carte && carte.advantage && JSON.parse(carte.advantage || "")) || [];
    const isCollect =
      !isme && cartecollect && cartecollect.find(item => item.id === carte.id);
    const themcolor = APP_COLOR_THEME;
    var extra = { photos: "" };
    if (carte.extra && JSON.parse(carte.extra)) {
      extra = Object.assign({}, extra, JSON.parse(carte.extra));
    }
    const infomoredata = [
      {
        title: "关注公众号",
        icon: "gongzhonghao",
        desc: extra.qrpubname,
        isshow: Boolean(extra.qrpubname)
      },
      {
        title: "加我微信",
        icon: "wechat",
        desc: extra.wechat,
        isshow: Boolean(extra.wechat)
      },
      {
        title: "拨打电话",
        icon: "phone",
        desc: carte.contactPhonenum,
        isshow: Boolean(carte.contactPhonenum)
      }
    ];
    return (
      <BaseView baseclassname="bg_white" condition={condition}>
        <View className="userinfo_header_bg" />
        <View className="bg_white">
          <HeightView height={20} color="transparent" />
          <View className="headderbox">
            <View className="headercontent">
              <View className="at-row at-row at-row__justify--between at-row__align--center">
                <View className="at-col  at-col-1 at-col--auto">
                  <View className="at-row at-row__align--center">
                    <View className="name at-col">{`${carte.name}`}</View>
                    <View className="career at-col margin-left-30">
                      {carte.office || "职位未填写"}
                    </View>
                  </View>
                  <View className="career">{carte.corp || "公司未填写"}</View>
                </View>
                <View className="at-col  at-col-1 at-col--auto">
                  <AtAvatar
                    size="large"
                    circle={true}
                    image={`${changeSrc(carte.avatarUrl)}`}
                  />
                </View>
              </View>
              <HeightView height={20} color="transparent" />
              <View className="info">
                <AtIcon
                  size={15}
                  prefixClass="iconfont"
                  value="wechat"
                  color={APP_COLOR_THEME}
                />
                <Text className="margin-left-30">
                  {extra.wechat || "未填写"}
                </Text>
              </View>
              <View
                className="info "
                onClick={this.handlePhoneCall.bind(this, carte.contactPhonenum)}
              >
                <AtIcon
                  size={15}
                  prefixClass="iconfont"
                  value="phone"
                  color={APP_COLOR_THEME}
                />
                <Text className="margin-left-30">
                  {carte.contactPhonenum || "未填写"}
                </Text>
              </View>
              <View className="info">
                <AtIcon size={15} value="map-pin" color={APP_COLOR_THEME} />
                <Text className="margin-left-30">
                  {this.getRegionName(carte.regionId)}
                  {carte.address || ""}
                </Text>
              </View>
              {isme && (
                <View
                  className="userinfoedit text_theme text_right"
                  onClick={this.handleSetClick.bind(this, 1)}
                >
                  编辑
                </View>
              )}
            </View>
          </View>
          <HeightView height={30} color="transparent" />
          <View
            className="at-row at-row__justify--between"
            style={`width:${Taro.pxTransform(710)};margin:auto`}
          >
            <AtButton
              // onClick={this.handleShareShow}
              className="infobutton"
              type="secondary"
              open-type="share"
            >
              分享名片
            </AtButton>
            <AtButton
              onClick={this.handleSave}
              className="infobutton"
              type="primary"
            >
              存入通讯录
            </AtButton>
          </View>
          <HeightView height={20} color="transparent" />
          {/*<View className="at-row headerboxbottom text_center bg_white">
            <View className="at-col text_black_light">
              <AtIcon value="eye" size={20} />
              <Text>\t人气\t{carte.numView}</Text>
            </View>
            <View
              className="at-col text_black_light"
              onClick={this.handleCollect.bind(this, isCollect)}
            >
              <AtIcon
                value={isCollect ? "heart-2" : "heart"}
                color={isCollect ? themcolor : "text_black_light"}
                size={18}
              />
              <Text>\t收藏\t{carte.numCollect}</Text>
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
          </View>*/}
          <ScrollView
            scrollX={true}
            className="at-row"
            style="white-space:nowrap"
          >
            {infomoredata.map((item, index) => {
              return (
                item.isshow && (
                  <View
                    key={index}
                    className="text_center"
                    style={`margin:${Taro.pxTransform(
                      20
                    )};border:1px solid #ddd;border-radius:5px;padding:15px 10px;display:inline-block;min-width:180rpx`}
                    onClick={this.handleInfoClick.bind(this, index)}
                  >
                    <View>
                      <AtIcon
                        prefixClass="iconfont"
                        value={item.icon}
                        color={themcolor}
                        size={15}
                      />
                      {item.title}
                    </View>
                    <View>{item.desc}</View>
                  </View>
                )
              );
            })}
          </ScrollView>
          <HeightView height={20} color="transparent" />
        </View>

        <View>
          <HeightView height={20} color="transparent" />
          <View className="paneltitle bg_white">
            <Text>个人简介</Text>
            {isme && (
              <View
                className="extra text_theme"
                onClick={this.handleSetClick.bind(this, 2)}
              >
                编辑
              </View>
            )}
          </View>
          <HeightView height={2} color="#d6e4ef" />
          <View className="userdesc content-min-height  bg_white">
            {isme && !carte.desc ? (
              <AtButton onClick={this.handleSetClick.bind(this, 2)}>
                去添加
              </AtButton>
            ) : (
              <Text>{carte.desc || ""}</Text>
            )}
          </View>
        </View>

        <View>
          <HeightView height={20} color="transparent" />
          <View className="paneltitle bg_white">
            <Text>擅长领域</Text>
            {isme && (
              <View
                className="extra text_theme"
                onClick={this.handleSetClick.bind(this, 3)}
              >
                编辑
              </View>
            )}
          </View>
          <HeightView height={2} color="#d6e4ef" />
          <View className="userdesc content-min-height bg_white">
            <HeightView height={20} color="transparent" />
            {isme && advantage.length == 0 ? (
              <AtButton onClick={this.handleSetClick.bind(this, 3)}>
                去添加
              </AtButton>
            ) : (
              advantage.map((tag, index) => {
                return (
                  <AtTag key={index} type="primary" active={true} circle={true}>
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
            <Text>精选案例</Text>
            {isme && (
              <View
                className="extra text_theme"
                onClick={this.handleSetClick.bind(this, 5)}
              >
                添加
              </View>
            )}
          </View>
          <HeightView height={2} color="#d6e4ef" />
          <View className="content-min-height bg_white">
            <View className="at-row at-row--wrap">
              {usercartedesc.demos &&
                usercartedesc.demos.map((item, index) => {
                  return index > 3 && !showarticleall ? null : (
                    <DemoItem
                      key={item.id}
                      item={item}
                      line={true}
                      onClick={this.handleDemoClick.bind(this, item)}
                    />
                  );
                })}
            </View>
            {usercartedesc.demos && (
              <AtLoadMore
                status={
                  usercartedesc.demos.length > 4 && !showdemoall
                    ? "more"
                    : "noMore"
                }
                moreBtnStyle='border:none !important'
                onClick={this.handleShowAll.bind(this, 2)}
              />
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
          <HeightView height={2} color="#d6e4ef" />
          <View className="content-min-height bg_white">
            {usercartedesc.articles &&
              usercartedesc.articles.map((item, index) => {
                return index > 2 && !showarticleall ? null : (
                  <ArticleItem
                    key={item.id}
                    item={item}
                    line={true}
                    onClick={this.handleArticleClick.bind(this, item)}
                  />
                );
              })}
            {usercartedesc.articles && (
              <AtLoadMore
                status={
                  usercartedesc.articles.length > 3 && !showarticleall
                    ? "more"
                    : "noMore"
                }
                moreBtnStyle='border:none !important'
                onClick={this.handleShowAll.bind(this, 1)}
              />
            )}
          </View>
        </View>

        <View>
          <HeightView height={20} color="transparent" />
          <View className="paneltitle bg_white">
            <Text>我的相片</Text>
            {isme && (
              <View
                className="extra text_theme"
                onClick={this.handleSetClick.bind(this, 6)}
              >
                添加
              </View>
            )}
          </View>
          <HeightView height={2} color="#d6e4ef" />
          <View className="content-min-height bg_white">
            {extra.photos &&
              extra.photos.split(",").map((item, index) => {
                return index > 2 && !showphotoall ? null : (
                  <ImageView
                    key={index}
                    src={item}
                    baseclassname="photosimage"
                    mode="widthFix"
                  />
                );
              })}
            {extra.photos && (
              <AtLoadMore
                status={
                  extra.photos.split(",").length > 3 && !showphotoall
                    ? "more"
                    : "noMore"
                }
                moreBtnStyle='border:none !important'
                onClick={this.handleShowAll.bind(this, 3)}
              />
            )}
          </View>
        </View>

        <HeightView height={100} color="transparent" />
        <ShareDialog isOpened={showshare} onClose={this.handleShareClose} />
        {!isme && (
          <FormidButton senderId={carte.id}>
            <View
              className="fixmessage bg_theme"
              onClick={this.handSendMessage}
            >
              <AtIcon value="message" size={18} />
              <HeightView height={5} color="transparent" />
              <Text>咨询</Text>
            </View>
          </FormidButton>
        )}
        {!isme && (
          <View onClick={this.handleEditMine} className="fixbottom bg_theme">
            <AtIcon value="user" size={18} />
            <HeightView height={5} color="transparent" />
            <Text>我的名片</Text>
          </View>
        )}
        <PopRegion ref={ref => (this.PopRegion = ref)} />
        <AtMessage />
        <RedpackDialog redpackId={redpackId} />
      </BaseView>
    );
  }
}
