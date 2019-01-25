import React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated
} from "react-native";

import { Constants, ModalDialog } from "./common/Index";
import { CustomizationHelper, DeviceInfoHelper } from "../helpers/Index";
import { StorageService } from "../services/Index";

var screen = Dimensions.get("window");

class WelcomeModal extends React.Component {
  constructor(props) {
    super(props);

    this.localData = {
      isOpen: false,
      animationStagger: {
        values: [],
        animations: []
      }
    };

    this.localData.animationStagger = this._initializeAnimations();
  }

  /*--------------------------------------------------
  ⭑ Lifecycle events
  ----------------------------------------------------*/
  componentDidMount() {
    this._startStaggerAnimation();
  }

  /*--------------------------------------------------
  ⭑ Render UI
  ----------------------------------------------------*/
  render() {
    this._startStaggerAnimation();

    return (
      <ModalDialog
        style={{
          width: screen.width,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(34, 34, 34, .9)",
          opacity: 1
        }}
        isOpen={this._checkIfShouldAutoShowPage()}
        onOpen={this._onOpen}
        onClose={this._onClose}
        onClosingState={this._onClosingState}
        backdropPressToClose
        swipeToClose={false}
        position="bottom"
      >
        <View style={styles.container}>
          {this._renderBody()}
          {this._renderCloseButton()}
        </View>
      </ModalDialog>
    );
  }

  _renderBody = () => {
    const icon = CustomizationHelper.getIconForApp(
      this.props.appKey,
      CustomizationHelper.customizationElements.about
    );

    return (
      <View>
        <Animated.View
          style={[
            {
              opacity: this.localData.animationStagger.values[0]
            },
            styles.titleContainer
          ]}
        >
          <Image source={icon} style={styles.titleImage} resizeMode="contain" />
          <Text style={styles.title}>Thank you for using this app</Text>
        </Animated.View>
        <Animated.Text
          style={[
            {
              opacity: this.localData.animationStagger.values[1]
            },
            styles.body
          ]}
        >
          Before you start: The Tao Te Ching was written over 2500 years ago by
          Lao Tzu, a Chinese sage. Its message resonates so deeply that it's one
          of the most translated texts of all time.
        </Animated.Text>
        <Animated.Text
          style={[
            {
              opacity: this.localData.animationStagger.values[3]
            },
            styles.body
          ]}
        >
          However, many first-time readers often find the verses confusing. If
          so, do not worry; you’re not alone.
        </Animated.Text>
        <Animated.Text
          style={[
            {
              opacity: this.localData.animationStagger.values[3]
            },
            styles.body
          ]}
        >
          We recommend reading a few verses at a time and coming back regularly
          until the meaning is intuited – the daily reminders are especially
          helpful for this. Thanks & be well.
        </Animated.Text>
      </View>
    );
  };

  _renderCloseButton = () => {
    const icon = CustomizationHelper.getIconForApp(
      this.props.appKey,
      CustomizationHelper.customizationElements.proceed
    );

    const style = DeviceInfoHelper.isDeviceScreenFullBleed()
      ? styles.dismissModalContainer_large
      : styles.dismissModalContainer_small;

    return (
      <View style={style}>
        <TouchableOpacity
          onPress={this.props.onHide}
          style={styles.dismissModalButton}
          activeOpacity={0.6}
        >
          <Text style={styles.closeText}>Start using the app</Text>
          <Image source={icon} style={styles.icon} resizeMode="contain" />
        </TouchableOpacity>
      </View>
    );
  };

  /*--------------------------------------------------
  ⭑ Helpers
  ----------------------------------------------------*/
  _checkIfShouldAutoShowPage() {
    let shouldShowPageForApp = CustomizationHelper.shouldShowAboutPage(
      this.props.appKey
    );

    let shouldAutoPopupPageForApp = this._checkUserConfigForApp(
      this.props.appKey,
      this.props.userConfig
    );

    let openPage =
      shouldShowPageForApp === true &&
      (shouldAutoPopupPageForApp === true || this.props.isOpen === true)
        ? true
        : false;

    return openPage;
  }

  _checkUserConfigForApp(appKey, userConfig) {
    let shouldAutoPopupPageForApp = false;

    if (userConfig.welcomeShown === true) {
      shouldAutoPopupPageForApp = false;
    } else if (
      userConfig.welcomeShown === undefined ||
      userConfig.welcomeShown === null ||
      userConfig.welcomeShown === false
    ) {
      shouldAutoPopupPageForApp = true;
      this._updatePageAutoShownDetails(appKey, userConfig);
    }

    return shouldAutoPopupPageForApp;
  }

  _updatePageAutoShownDetails(appKey, userConfig) {
    let updatedUserConfig = userConfig;
    updatedUserConfig.welcomeShown = true;
    StorageService.storeConfigData(appKey, updatedUserConfig);
  }

  _onClose = () => {
    this.props.onHide();
  };

  _onOpen = () => {};

  _onClosingState = state => {};

  _startStaggerAnimation() {
    this._resetAnimations();
    Animated.stagger(20, this.localData.animationStagger.animations).start();
  }

  _initializeAnimations() {
    let animationStagger = { values: [], animations: [] };

    animationStagger.values[1] = new Animated.Value(0);
    animationStagger.values[2] = new Animated.Value(0);
    animationStagger.values[3] = new Animated.Value(0);

    animationStagger.animations = animationStagger.values.map(
      (value, index) => {
        return Animated.timing(animationStagger.values[index], {
          toValue: 1,
          delay: 300,
          duration: 500,
          useNativeDriver: true
        });
      }
    );

    return animationStagger;
  }

  _resetAnimations() {
    this.localData.animationStagger.animations.forEach((value, index) => {
      this.localData.animationStagger.values[index].setValue(0);
    });
  }
}

/*---------------------------------------------------
⭑ Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 40
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  },
  title: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-semibold",
    letterSpacing: 0.3,
    fontSize: 15,
    marginTop: 7,
    marginBottom: 50
  },
  body: {
    color: Constants.baseColors.white,
    marginBottom: 20,
    fontFamily: "overpass-light",
    fontSize: 14,
    lineHeight: 22,
    opacity: 1
  },
  dismissModalContainer_large: {
    height: 96
  },
  dismissModalContainer_small: {
    height: 70
  },
  dismissModalButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -5
  },
  closeText: {
    color: Constants.baseColors.white,
    textAlign: "center",
    letterSpacing: 0.3
  },
  titleImage: {
    width: 50,
    height: 50
  },
  icon: {
    width: 10,
    height: 10,
    marginLeft: 5,
    top: 1,
    left: 0
  }
});

/*---------------------------------------------------
⭑ Exports
----------------------------------------------------*/
export { WelcomeModal };
