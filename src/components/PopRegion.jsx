import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import { View, Picker } from "@tarojs/components";

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
    this.state = {
      Children: []
    };
  }

  componentWillMount() {
    const { regions } = this.props.commonReducer;
    if (regions) {
      this.transReigon(regions);
    } else {
      this.props.getRegion().then(res => {
        this.transReigon(res.value);
      });
    }
  }
  transReigon = regions => {
    this.setState({ Children: regions[0].Children });
  };
  handleColumnChange = ({ detail }) => {
    const { regions } = this.props.commonReducer;
    if (detail.column == 0) {
      this.setState({ Children: regions[detail.value].Children });
    }
  };
  mapRegions = (regions, id) => {
    for (var province of regions) {
      if (province.id === id) {
        return province;
      }
      for (var city of province.Children) {
        if (city.id === id) {
          return [province, city];
        }
        for (var dist of city.Children) {
          if (dist.id === id) {
            return [province, city, dist];
          }
        }
      }
    }
  };
  getRegionNameById = id => {
    const { regions } = this.props.commonReducer;
    const value = this.mapRegions(regions, 140202);
    console.log(value);
    return "sss";
  };

  handleChange = ({ detail }) => {
    const { regions } = this.props.commonReducer;
    const { value } = detail;
    const province = regions[value[0]];
    const city = province.Children[value[1]];
    this.props.onChange && this.props.onChange(province, city);
  };

  render() {
    const { regions } = this.props.commonReducer;
    const { Children } = this.state;
    return (
      <View>
        <Picker
          range={[regions, Children]}
          rangeKey="name"
          mode="multiSelector"
          onChange={this.handleChange}
          onColumnchange={this.handleColumnChange}
        >
          {this.props.children}
        </Picker>
      </View>
    );
  }
}
