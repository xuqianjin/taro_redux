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
  AtMessage
} from "taro-ui";
import HeightView from "../../components/HeightView";
import BaseView from "../../components/BaseView";
import ImageView from "../../components/ImageView";
import UploadFile from "../../components/UploadFile";
import { gender, careerKind } from "../../components/Constant";

import {
  putUserCarte,
  putWxUserPhone,
  postWxFormId,
  postWxQrCode
} from "../../reducers/userReducer";

import "./style.scss";

const mapStateToProps = state => {
  return { userReducer: state.userReducer };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      putWxUserPhone,
      putUserCarte,
      postWxFormId,
      postWxQrCode
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
          title: "手机号码",
          name: "contactPhonenum",
          type: "phone",
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
      desc: "",
      avatarUrl: ""
    };
  }
  config = {
    navigationBarTitleText: "编辑名片"
  };
  componentWillMount() {}
  componentDidMount() {
    const { usercarte } = this.props.userReducer;
    const { listdata } = this.state;
    var list = JSON.parse(JSON.stringify(listdata));
    list.map(item => {
      item.value = usercarte[item.name];
    });
    this.setState({
      desc: usercarte.desc,
      listdata: list,
      avatarUrl: usercarte.avatarUrl
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
    this.setState({ avatarUrl: images[0] });
  };
  onSubmit = value => {
    const { detail } = value;
    this.props.postWxFormId(detail.formId);
    this.props.postWxQrCode('/pages/index')
    const { listdata, desc } = this.state;
    let postdata = {};
    for (var item of listdata) {
      if (!item.value && item.isneed) {
        let toast = item.type === "select" ? "请选择" : "请输入";
        Taro.atMessage({ message: `${toast}${item.title}`, type: "error" });
        return;
      } else {
        postdata[item.name] = item.func ? item.func(item.value) : item.value;
      }
    }

    postdata.desc = desc;
    postdata.avatarUrl = this.state.avatarUrl;
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

  onChange = (item, index, value) => {
    let { listdata } = this.state;
    if (item.type === "select") {
      const { detail } = value;
      listdata[index].value = item.selector[Number(detail.value)].value;
    } else {
      listdata[index].value = value;
    }
    this.setState({ listdata });
  };

  onDescChange = value => {
    const { detail } = value;
    this.setState({ desc: detail.value });
  };
  getTypeName = item => {
    const { selector } = item;
    if (!selector) return null;
    return selector.find(myitem => myitem.value === item.value).name;
  };
  render() {
    const { usercarte } = this.props.userReducer;
    const { listdata, avatarUrl, desc } = this.state;
    return (
      <BaseView baseclassname="bg_white">
        <AtMessage />
        <HeightView height={20} color="transparent" />
        <View className="headderbox">
          <UploadFile onUpload={this.onUpload}>
            <ImageView baseclassname="headerimg" src={avatarUrl} />
          </UploadFile>
        </View>
        <HeightView height={20} color="transparent" />
        <AtForm>
          {listdata.map((item, index) => {
            const title = item.isneed ? "*" + item.title : item.title;

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
                  <HeightView height={1} color="#d6e4ef" />
                )}
              </Picker>
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
        <HeightView height={50} color="transparent" />
        <AtForm onSubmit={this.onSubmit.bind(this)} reportSubmit={true}>
          <AtButton className="button" type="primary" formType="submit">
            提交
          </AtButton>
        </AtForm>
        <HeightView height={100} color="transparent" />
      </BaseView>
    );
  }
}
