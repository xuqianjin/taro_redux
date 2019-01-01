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
  AtMessage,
  AtIcon,
  AtTag
} from "taro-ui";
import HeightView from "../../components/HeightView";
import BaseView from "../../components/BaseView";
import ImageView from "../../components/ImageView";
import UploadFile from "../../components/UploadFile";
import { getRoomKinds, postDemo } from "../../reducers/demoReducer";

import { roomStyle, houseKind, roomKind } from "../../components/Constant";
import { getNameByValue } from "../../lib/utils";
import "./style.scss";

import {
  putUserCarte,
  getUserCarte,
  putWxUserPhone,
  postWxFormId,
  postWxQrCode
} from "../../reducers/userReducer";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer,
    demoReducer: state.demoReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ putUserCarte }, dispatch);
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  static defaultProps = {};
  config = {
    navigationBarTitleText: "编辑案例"
  };
  constructor(props) {
    super(props);
    this.state = {
      photos: "",
      rooms: {}
    };
  }
  componentWillMount() {}
  onSubmit = () => {
    const { userinfo, usercarte } = this.props.userReducer;
    const { listdata, rooms, photos } = this.state;
    const params = this.$router.params;
    let postdata = JSON.parse(usercarte.extra) || {};
    if (!photos) {
      Taro.atMessage({ message: `请上传相片`, type: "error" });
      return null;
    }
    postdata.photos = photos;
    const keys = Object.keys(rooms);
    console.log(postdata);
    Taro.showLoading();
    this.props
      .putUserCarte({ extra: JSON.stringify(postdata) })
      .then(res => {
        Taro.eventCenter.trigger("getUserCarteDesc");
        Taro.hideLoading();
        Taro.navigateBack();
      })
      .catch(err => {
        Taro.hideLoading();
        Taro.atMessage({ message: err.message, type: "error" });
      });
  };
  handleUpload = (id, photos) => {
    if (id === -1) {
      //上传默认案例
      this.setState({ photos: photos.join(",") });
    } else {
    }
  };
  render() {
    const { usercarte } = this.props.userReducer;
    const { photos } = this.state;
    return (
      <BaseView>
        <HeightView height={20} color="transparent" />
        <View className="paneltitle bg_white">
          <Text>上传相片</Text>
        </View>
        <View className="bg_white">
          <UploadFile
            prefix="wxd/"
            config={{ count: 9 }}
            onUpload={this.handleUpload.bind(this, -1)}
          >
            <View className="at-row photosview">
              {photos &&
                photos.split(",").map((item, index) => {
                  return (
                    <ImageView key={index} baseclassname="add_img" src={item} />
                  );
                })}
              <AtIcon
                value="add"
                color="#ddd"
                size={30}
                className="add_icon opacity"
              />
            </View>
          </UploadFile>
        </View>
        <HeightView height={20} color="transparent" />
        <HeightView height={100} color="transparent" />
        <AtButton className="button" type="primary" onClick={this.onSubmit}>
          提交
        </AtButton>
        <HeightView height={100} color="transparent" />
      </BaseView>
    );
  }
}
