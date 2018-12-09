import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { bindActionCreators } from "redux";

import { View, Picker } from "@tarojs/components";

import { getRegion } from "../reducers/commonReducer";

export const mapRegions = (regions, id) => {
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
export const getRegionNameById = (id, provinces) => {
  const value = mapRegions(provinces, id);
  if (value) {
    const name = value.map(item => item.name).join(" ");
    return name + " ";
  }
};

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
    this.state = {};
    this.provinces = [];
    this.citys = [];
    this.dists = {};
    this.province = {};
    this.city = {};
    this.dist = {};
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
    this.provinces = regions;
    this.province = this.provinces[0];
    this.citys = this.province.Children;
    this.city = this.citys[0];
    this.dists = this.city.Children;
    this.dist = this.dists[0];
    this.forceUpdate();
  };
  handleColumnChange = ({ detail }) => {
    const { column, value } = detail;
    if (column == 0) {
      this.province = this.provinces[value];
      this.citys = this.province.Children;
      this.city = this.citys[0];
      this.dists = this.city.Children;
      this.dist = this.dists[0];
    } else if (column == 1) {
      this.city = this.citys[value];
      this.dists = this.city.Children;
      this.dist = this.dists[0];
    } else if (column == 2) {
      this.dist = this.dists[value];
    }
    this.forceUpdate();
  };

  handleChange = ({ detail }) => {
    const { province, city, dist } = this;
    this.props.onChange && this.props.onChange([province, city, dist]);
  };

  render() {
    const { provinces, citys, dists } = this;
    return (
      <View>
        <Picker
          range={[provinces, citys, dists]}
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
