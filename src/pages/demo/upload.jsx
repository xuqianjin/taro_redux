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
import PopRegion, { getRegionNameById } from "../../components/PopRegion";
import { getRoomKinds, postDemo } from "../../reducers/demoReducer";

import {
  roomStyle,
  houseKind,
  roomKind,
  demoKind
} from "../../components/Constant";
import { getNameByValue } from "../../lib/utils";
import "./style.scss";

const mapStateToProps = state => {
  return {
    userReducer: state.userReducer,
    commonReducer: state.commonReducer,
    demoReducer: state.demoReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ getRoomKinds, postDemo }, dispatch);
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
      listdata: [
        {
          title: "面积",
          name: "area",
          type: "number",
          isneed: true
        },
        {
          title: "类型",
          name: "kind",
          type: "select",
          selector: demoKind,
          rangeKey: "name",
          isneed: true
        },
        {
          title: "户型",
          name: "houseKind",
          type: "select",
          selector: houseKind,
          rangeKey: "name",
          isneed: true
        },
        {
          title: "风格",
          name: "style",
          type: "select",
          selector: roomStyle,
          rangeKey: "name",
          isneed: true
        }
      ],
      images: "",
      rooms: {}
    };
  }
  componentWillMount() {}
  onChange = (item, index, value) => {
    let { listdata } = this.state;
    if (item.type === "select") {
      const { detail } = value;
      listdata[index].value = item.selector[Number(detail.value)].value;
    } else if (item.type === "region") {
      listdata[index].value = value[value.length - 1].id;
    } else {
      listdata[index].value = value;
    }
    this.setState({ listdata });
  };
  onSubmit = () => {
    const { userinfo } = this.props.userReducer;
    const { listdata, rooms, images } = this.state;
    let postdata = {};
    for (var item of listdata) {
      if (!item.value && item.isneed) {
        let toast = item.type === "select" ? "请选择" : "请输入";
        Taro.atMessage({ message: `${toast}${item.title}`, type: "error" });
        return;
      } else {
        var temp = item.func ? item.func(item.value) : item.value;
        if (temp) {
          postdata[item.name] = temp;
        }
      }
    }
    if (!Number(postdata.area)) {
      Taro.atMessage({ message: `面积为纯数字`, type: "error" });
      return;
    }
    postdata.area = Number(postdata.area);
    const name = `${postdata.area}平${getNameByValue(
      roomStyle,
      postdata.style
    )}风格${getNameByValue(houseKind, postdata.houseKind)}`;
    postdata.name = name;
    if (!images) {
      Taro.atMessage({ message: `请上传封面`, type: "error" });
      return null;
    }
    postdata.images = images;
    const keys = Object.keys(rooms);
    if (keys.length > 0) {
      const array = [];
      keys.map(key => {
        const obj = {
          kind: Number(key),
          images: rooms[key]
        };
        array.push(obj);
      });
      postdata.rooms = array;
    }
    console.log(postdata);
    Taro.showLoading();
    this.props
      .postDemo(postdata)
      .then(res => {
        Taro.hideLoading();
        Taro.navigateBack();
        Taro.eventCenter.trigger("getUserDemoCreate");
      })
      .catch(err => {
        Taro.hideLoading();
        Taro.atMessage({ message: err.message, type: "error" });
      });
  };
  getRegionName = item => {
    if (item.type !== "region") {
      return null;
    }
    const { regions } = this.props.commonReducer;
    const name = getRegionNameById(item.value, regions);
    return name;
  };
  handleUpload = (id, images) => {
    const { rooms } = this.state;
    if (id === 0) {
      //上传默认案例
      this.setState({ images: images.join(",") });
    } else {
      rooms[id] = images.join(",");
      console.log(rooms);
      this.setState({ rooms });
    }
  };
  render() {
    const { usercarte } = this.props.userReducer;
    const { listdata, images, rooms } = this.state;
    const uploadconfig = { count: 9 };
    return (
      <BaseView>
        <AtForm>
          {listdata.map((item, index) => {
            const title = item.isneed ? `${item.title}*` : ` ${item.title}`;
            return item.type === "select" ? (
              <Picker
                onChange={this.onChange.bind(this, item, index)}
                key={item.name}
                rangeKey={item.rangeKey}
                range={item.selector}
              >
                <View className="inputpicker">
                  <View className="left">{title}</View>
                  {item.value ? (
                    <View className="right select">
                      {getNameByValue(item.selector, item.value)}
                    </View>
                  ) : (
                    <View className="right default">{`请选择${
                      item.title
                    }`}</View>
                  )}
                </View>
                {index + 1 < listdata.length && (
                  <HeightView height={3} color="#d6e4ef" />
                )}
              </Picker>
            ) : item.type === "region" ? (
              <PopRegion
                key={item.name}
                ref={ref => (this.PopRegion = ref)}
                onChange={this.onChange.bind(this, item, index)}
              >
                <View className="inputpicker">
                  <View className="left">{title}</View>
                  {item.value ? (
                    <View className="right select">
                      {this.getRegionName(item)}
                    </View>
                  ) : (
                    <View className="right default">{`请选择${
                      item.title
                    }`}</View>
                  )}
                </View>
                {index + 1 < listdata.length && (
                  <HeightView height={3} color="#d6e4ef" />
                )}
              </PopRegion>
            ) : (
              <AtInput
                value={item.value}
                onChange={this.onChange.bind(this, item, index)}
                key={item.name}
                name={item.name}
                title={title}
                type={item.type}
                placeholder={`请输入${item.title}`}
              />
            );
          })}
        </AtForm>

        <HeightView height={20} color="transparent" />
        <View className="paneltitle bg_white">
          <Text>上传封面(必选)</Text>
        </View>
        <View className="bg_white">
          <UploadFile
            prefix="wxd/"
            config={uploadconfig}
            onUpload={this.handleUpload.bind(this, 0)}
          >
            <View className="at-row imagesview">
              {images &&
                images.split(",").map((item, index) => {
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
        {roomKind &&
          roomKind.map(item => {
            const finditemimages = rooms[item.value];
            const subimages = finditemimages ? finditemimages.split(",") : [];
            return (
              <View key={item.value}>
                <View className="paneltitle bg_white">
                  <Text>{`上传${item.name}(选填)`}</Text>
                </View>
                <View className="bg_white">
                  <UploadFile
                    prefix="wxd/"
                    config={uploadconfig}
                    onUpload={this.handleUpload.bind(this, item.value)}
                  >
                    <View className="at-row imagesview">
                      {subimages.map((subitem, index) => {
                        return (
                          <ImageView
                            key={index}
                            baseclassname="add_img"
                            src={subitem}
                          />
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
              </View>
            );
          })}
        <HeightView height={100} color="transparent" />
        <AtButton className="button" type="primary" onClick={this.onSubmit}>
          提交
        </AtButton>
        <HeightView height={100} color="transparent" />
      </BaseView>
    );
  }
}
