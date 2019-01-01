import Taro, { Component } from "@tarojs/taro";
import { View, Swiper, SwiperItem } from "@tarojs/components";
import { AtIcon } from "taro-ui";

import ImageView from "../../components/ImageView";

import "./style.scss";
export default class extends Component {
  static options = {
    addGlobalClass: true
  };
  static defaultProps = {
    item: { images: "" },
    onClick: () => {}
  };
  constructor(props) {
    super(props);
  }

  render() {
    const { item, showChoose, isChoose, onClick } = this.props;
    const themecolor = APP_COLOR_THEME;
    return (
      <View className="demoitem">
        <View className="content opacity" onClick={onClick}>
          <Swiper circular={true} autoplay={true}>
            {item &&
              item.images &&
              item.images.split(",").map((image, index) => {
                return (
                  <SwiperItem key={index} style='border-radius:6rpx'>
                    <ImageView baseclassname="image" src={image} />
                  </SwiperItem>
                );
              })}
          </Swiper>
          <View className="name">
            {showChoose && (
              <AtIcon value={isChoose ? "star-2" : "star"} color={themecolor} />
            )}
            {item.name}
          </View>
        </View>
      </View>
    );
  }
}
