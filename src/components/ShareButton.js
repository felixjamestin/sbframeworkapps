import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Share
} from "react-native";
import { Constants } from "./common/Index";
import { LogService } from "../services/Index";

const secondbrainApps = require("../../amplify/backend/function/sbapigetallitems/src/constants");

class ShareButton extends React.PureComponent {
  constructor(props) {
    super(props);

    // Bind methods
    this._onShare = this._onShare.bind(this);
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <TouchableOpacity
        onPress={this._onShare}
        style={styles.share_container}
        activeOpacity={0.6}
      >
        <View style={styles.share_subcontainer}>
          <Image
            source={this._getIconForApp(this.props.appKey)}
            style={styles.share_icon}
            resizeMode="contain"
          />
          <Text style={styles.share_text}>Share</Text>
        </View>
      </TouchableOpacity>
    );
  }

  /*--------------------------------------------------
    Helpers & Handlers
  ----------------------------------------------------*/
  async _onShare() {
    try {
      const result = await Share.share({
        message:
          "React Native | A framework for building native apps using React"
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared with no activity type
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      LogService.log(error.message);
    }
  }

  _getIconForApp(appKey) {
    let showNextIcon;

    switch (appKey) {
      case secondbrainApps.appKeys.sb:
        showNextIcon = require("../../assets/sb-share-icon.png");
        break;

      case secondbrainApps.appKeys.rmed:
        showNextIcon = require("../../assets/rmed-share-icon.png");
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
  share_container: {
    height: 50
  },
  share_subcontainer: {
    flexDirection: "row"
  },
  share_icon: {
    width: 13,
    height: 13,
    marginRight: 3,
    top: 3,
    left: -2
  },
  share_text: {
    fontFamily: "overpass-light",
    fontSize: 15,
    color: Constants.baseColors.white
  }
});

/*---------------------------------------------------
    Exports
----------------------------------------------------*/
export { ShareButton };
