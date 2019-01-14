import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Constants as AppConstants } from "./common/Index";
import { DeviceInfoHelper } from "../helpers/Index";

const secondbrainApps = require("../../amplify/backend/function/sbapigetallitems/src/constants");

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    let headerLogo = this._getHeaderImage();
    let headerStyle = this.getStyles();

    return (
      <View>
        <Image
          source={headerLogo.image}
          style={[headerStyle, headerLogo.style]}
          resizeMode="contain"
        />
        <View style={styles.seperator} />
      </View>
    );
  }

  /*--------------------------------------------------
  ⭑ Helpers & Handlers
----------------------------------------------------*/
  _getHeaderImage() {
    let headerLogo;
    switch (this.props.appKey) {
      // NOTE: Add key for new apps
      case secondbrainApps.appKeys.sb:
        headerLogo = {
          image: require("../../assets/sb-header_logo.png"),
          style: { width: 180 }
        };

        break;

      case secondbrainApps.appKeys.rmed:
        headerLogo = {
          image: require("../../assets/rmed-header_logo.png"),
          style: { width: 220 }
        };
        break;

      case secondbrainApps.appKeys.ted:
        headerLogo = {
          image: require("../../assets/ted-header_logo.png"),
          style: { width: 220 }
        };
        break;

      case secondbrainApps.appKeys.red:
        headerLogo = {
          image: require("../../assets/red-header_logo.png"),
          style: { width: 220 }
        };
        break;

      default:
        break;
    }

    return headerLogo;
  }

  getStyles() {
    const style = DeviceInfoHelper.isDeviceScreenFullBleed()
      ? styles.header_large
      : styles.header_small;

    return style;
  }
}

/*---------------------------------------------------
    Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  header_small: {
    flex: 1,
    alignSelf: "center",
    paddingTop: 80,
    paddingBottom: 0
  },
  header_large: {
    flex: 1,
    alignSelf: "center",
    paddingTop: 80,
    marginTop: 20
  },
  seperator: {
    backgroundColor: AppConstants.baseColors.whiteBorder,
    height: 0.5
  }
});

/*---------------------------------------------------
    Exports
----------------------------------------------------*/
export { Header };
