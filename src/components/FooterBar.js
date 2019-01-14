import React from "react";
import { View, StyleSheet } from "react-native";
import { Constants } from "expo";
import { ShowNextButton, ShareButton } from "./Index";
import { Constants as AppConstants } from "./common/Index";
import { LogService } from "../services/Index";
import { DeviceInfoHelper } from "../helpers/Index";

class FooterBar extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    const style = this.getStyles();

    return this.props.showFixedFooterBar ? (
      <View style={style}>
        <ShowNextButton
          appKey={this.props.appKey}
          onShowNextExcerpt={this.props.onShowNextExcerpt}
        />
        <ShareButton
          appKey={this.props.appKey}
          currentItem={this.props.currentItem}
        />
      </View>
    ) : null;
  }

  /*--------------------------------------------------
    Helpers
  ----------------------------------------------------*/
  getStyles() {
    const style = DeviceInfoHelper.isDeviceScreenFullBleed()
      ? styles.container_large
      : styles.container_small;

    console.log(Constants.platform.ios.model); //TODO: Remove logging
    LogService.log(
      Constants.platform.ios.model,
      "Constants.platform.ios.model",
      "FooBar.js",
      LogService.loggingType.remote
    );

    return [styles.container, style];
  }
}

/*---------------------------------------------------
    Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: AppConstants.baseColors.whiteBorder,
    borderTopWidth: 1,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 42,
    paddingRight: 50
  },
  container_large: {
    height: 96
  },
  container_small: {
    height: 70,
    paddingTop: 20
  }
});

/*---------------------------------------------------
    Exports
----------------------------------------------------*/
export { FooterBar };
