import React, { PureComponent } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { LoadingState } from "./Index";

class BodyImage extends PureComponent {
  constructor(props) {
    super(props);

    // Initializations
    this.state = {
      isLoadingDone: false,
      opacity: new Animated.Value(0)
    };
  }

  /*--------------------------------------------------
  ⭑ Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <View style={this.getItemStyles()}>
        {this.checkAndShowLoader()}
        {this.renderImage(this.props.uri)}
      </View>
    );
  }

  checkAndShowLoader() {
    const loader = <LoadingState loadingText="Loading image" />;
    return this.state.isLoadingDone === false ? loader : null;
  }

  renderImage(uri) {
    const imageView = (
      <Animated.Image
        style={[
          {
            opacity: this.state.opacity,
            transform: [
              {
                scale: this.state.opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1]
                })
              }
            ]
          },
          styles.excerpt_image
        ]}
        source={{
          uri: uri
        }}
        resizeMode="contain"
        onLoadStart={this.handleLoadStart}
        onLoadEnd={this.handleLoadComplete}
        onLoad={this.onLoad}
      />
    );

    return uri !== "" ? imageView : null;
  }

  /*--------------------------------------------------
  ⭑ Helpers & Handlers
  ----------------------------------------------------*/
  getItemStyles() {
    let style;

    if (
      this.props.doesDescriptionExist === true &&
      this.props.doesContentExist === true
    ) {
      style = styles.container_excerpt_image_with_description_and_content;
    } else if (this.props.doesDescriptionExist) {
      style = styles.container_excerpt_image_with_description;
    } else {
      style = styles.container_excerpt_image_only;
    }

    return style;
  }

  handleLoadStart = () => {
    this.setState({ isLoadingDone: false });
  };

  handleLoadComplete = () => {
    this.setState({ isLoadingDone: true });
  };

  onLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  };
}

/*---------------------------------------------------
⭑ Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container_excerpt_image_with_description_and_content: {
    paddingTop: 0,
    paddingLeft: 17,
    paddingRight: 17
  },
  container_excerpt_image_with_description: {
    marginTop: -100,
    paddingTop: 0,
    paddingLeft: 17,
    paddingRight: 17
  },
  container_excerpt_image_only: {
    paddingTop: 30,
    paddingLeft: 15,
    paddingRight: 15
  },
  excerpt_image: {
    display: "flex",
    width: "100%",
    height: 400,
    marginLeft: 0,
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowColor: "black",
    shadowOffset: { height: 2, width: 0 },
    opacity: 1
  }
});

/*--------------------------------------------------
⭑ Export
----------------------------------------------------*/
export { BodyImage };
