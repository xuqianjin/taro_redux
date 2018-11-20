import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import { View } from "@tarojs/components";

import { getRegion } from "../reducers/commonReducer";

const mapStateToProps = state => {
  return { commonReducer: state.commonReducer };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getRegion
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
  }

  componentWillMount() {
    this.props.getRegion();
  }
  render() {
    return <View />;
  }
}
