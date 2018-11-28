import Taro, { Component } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
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
  static options = {
    addGlobalClass: true
  };
  static defaultProps = {};
  constructor(props) {
    super(props);
  }
  onSubmit = info => {
    console.log(info);
  };
  render() {
    return (
      <AtForm onSubmit={this.onSubmit.bind(this)} reportSubmit={true}>
        <AtButton className="formidbutton" type="primary" formType="submit">
          提交
        </AtButton>
      </AtForm>
    );
  }
}
