import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Share
} from "react-native";
import { Constants } from "expo";
import { Constants as AppConstants } from "./common/Index";
import { StringHelper } from "../helpers/Index";
import { LogService } from "../services/Index";

const secondbrainApps = require("../../amplify/backend/function/sbapigetallitems/src/constants");

class ShareButton extends React.PureComponent {
  constructor(props) {
    super(props);
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
  _onShare = async () => {
    try {
      let item = this.props.currentItem.fields;
      let author = StringHelper.convertToCamelCase(item.author);
      let body = StringHelper.convertToSentenceCase(item.extract);
      let url = item.image !== undefined ? item.image[0].url : "";
      let message = author + ":" + "\n" + "\n" + body;
      let title = "";

      if (
        this.props.currentItem.fields.extract === undefined ||
        this.props.currentItem.fields.extract === "-"
      ) {
        message = "";
      }

      console.log(this.props.currentItem.fields.extract);

      const result = await Share.share(
        {
          message: message,
          title: title,
          url: url
        },
        {
          tintColor: Constants.manifest.tintColor,
          excludedActivityTypes: [
            "com.apple.UIKit.activity.Print",
            "com.apple.UIKit.activity.AssignToContact",
            "com.apple.UIKit.activity.AddToReadingList",
            "com.apple.UIKit.activity.AirDrop",
            "com.apple.UIKit.activity.OpenInIBooks",
            "com.apple.UIKit.activity.MarkupAsPDF",
            "com.apple.reminders.RemindersEditorExtension", //Reminders
            "com.apple.mobilenotes.SharingExtension", // Notes
            "com.apple.mobileslideshow.StreamShareService" // iCloud Photo Sharing - This also does nothing :{
          ]
        }
      );

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
  };

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
    color: AppConstants.baseColors.white
  }
});

/*---------------------------------------------------
    Exports
----------------------------------------------------*/
export { ShareButton };
