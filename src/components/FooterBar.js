import React from "react";
import { View, StyleSheet } from "react-native";
import { ShowNextButton, ShareButton, BrowseAllButton } from "./Index";
import { Constants as AppConstants } from "./common/Index";
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
          onPress={this.props.onShowNextExcerpt}
        />
        <BrowseAllButton
          appKey={this.props.appKey}
          onPress={this.props.onShowBrowseAll}
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
    paddingLeft: 40,
    paddingRight: 40
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
