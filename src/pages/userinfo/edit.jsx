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
import PopRegion, { getRegionNameById } from "../../components/PopRegion";
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
  return { userReducer: state.userReducer, commonReducer: state.commonReducer };
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
      listdata: [
        {
          title: "手机",
          name: "contactPhonenum",
          type: "phone",
          isneed: true
        },
        {
          title: "微信",
          name: "wechat",
          type: "text",
          isneed: true
        },
        {
          title: "姓名",
          name: "name",
          type: "text",
          isneed: true
        },
        {
          title: "身份",
          name: "careerKind",
          type: "select",
          selector: careerKind,
          rangeKey: "name",
          func: Number,
          isneed: true
        },
        {
          title: "区域",
          name: "regionId",
          type: "region",
          isneed: true
        },
        {
          title: "地址",
          name: "address",
          type: "text",
          isneed: true
        },
        {
          title: "公司",
          name: "corp",
          type: "text"
        },
        {
          title: "职位",
          name: "office",
          type: "text"
        }
      ],
      avatarUrl: ""
    };
  }
  config = {
    navigationBarTitleText: "编辑名片"
  };
  componentWillMount() {
    this.props.userReducer.usercarte = "";
  }
  componentDidMount() {
    const { userinfo } = this.props.userReducer;
    this.props.getUserCarte(userinfo.userId).then(({ value }) => {
      const { usercarte } = this.props.userReducer;
      const { listdata } = this.state;
      var list = JSON.parse(JSON.stringify(listdata));
      list.map(item => {
        if (item.name === "wechat") {
          item.value = usercarte.extra
            ? JSON.parse(usercarte.extra).wechat
            : "";
        } else {
          item.value = usercarte[item.name];
        }
      });
      this.setState({
        listdata: list,
        avatarUrl: usercarte.avatarUrl
      });
    });
  }
  onGetPhoneNumber = res => {
    const { detail } = res;
    const { encryptedData, iv, errMsg } = detail;
    const { listdata } = this.state;
    if (errMsg === "getPhoneNumber:ok") {
      this.props.putWxUserPhone({ encryptedData, iv }).then(res => {
        var list = JSON.parse(JSON.stringify(listdata));
        list.find(listitem => listitem.name === "contactPhonenum").value =
          res.value.phonenum;
        this.setState({ listdata: list });
      });
    }
  };
  onUpload = images => {
    this.setState({ avatarUrl: CDN_URL + images[0] });
  };
  onSubmit = () => {
    const { userinfo, usercarte } = this.props.userReducer;
    const { listdata } = this.state;
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
    if (postdata.wechat) {
      const newextra = Object.assign({}, JSON.parse(usercarte.extra), {
        wechat: postdata.wechat
      });
      postdata.extra = JSON.stringify(newextra);
      delete postdata.wechat;
    }
    postdata.avatarUrl = this.state.avatarUrl;
    Taro.showLoading();
    this.props
      .putUserCarte(postdata)
      .then(res => {
        Taro.eventCenter.trigger("getUserCarteDesc");
        Taro.eventCenter.trigger("getUserCarte");
        Taro.hideLoading();
        Taro.navigateBack();
      })
      .catch(err => {
        Taro.hideLoading();
      });
  };

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
  getTypeName = item => {
    const { selector } = item;
    if (!selector) return null;
    return selector.find(myitem => myitem.value === item.value).name;
  };
  getRegionName = item => {
    if (item.type !== "region") {
      return null;
    }
    const { regions } = this.props.commonReducer;
    const name = getRegionNameById(item.value, regions);
    return name;
  };
  render() {
    const { usercarte } = this.props.userReducer;
    const { listdata, avatarUrl } = this.state;

    const { regions } = this.props.commonReducer;

    let condition = false;
    if (usercarte && regions) {
    } else {
      condition = {
        state: "viewLoading"
      };
    }
    return (
      <BaseView condition={condition} baseclassname="bg_white">
        <AtMessage />
        <HeightView height={20} color="transparent" />
        <View className="">
          <UploadFile onUpload={this.onUpload}>
            <ImageView baseclassname="editheaderimg" src={avatarUrl} />
          </UploadFile>
        </View>
        <HeightView height={20} color="transparent" />
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
                      {this.getTypeName(item)}
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
              >
                {item.name === "contactPhonenum" && (
                  <AtButton
                    openType="getPhoneNumber"
                    onGetPhoneNumber={this.onGetPhoneNumber}
                    type="primary"
                    size="small"
                    style={`margin-right:${Taro.pxTransform(20)}`}
                  >
                    快速获取
                  </AtButton>
                )}
              </AtInput>
            );
          })}
        </AtForm>
        <HeightView height={100} color="transparent" />
        <FormidButton onClick={this.onSubmit}>
          <AtButton className="button" type="primary">
            提交
          </AtButton>
        </FormidButton>
        <HeightView height={100} color="transparent" />
      </BaseView>
    );
  }
}
