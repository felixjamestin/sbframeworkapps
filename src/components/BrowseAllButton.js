import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import { Constants } from "./common/Index";
import { CustomizationHelper } from "../helpers/Index";

class BrowseAllButton extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <TouchableOpacity
        onPress={this._onPress}
        style={styles.container}
        activeOpacity={0.6}
      >
        <View style={styles.subcontainer}>
          <Image
            source={CustomizationHelper.getIconForApp(
              this.props.appKey,
              CustomizationHelper.customizationElements.browseAll
            )}
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.text}>Browse</Text>
        </View>
      </TouchableOpacity>
    );
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  _onPress = () => {
    this.props.onPress();
  };
}

/*---------------------------------------------------
    Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 100,
    marginRight: 0
  },
  subcontainer: {
    flexDirection: "row"
  },
  icon: {
    width: 11,
    height: 11,
    marginRight: 3,
    top: 5,
    left: -2
  },
  text: {
    fontFamily: "overpass-light",
    fontSize: 15,
    color: Constants.baseColors.white
  }
});

/*---------------------------------------------------
    Exports
----------------------------------------------------*/
export { BrowseAllButton };
