import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import { View, Text, ScrollView, Button } from "@tarojs/components";

import {
  AtInput,
  AtButton,
  AtTag,
  AtModal,
  AtModalHeader,
  AtModalAction,
  AtModalContent
} from "taro-ui";

import HeightView from "../../components/HeightView";
import BaseView from "../../components/BaseView";
import ImageView from "../../components/ImageView";
import UploadFile from "../../components/UploadFile";
import PopRegion from "../../components/PopRegion";
import FormidButton from "../../components/FormidButton";
import { gender, careerKind } from "../../components/Constant";

import {
  putUserCarte,
  getUserCarte,
  putWxUserPhone,
  postWxFormId,
  postWxQrCode
} from "../../reducers/userReducer";

import { getTags } from "../../reducers/commonReducer";

import "./style.scss";

const mapStateToProps = state => {
  return { userReducer: state.userReducer };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      putWxUserPhone,
      putUserCarte,
      getUserCarte,
      postWxFormId,
      postWxQrCode,
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

  constructor(props) {
    super(props);
    this.state = {
      carteTag: [
        "全屋整装",
        "全屋定制",
        "空间改造",
        "老房改造",
        "局部改造",
        "厂房改造",
        "小户型",
        "个性化定制",
        "家装设计",
        "复式设计",
        "样板房",
        "别墅豪宅",
        "办公空间",
        "整体软装",
        "智能家居"
      ],
      advantage: [],
      showModal: false,
      editvalue: ""
    };
  }
  config = {
    navigationBarTitleText: "编辑标签"
  };
  componentDidMount() {
    const { userinfo } = this.props.userReducer;
    // this.props.getTags({ kind: 1 }).then(res => {
    //   this.setState({ carteTag: res.value });
    // });
    this.props.getUserCarte(userinfo.userId).then(({ value }) => {
      const { usercarte } = this.props.userReducer;
      this.setState({
        advantage: JSON.parse(usercarte.advantage) || []
      });
    });
  }
  onSubmit = () => {
    const { advantage } = this.state;
    let postdata = {
      advantage: JSON.stringify(advantage)
    };
    Taro.showLoading();
    this.props
      .putUserCarte(postdata)
      .then(res => {
        Taro.eventCenter.trigger("getUserCarte");
        Taro.hideLoading();
        Taro.navigateBack();
      })
      .catch(err => {
        Taro.hideLoading();
      });
  };

  handleTagClick = value => {
    const { name, active } = value;
    const { advantage } = this.state;
    if (advantage.includes(name) && active) {
      advantage.splice(advantage.indexOf(name), 1);
    } else {
      advantage.push(name);
    }
    this.setState({ advantage });
  };
  handleTagDelClick = value => {
    const { name, active } = value;
    const { advantage } = this.state;
    if (advantage.includes(name)) {
      advantage.splice(advantage.indexOf(name), 1);
    }
    this.setState({ advantage });
  };
  handleTagMyClick = () => {
    this.setState({ showModal: true });
  };
  onChange = value => {
    this.setState({ editvalue: value });
  };
  onInputClose = () => {
    this.setState({ editvalue: "", showModal: false });
  };
  onInputConfirm = () => {
    const { editvalue, advantage } = this.state;
    if (editvalue && !advantage.includes(editvalue)) {
      advantage.push(editvalue);
    }
    this.setState({ editvalue: "", showModal: false, advantage });
  };
  render() {
    const { usercarte } = this.props.userReducer;
    const { carteTag, advantage, showModal, editvalue } = this.state;
    return (
      <BaseView baseclassname="bg_white">
        <AtMessage />
        <HeightView height={50} color="transparent" />
        <View style={`margin:auto;width:${Taro.pxTransform(710)}`}>
          <View style="font-size:15px">推荐标签</View>
          <HeightView height={20} color="transparent" />
          {carteTag.map((tag, index) => {
            return (
              <AtTag
                active={advantage.includes(tag)}
                key={index}
                name={tag}
                type="primary"
                circle={true}
                onClick={this.handleTagClick}
              >
                {tag}
              </AtTag>
            );
          })}
        </View>
        <HeightView height={100} color="transparent" />
        <View style={`margin:auto;width:${Taro.pxTransform(710)}`}>
          <View style="font-size:15px">
            我的选择<Text className="text_black_light">(点击标签删除)</Text>
          </View>
          <HeightView height={20} color="transparent" />
          {advantage.map((tag, index) => {
            return (
              <AtTag
                key={index}
                name={tag}
                type="primary"
                circle={true}
                onClick={this.handleTagDelClick}
              >
                {tag}
              </AtTag>
            );
          })}
          <AtTag type="primary" circle={true} onClick={this.handleTagMyClick}>
            +添加自定义标签
          </AtTag>
        </View>
        <HeightView height={100} color="transparent" />
        <FormidButton onClick={this.onSubmit}>
          <AtButton className="button" type="primary">
            提交
          </AtButton>
        </FormidButton>
        <AtModal isOpened={showModal}>
          <AtModalHeader>请输入自定义标签</AtModalHeader>
          <AtModalContent>
            <AtInput
              placeholder="最长十个字"
              maxlength={10}
              autoFocus={false}
              clear={true}
              value={editvalue}
              onChange={this.onChange}
            />
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.onInputClose}>取消</Button>
            <Button onClick={this.onInputConfirm}>确定</Button>
          </AtModalAction>
        </AtModal>
      </BaseView>
    );
  }
}
