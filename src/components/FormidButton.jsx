import Taro, { Component } from "@tarojs/taro";
import { View, Button, Form } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import {
  AtButton,
  AtInput,
  AtForm,
  Picker,
  AtTextarea,
  AtMessage
} from "taro-ui";
import { postWxFormId } from "../reducers/userReducer";

const mapStateToProps = state => {
  return { userReducer: state.userReducer };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      postWxFormId
    },
    dispatch
  );
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class extends Component {
  static externalClasses = ["baseclassname"];
  static defaultProps = {
    onClick: () => {}
  };
  constructor(props) {
    super(props);
  }
  onSubmit = value => {
    const { detail } = value;
    console.log(detail);
    this.props.postWxFormId(detail.formId);
  };
  render() {
    const { basestyle, onClick } = this.props;

    //  小程序bug兼容 https://nervjs.github.io/taro/docs/component-style.html
    var className = "baseclassname";
    if (process.env.TARO_ENV !== "weapp") {
      className = this.props.baseclassname;
    }
    return (
      <Form onSubmit={this.onSubmit.bind(this)} reportSubmit={true}>
        <Button
          className={className}
          style="border:0px;padding-left:0px;padding-right:0px;line-height:1;font-size:none"
          plain={true}
          formType="submit"
        >
          {this.props.children}
        </Button>
      </Form>
    );
  }
}
