import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";

import BaseView from "../../components/BaseView";
import HeightView from "../../components/HeightView";
import PopRegion, { getRegionNameById } from "../../components/PopRegion";

import {
  AtIcon,
  AtLoadMore,
  AtAvatar,
  AtActionSheet,
  AtActionSheetItem
} from "taro-ui";
import {
  getUserCarteCollect,
  delUserCarteCollect
} from "../../reducers/userReducer";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";
import { changeSrc } from "../../lib/utils";

import "./style.scss";

const mapStateToProps = state => {
  return { userReducer: state.userReducer, commonReducer: state.commonReducer };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getUserCarteCollect,
      delUserCarteCollect
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
    navigationBarTitleText: "收藏名片"
  };
  constructor(props) {
    super(props);
    this.state = {
      showAction: ""
    };
  }
  componentWillMount() {
    this.props.getUserCarteCollect();
  }

  getRegionName = id => {
    if (!id) {
      return "未填写";
    }
    const { regions } = this.props.commonReducer;
    const name = getRegionNameById(id, regions);
    return name;
  };
  handleItemClick = item => {
    this.setState({ showAction: item });
  };
  handleClose = () => {
    this.setState({ showAction: "" });
  };
  onActionClick = value => {
    const { showAction } = this.state;
    this.handleClose();
    switch (value) {
      case 0:
        Taro.navigateTo({
          url: `/pages/userinfo/index?userId=${showAction.id}`
        });
        break;
      case 1:
        Taro.navigateTo({
          url: `/pages/chat/index?to=${showAction.id}`
        });
        break;
      case 2:
        Taro.showLoading();
        this.props.delUserCarteCollect(showAction.id).then(res => {
          this.componentWillMount();
          Taro.hideLoading();
        });
        break;
      default:
    }
  };
  render() {
    const { showAction } = this.state;
    const { cartecollect } = this.props.userReducer;
    const { regions } = this.props.commonReducer;
    let condition = false;
    if (cartecollect && regions) {
    } else {
      condition = {
        state: "viewLoading"
      };
    }
    const color = APP_COLOR_THEME;
    return (
      <BaseView condition={condition}>
        {cartecollect &&
          cartecollect.map(item => {
            return (
              <View key={item.id} className="collectContent">
                <HeightView height={20} />
                <View
                  onClick={this.handleItemClick.bind(this, item)}
                  className="at-row  at-row__align--center at-row__justify--between bg_white collectItem shadow opacity"
                >
                  <View className="at-col at-col-1 at-col--auto collectImg">
                    <AtAvatar
                      circle={true}
                      size="normal"
                      image={changeSrc(item.avatarUrl)}
                    />
                  </View>
                  <View className="at-col at-col--wrap collectRight">
                    <View>
                      <Text>{item.name}</Text>
                    </View>
                    <HeightView height={10} color="transparent" />
                    <View className="at-row text_black_light text_left collectfontsmall">
                      <View className="at-col">
                        <AtIcon value="eye" size={20} />
                        {item.numView}
                      </View>
                      <View className="at-col">
                        <AtIcon value="heart" size={16} />
                        {item.numCollect}
                      </View>
                      <View className="at-col at-col-6">
                        <AtIcon value="map-pin" size={16} />
                        <Text>{this.getRegionName(item.regionId)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        <AtActionSheet
          isOpened={!!showAction}
          cancelText="取消"
          title="请选择操作"
          onCancel={this.handleClose}
          onClose={this.handleClose}
        >
          <AtActionSheetItem onClick={this.onActionClick.bind(this, 0)}>
            <Text style={`color:${color}`}>查看名片</Text>
          </AtActionSheetItem>
          <AtActionSheetItem onClick={this.onActionClick.bind(this, 1)}>
            <Text style={`color:${color}`}>发送消息</Text>
          </AtActionSheetItem>
          <AtActionSheetItem onClick={this.onActionClick.bind(this, 2)}>
            <Text style="color:red">删除收藏</Text>
          </AtActionSheetItem>
        </AtActionSheet>
        <AtLoadMore status={"noMore"} />
        <PopRegion />
      </BaseView>
    );
  }
}
