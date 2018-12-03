import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import PropTypes from "prop-types";
import classNames from "classnames";

import FormidButton from "../FormidButton";

import { AtIcon, AtBadge, AtComponent } from "taro-ui";
import "./index.scss";

const objectToString = style => {
  if (style && typeof style === "object") {
    let styleStr = "";
    Object.keys(style).forEach(key => {
      const lowerCaseKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      styleStr += `${lowerCaseKey}:${style[key]};`;
    });
    return styleStr;
  } else if (style && typeof style === "string") {
    return style;
  }
  return "";
};

export default class AtTabBar extends Component {
  static defaultProps = {
    customStyle: "",
    className: "",
    fixed: false,
    backgroundColor: "#fff",
    current: 0,
    iconSize: "24",
    fontSize: "14",
    color: "#333",
    selectedColor: APP_COLOR_THEME,
    scroll: false,
    tabList: [],
    onClick: () => {}
  };

  static propTypes = {
    customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    fixed: PropTypes.bool,
    backgroundColor: PropTypes.string,
    current: PropTypes.number,
    iconSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    color: PropTypes.string,
    selectedColor: PropTypes.string,
    scroll: PropTypes.bool,
    tabList: PropTypes.array,
    onClick: PropTypes.func
  };

  constructor() {
    super(...arguments);
    this.state = {
      isIPhoneX: false
    };
  }
  mergeStyle(style1, style2) {
    return objectToString(style1) + objectToString(style2);
  }

  componentDidMount() {
    const curEnv = Taro.getEnv();
    // const model = Taro.getSystemInfoSync().model;
    // if (
    //   curEnv === Taro.ENV_TYPE.WEAPP &&
    //   model &&
    //   model.indexOf("iPhone X") >= 0
    // ) {
    //   this.setState({ isIPhoneX: true });
    // }
  }

  handleClick(i) {
    this.props.onClick(i, ...arguments);
  }

  render() {
    const {
      customStyle,
      className,
      fixed,
      backgroundColor,
      tabList,
      current,
      color,
      iconSize,
      fontSize,
      selectedColor
    } = this.props;
    const { isIPhoneX } = this.state;
    const defaultStyle = `color: ${color};`;
    const selectedStyle = `color: ${selectedColor};`;
    const titleStyle = `font-size: ${fontSize}px;`;
    const rootStyle = `background-color: ${backgroundColor};`;
    const buttonStyle = `width:${Taro.pxTransform(750 / 3)}`;
    return (
      <View
        className={classNames(
          {
            "at-tab-bar": true,
            "at-tab-bar--fixed": fixed,
            "at-tab-bar--ipx": isIPhoneX
          },
          className
        )}
        style={this.mergeStyle(rootStyle, customStyle)}
      >
        {tabList.map((item, i) => (
          <FormidButton
            key={item.title}
            basestyle={buttonStyle}
            onClick={this.handleClick.bind(this, i)}
          >
            <View
              className="at-tab-bar__item"
              style={current === i ? selectedStyle : defaultStyle}
            >
              {item.iconType ? (
                <AtBadge dot={!!item.dot} value={item.text} max={item.max}>
                  <View className="at-tab-bar__icon">
                    <AtIcon
                      prefixClass={item.iconPrefixClass}
                      value={
                        current === i && item.selectedIconType
                          ? item.selectedIconType
                          : item.iconType
                      }
                      size={iconSize}
                      color={current === i ? selectedColor : color}
                    />
                  </View>
                </AtBadge>
              ) : null}
              <View style={current === i ? selectedStyle : defaultStyle}>
                <AtBadge
                  dot={item.iconType ? false : !!item.dot}
                  value={item.iconType ? "" : item.text}
                  max={item.iconType ? "" : item.max}
                >
                  <View className="at-tab-bar__title" style={titleStyle}>
                    {item.title}
                  </View>
                </AtBadge>
              </View>
            </View>
          </FormidButton>
        ))}
      </View>
    );
  }
}
