import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import { Constants } from "./common/Index";

const secondbrainApps = require("../../amplify/backend/function/sbapigetallitems/src/constants");

class ShowNextButton extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <TouchableOpacity
        onPress={this._onShowNext}
        style={styles.show_next_container}
        activeOpacity={0.6}
      >
        <View style={styles.show_next_subcontainer}>
          <Image
            source={this._getIconForApp(this.props.appKey)}
            style={styles.show_next_icon}
            resizeMode="contain"
          />
          <Text style={styles.show_next_text}>Show next</Text>
        </View>
      </TouchableOpacity>
    );
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  _onShowNext = () => {
    this.props.onShowNextExcerpt();
  };

  _getIconForApp(appKey) {
    let showNextIcon;

    // NOTE: Add key for new apps
    switch (appKey) {
      case secondbrainApps.appKeys.sb:
        showNextIcon = require("../../assets/sb-show-next-icon.png");
        break;

      case secondbrainApps.appKeys.rmed:
        showNextIcon = require("../../assets/rmed-show-next-icon.png");
        break;

      case secondbrainApps.appKeys.ted:
        showNextIcon = require("../../assets/ted-show-next-icon.png");
        break;

      case secondbrainApps.appKeys.red:
        showNextIcon = require("../../assets/red-show-next-icon.png");
        break;

      default:
        showNextIcon = "";
        break;
    }

    return showNextIcon;
  }
}

/*---------------------------------------------------
    Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  show_next_container: {
    height: 50,
    width: 100,
    marginRight: 20
  },
  show_next_subcontainer: {
    flexDirection: "row"
  },
  show_next_icon: {
    width: 13,
    height: 13,
    marginRight: 3,
    top: 3,
    left: -2
  },
  show_next_text: {
    fontFamily: "overpass-light",
    fontSize: 15,
    color: Constants.baseColors.white
  }
});

/*---------------------------------------------------
    Exports
----------------------------------------------------*/
export { ShowNextButton };
