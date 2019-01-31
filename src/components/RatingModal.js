import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking
} from "react-native";
import { StoreReview } from "expo";
import { Constants, ModalDialog } from "./common/Index";
import { StorageService } from "../services/StorageService";
import { CustomizationHelper, AnalyticsHelper } from "../helpers/Index";

const pages = {
  checkIfLikingApp: 1,
  askToRate: 2,
  askForFeedback: 3
};
const ratingSequence = [3, 7, 21, 42, 84, 120];
const maxShowCount = ratingSequence.length;

class RatingModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      currentPage: pages.checkIfLikingApp
    };

    this.localData = {
      noOfDaysUsed: 0
    };
  }

  /*--------------------------------------------------
  ⭑ Lifecycle events
  ----------------------------------------------------*/
  componentDidMount() {
    this._checkAndShowRatingsPrompt(this.props.appKey, this.props.userConfig);
  }

  /*--------------------------------------------------
  ⭑ Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <ModalDialog
        style={{
          width: 336,
          height: 370,
          backgroundColor: "rgba(34, 34, 34, .95)"
        }}
        position="center"
        isOpen={this.state.isOpen}
        backdrop
        backdropOpacity={0.9}
        backdropColor="black"
        backdropPressToClose={false}
        swipeToClose={false}
      >
        <View style={styles.container}>
          {this._renderContent(this.state.currentPage)}
          {this._renderActions(this.state.currentPage)}
        </View>
      </ModalDialog>
    );
  }

  _renderContent = currentPage => {
    let title, description, image;

    const daysUsedSoFar = this._getDaysBetweenEpochs(
      this.props.userConfig.appFirstOpened,
      Date.now()
    );

    const containerStyle = {
      backgroundColor: CustomizationHelper.getPrimaryColorForApp(
        this.props.appKey
      )
    };

    let backButtonStyle;
    if (currentPage === pages.checkIfLikingApp) {
      title = "Liking your app experience?";
      description = `You’ve received ${daysUsedSoFar} daily nudges on this app. We hope it’s made your day just a little brighter :)`;
      image = require("../../assets/smiley_normal.png");
      backButtonStyle = styles.backButtonStyleHide;
    } else if (currentPage === pages.askToRate) {
      title = "Super! Would you mind giving us a rating?";
      description =
        "Thanks in advance. Your feedback encourages us to keep making great products.";
      image = require("../../assets/smiley_excited.png");
      backButtonStyle = styles.backButtonStyleShow;
    } else if (currentPage === pages.askForFeedback) {
      title = "Ack! Life's too short to use apps you don't like";
      description =
        "Could you let us know what’s wrong. We read every email we get";
      image = require("../../assets/smiley_sad.png");
      backButtonStyle = styles.backButtonStyleShow;
    }

    return (
      <View style={[styles.contentContainer, containerStyle]}>
        <TouchableOpacity
          onPress={this._onBack}
          style={backButtonStyle}
          activeOpacity={0.6}
        >
          <Text style={styles.backActionText}>{"< Back"}</Text>
        </TouchableOpacity>

        <View style={styles.contentTitleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Image source={image} style={styles.smiley} resizeMode="contain" />
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
    );
  };

  _renderActions = currentPage => {
    let onPressActionLeftButton,
      onPressActionRightButton,
      ActionLeftButtonCopy,
      ActionRightButtonCopy;

    const actionPrimaryStyle = {
      color: CustomizationHelper.getPrimaryColorForApp(this.props.appKey),
      fontFamily: "overpass-semibold"
    };

    if (currentPage === pages.checkIfLikingApp) {
      onPressActionLeftButton = this._onPressExit;
      onPressActionRightButton = this._onPressProceed;
      ActionLeftButtonCopy = "No, I don’t";
      ActionRightButtonCopy = "Yes, I like the app";
    } else if (currentPage === pages.askToRate) {
      onPressActionLeftButton = this._onPressSkip;
      onPressActionRightButton = this._onPressRateNow;
      ActionLeftButtonCopy = "Skip for now";
      ActionRightButtonCopy = "Sure, happy to!";
    } else if (currentPage === pages.askForFeedback) {
      onPressActionLeftButton = this._onPressNotHappyButNevermind;
      onPressActionRightButton = this._onPressNotHappyAndGetFeedback;
      ActionLeftButtonCopy = "Nevermind";
      ActionRightButtonCopy = "Send feedback";
    }

    return (
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={onPressActionLeftButton}
          style={styles.actionButton}
          activeOpacity={0.6}
        >
          <Text style={styles.actionText}>{ActionLeftButtonCopy}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPressActionRightButton}
          style={[styles.actionButton, styles.actionButtonSeperator]}
          activeOpacity={0.6}
        >
          <Text style={[styles.actionText, actionPrimaryStyle]}>
            {ActionRightButtonCopy}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  /*--------------------------------------------------
  ⭑ Helpers
  ----------------------------------------------------*/
  _checkAndShowRatingsPrompt(appKey, userConfig) {
    if (this._ratingDisplayCompleted(userConfig, maxShowCount) == true) return;

    let shouldShowPrompt = this._checkTimeToShowPrompt(
      userConfig,
      ratingSequence
    );
    if (shouldShowPrompt === false) return;

    let updatedUserConfig = userConfig;
    updatedUserConfig.ratingShownCount = userConfig.ratingShownCount + 1;
    this._updateUserRatingsDetails(appKey, updatedUserConfig);

    this.setState({
      isOpen: true
    });

    AnalyticsHelper.trackEvent(
      this.props.appKey,
      AnalyticsHelper.eventEnum().ratingScreenAskIfLiked
    );
  }

  _onBack = () => {
    this.setState({
      currentPage: pages.checkIfLikingApp
    });
  };

  _onPressExit = () => {
    this.setState({
      currentPage: pages.askForFeedback
    });

    AnalyticsHelper.trackEvent(
      this.props.appKey,
      AnalyticsHelper.eventEnum().ratingScreenAskIfLikedNo
    );
  };

  _onPressProceed = () => {
    this.setState({
      currentPage: pages.askToRate
    });

    AnalyticsHelper.trackEvent(
      this.props.appKey,
      AnalyticsHelper.eventEnum().ratingScreenAskIfLikedYes
    );
  };

  _onPressSkip = () => {
    this.setState({
      isOpen: false
    });

    AnalyticsHelper.trackEvent(
      this.props.appKey,
      AnalyticsHelper.eventEnum().ratingScreenAskForRatingSkip
    );
  };

  _onPressRateNow = () => {
    StoreReview.requestReview();

    this.setState({
      isOpen: false
    });

    let updatedUserConfig = this.props.userConfig;
    updatedUserConfig.ratingCompleted = true;
    this._updateUserRatingsDetails(this.props.appKey, updatedUserConfig);

    AnalyticsHelper.trackEvent(
      this.props.appKey,
      AnalyticsHelper.eventEnum().ratingScreenAskForRatingYes
    );
  };

  _onPressNotHappyButNevermind = () => {
    this.setState({
      isOpen: false
    });

    AnalyticsHelper.trackEvent(
      this.props.appKey,
      AnalyticsHelper.eventEnum().ratingScreenFeedbackNo
    );
  };

  _onPressNotHappyAndGetFeedback = () => {
    Linking.openURL("mailto: felixjamestin@gmail.com");

    this.setState({
      isOpen: false
    });

    AnalyticsHelper.trackEvent(
      this.props.appKey,
      AnalyticsHelper.eventEnum().ratingScreenFeedbackYesViaEmail
    );
  };

  _checkTimeToShowPrompt(userConfig, ratingSequence) {
    const noOfDaysSinceAppFirstOpen = this._getDaysBetweenEpochs(
      userConfig.appFirstOpened,
      Date.now()
    );

    const ratingSequenceStart = ratingSequence[userConfig.ratingShownCount];
    let shouldShowPrompt =
      noOfDaysSinceAppFirstOpen >= ratingSequenceStart ? true : false;

    return shouldShowPrompt;
  }

  _getDaysBetweenEpochs(firstEpoch, secondEpoch) {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((secondEpoch - firstEpoch) / millisecondsPerDay);
  }

  _updateUserRatingsDetails(appKey, userConfig) {
    StorageService.storeConfigData(appKey, userConfig);
  }

  _ratingDisplayCompleted(userConfig, maxShowCount) {
    return (
      userConfig.ratingCompleted === true ||
      userConfig.ratingShownCount >= maxShowCount
    );
  }
}

/*---------------------------------------------------
⭑ Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "flex-start",
    borderRadius: 5
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingHorizontal: 22,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4
  },
  contentTitleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    paddingTop: 70,
    paddingBottom: 10
  },
  title: {
    flex: 1,
    color: Constants.baseColors.white,
    textAlign: "left",
    fontFamily: "overpass-regular",
    fontSize: 24
  },
  smiley: {
    width: 70,
    height: 70,
    marginLeft: 20
  },
  description: {
    color: Constants.baseColors.white,
    textAlign: "left",
    fontFamily: "overpass-light",
    fontSize: 13,
    width: "70%",
    lineHeight: 18
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 70,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: Constants.baseColors.white
  },
  backButtonStyleHide: { width: 0, height: 0 },
  backButtonStyleShow: {
    width: 200,
    height: 20,
    top: 25,
    left: 22,
    position: "absolute",
    zIndex: 999
  },
  backActionText: {
    color: Constants.baseColors.white,
    textAlign: "left",
    fontFamily: "overpass-regular",
    fontSize: 13
  },
  actionButton: {
    flex: 1,
    justifyContent: "center"
  },
  actionButtonSeperator: {
    borderLeftWidth: 1,
    borderColor: Constants.baseColors.lightGrey
  },
  actionText: {
    color: Constants.baseColors.darkGrey,
    fontFamily: "overpass-regular",
    textAlign: "center"
  }
});

/*---------------------------------------------------
⭑ Exports
----------------------------------------------------*/
export { RatingModal };
