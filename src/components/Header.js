import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Constants as AppConstants } from "./common/Index";
import { DeviceInfoHelper, CustomizationHelper } from "../helpers/Index";

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    let headerLogo = CustomizationHelper.getHeaderLogoAndStyleForApp(
      this.props.appKey
    );
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
