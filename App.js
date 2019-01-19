import React from "react";
import { StyleSheet, View, Animated, Text } from "react-native";
import { Font, Notifications, Constants } from "expo";
import Amplify from "aws-amplify";
import {
  Header,
  Excerpt,
  BlankState,
  LoadingState,
  BrowseModal,
  RatingModal,
  AnalyticsHelper
} from "./src/components/Index";
import { Constants as AppConstants } from "./src/components/common/Index";
import { ArrayHelper, AnimationHelper } from "./src/helpers/Index";
import { StorageService, UserService, LogService } from "./src/services/Index";
import config from "./aws-exports";

console.disableYellowBox = true;
const secondbrainApps = require("./amplify/backend/function/sbapigetallitems/src/constants");

Amplify.configure(config);

export default class App extends React.Component {
  constructor(props) {
    super(props);

    // Initializations
    this.appKey = this.getAppKeyFromExpoReleaseChannel(
      Constants.manifest.releaseChannel
    );

    this.state = {
      dataSource: [],
      currentItem: {},
      isDataLoadingDone: false,
      isFontLoadingDone: false,
      showBrowseAll: false
    };

    this.localData = {
      fadeAnim: new Animated.Value(0),
      userDetails: {}
    };

    // Bindings
    this.handleShowNextExcerpt = this.handleShowNextExcerpt.bind(this);
    this.handleShowBrowseAll = this.handleShowBrowseAll.bind(this);
    this.handleHideBrowseAll = this.handleHideBrowseAll.bind(this);
    this.handleNotification = this.handleNotification.bind(this);
    this.handleShowSelectedItem = this.handleShowSelectedItem.bind(this);
  }

  /*--------------------------------------------------
  ⭑ Lifecycle events
  ----------------------------------------------------*/
  componentDidMount() {
    this._initializeUser();

    Notifications.addListener(this.handleNotification);
    this.loadFonts();
    AnalyticsHelper.trackEvent(AnalyticsHelper.eventEnum().appOpen);

    this.fetchEntries(this.appKey);
    AnimationHelper._startFadeInAnimation(this.localData.fadeAnim);
  }

  /*--------------------------------------------------
  ⭑ Render UI
  ----------------------------------------------------*/
  render() {
    return <View style={styles.wrapper}>{this.getViewForRender()}</View>;
  }

  getViewForRender() {
    const finalView = this.checkIfAppLoadingInProgress()
      ? this.renderWhenLoading()
      : this.checkIfNoEntries()
      ? this.renderWhenEmpty()
      : this.renderWhenItemsExist();

    return finalView;
  }

  renderWhenLoading() {
    return <LoadingState />;
  }

  renderWhenEmpty() {
    return (
      <View style={styles.container}>
        <Header appKey={this.appKey} />
        <BlankState />
      </View>
    );
  }

  renderWhenItemsExist() {
    const item = this.state.currentItem;
    const itemIndex = this.state.dataSource.findIndex(element => {
      return element.id === item.id ? true : false;
    });

    return (
      <View style={styles.container}>
        <Header appKey={this.appKey} />
        <Excerpt
          item={item}
          itemIndex={itemIndex}
          onShowNextExcerpt={this.handleShowNextExcerpt}
          onShowBrowseAll={this.handleShowBrowseAll}
          appKey={this.appKey}
          fadeAnim={this.localData.fadeAnim}
          springAnim={this.localData.springAnim}
        />
        <BrowseModal
          appKey={this.appKey}
          items={this.state.dataSource}
          currentItem={item}
          isOpen={this.state.showBrowseAll}
          onHide={this.handleHideBrowseAll}
          onPress={this.handleShowSelectedItem}
        />
        <RatingModal
          appKey={this.appKey}
          userDetails={this.localData.userDetails}
        />
      </View>
    );
  }

  /*--------------------------------------------------
  ⭑ Helpers & Handlers
  ----------------------------------------------------*/
  _initializeUser() {
    UserService.registerAndGetUserDetails(this.appKey);
  }

  checkIfAppLoadingInProgress() {
    const isAppLoadingInProgress =
      this.state.isDataLoadingDone === false ||
      this.state.isFontLoadingDone === false;

    return isAppLoadingInProgress;
  }

  checkIfNoEntries() {
    const isDataEmpty = !this.state.dataSource;
    return isDataEmpty;
  }

  handleShowNextExcerpt() {
    const item = this.getRandomItem();
    this.setState({
      currentItem: item
    });

    AnimationHelper._startFadeOutAndFadeInAnimation(this.localData.fadeAnim);
    AnalyticsHelper.trackEvent(AnalyticsHelper.eventEnum().showNext);
  }

  handleShowSelectedItem(selectedItemID) {
    const selectedItem = this.state.dataSource.find(item => {
      return item.id === selectedItemID ? true : false;
    });

    this.setState({
      currentItem: selectedItem,
      showBrowseAll: false
    });

    AnimationHelper._startFadeOutAndFadeInAnimation(this.localData.fadeAnim);
  }

  handleShowBrowseAll() {
    this.setState({ showBrowseAll: true });
  }

  handleHideBrowseAll() {
    this.setState({ showBrowseAll: false });
  }

  getRandomItem(dataSource = this.state.dataSource) {
    return ArrayHelper.getRandomItemFromArray(dataSource);
  }

  getAppKeyFromExpoReleaseChannel(channel) {
    const releaseChannel = channel || "default";

    let appKey;
    switch (releaseChannel) {
      case "default":
        appKey = secondbrainApps.appKeys.sb;
        break;

      case "sb-staging":
      case "sb-prod":
        appKey = secondbrainApps.appKeys.sb;
        break;

      case "rmed-staging":
      case "rmed-prod":
        appKey = secondbrainApps.appKeys.rmed;
        break;

      case "ted-staging":
      case "ted-prod":
        appKey = secondbrainApps.appKeys.ted;
        break;

      default:
        break;
    }

    return appKey;
  }

  async handleNotification(notification) {
    let entryID = notification.data.id
      ? notification.data.id
      : this.props.exp.notification
      ? this.props.exp.notification.data.id
      : "";

    this.fetchEntries(this.appKey, entryID);
  }

  async fetchEntries(appKey, id = "") {
    try {
      const items = await StorageService.fetchData(appKey, id);

      // Set internal state
      let dataSource = items ? items.allItems : "";
      let currentItem = items ? items.currentItem : "";
      this.setState({
        isDataLoadingDone: true,
        dataSource: dataSource,
        currentItem: currentItem
      });
    } catch (error) {
      LogService.log(
        error.name + ": " + error.message,
        "error",
        "fetchEntries",
        LogService.loggingType.remote
      );
    }
  }

  async loadFonts() {
    await Font.loadAsync({
      "overpass-thin": require("./assets/fonts/overpass-thin.ttf"),
      "overpass-light": require("./assets/fonts/overpass-light.ttf"),
      "overpass-regular": require("./assets/fonts/overpass-regular.ttf"),
      "overpass-semibold": require("./assets/fonts/overpass-semibold.ttf"),
      "roboto-thin": require("./assets/fonts/roboto-thin.ttf")
    });

    this.setState({
      isFontLoadingDone: true
    });
  }
}

/*---------------------------------------------------
⭑ Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: AppConstants.baseColors.darkGrey
  },
  container: {
    flex: 1,
    justifyContent: "flex-start"
  }
});
