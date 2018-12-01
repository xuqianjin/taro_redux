import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import { View, Text, ScrollView } from "@tarojs/components";

import {
  AtButton,
  AtInput,
  AtForm,
  Picker,
  AtTextarea,
  AtMessage,
  AtTag
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
      desc: ""
    };
  }
  config = {
    navigationBarTitleText: "添加简介"
  };
  componentDidMount() {
    const { userinfo } = this.props.userReducer;
    this.props.getUserCarte(userinfo.userId).then(({ value }) => {
      const { usercarte } = this.props.userReducer;
      this.setState({
        desc: usercarte.desc
      });
    });
  }
  onSubmit = () => {
    const { listdata, desc, tags } = this.state;
    let postdata = { desc };
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

  onDescChange = value => {
    const { detail } = value;
    this.setState({ desc: detail.value });
  };
  render() {
    const { usercarte } = this.props.userReducer;
    const { listdata, avatarUrl, desc, carteTag, tags } = this.state;
    return (
      <BaseView baseclassname="bg_white">
        <HeightView height={50} color="transparent" />
        <View className="desc">
          <AtTextarea
            value={desc}
            onChange={this.onDescChange.bind(this)}
            height="200"
            maxlength="200"
            placeholder="个人简介..."
          />
        </View>
        <HeightView height={100} color="transparent" />
        <FormidButton onClick={this.onSubmit}>
          <AtButton className="button" type="primary">
            提交
          </AtButton>
        </FormidButton>
      </BaseView>
    );
  }
}
