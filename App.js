import React from "react";
import { StyleSheet, View, Animated } from "react-native";
import { Font, Notifications, Constants } from "expo";
import Amplify from "aws-amplify";
import {
  Header,
  Excerpt,
  BlankState,
  LoadingState,
  BrowseModal,
  RatingModal,
  WelcomeModal
} from "./src/components/Index";
import { Constants as AppConstants } from "./src/components/common/Index";
import {
  ArrayHelper,
  AnimationHelper,
  ReleaseHelper,
  CustomizationHelper,
  AnalyticsHelper
} from "./src/helpers/Index";
import { StorageService, UserService, LogService } from "./src/services/Index";
import config from "./aws-exports";

console.disableYellowBox = true;

Amplify.configure(config);

export default class App extends React.Component {
  constructor(props) {
    super(props);

    const channel = Constants.manifest.releaseChannel;
    const appKey = ReleaseHelper.getAppKeyFromExpoReleaseChannel(channel);

    this.localData = {
      appKey: appKey,
      fadeAnim: new Animated.Value(0)
    };

    this.state = {
      dataSource: [],
      currentItem: {},
      userConfig: {},
      isDataLoadingDone: false,
      isFontLoadingDone: false,
      isInitializationDone: false,
      showBrowseAll: false,
      showWelcomeModal: false
    };

    // Bindings
    this._handleShowNextExcerpt = this._handleShowNextExcerpt.bind(this);
    this._handleShowBrowseAll = this._handleShowBrowseAll.bind(this);
    this._handleHideBrowseAll = this._handleHideBrowseAll.bind(this);
    this._handleHideWelcomeModal = this._handleHideWelcomeModal.bind(this);
    this._handleNotification = this._handleNotification.bind(this);
    this._handleShowSelectedItem = this._handleShowSelectedItem.bind(this);
  }

  /*--------------------------------------------------
  ⭑ Lifecycle events
  ----------------------------------------------------*/
  componentDidMount() {
    this._initializeUser();
    this._initializeEntries(this.localData.appKey);
    this._initializeFonts();
    this._initializeAnalytics(this.localData.appKey);

    Notifications.addListener(this._handleNotification);
    AnimationHelper._startFadeInAnimation(this.localData.fadeAnim);
  }

  /*--------------------------------------------------
  ⭑ Render UI
  ----------------------------------------------------*/
  render() {
    return <View style={styles.wrapper}>{this.getViewForRender()}</View>;
  }

  getViewForRender() {
    const finalView = this._checkIfAppLoadingInProgress()
      ? this.renderWhenLoading()
      : this._checkIfNoEntries()
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
        <Header appKey={this.localData.appKey} />
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
        <Header appKey={this.localData.appKey} />
        <Excerpt
          item={item}
          itemIndex={itemIndex}
          onShowNextExcerpt={this._handleShowNextExcerpt}
          onShowBrowseAll={this._handleShowBrowseAll}
          appKey={this.localData.appKey}
          fadeAnim={this.localData.fadeAnim}
          springAnim={this.localData.springAnim}
        />
        <BrowseModal
          appKey={this.localData.appKey}
          items={this.state.dataSource}
          currentItem={item}
          isOpen={this.state.showBrowseAll}
          onHide={this._handleHideBrowseAll}
          onPress={this._handleShowSelectedItem}
        />
        <RatingModal
          appKey={this.localData.appKey}
          userConfig={this.state.userConfig}
        />
        <WelcomeModal
          appKey={this.localData.appKey}
          userConfig={this.state.userConfig}
          isOpen={this.state.showWelcomeModal}
          onHide={this._handleHideWelcomeModal}
        />
      </View>
    );
  }

  /*--------------------------------------------------
  ⭑ Helpers & Handlers
  ----------------------------------------------------*/
  _checkIfAppLoadingInProgress() {
    const isAppLoadingInProgress =
      this.state.isDataLoadingDone === false ||
      this.state.isFontLoadingDone === false;

    return isAppLoadingInProgress;
  }

  _checkIfNoEntries() {
    const isDataEmpty = !this.state.dataSource;
    return isDataEmpty;
  }

  _handleShowNextExcerpt() {
    const item =
      CustomizationHelper.getConfig(this.localData.appKey).showNextBehaviour ===
      CustomizationHelper.showNextBehaviour.random
        ? this._getRandomItem()
        : this._getNextSequentialItem();

    this.setState({
      currentItem: item
    });

    AnimationHelper._startFadeOutAndFadeInAnimation(this.localData.fadeAnim);
    AnalyticsHelper.trackEvent(
      this.localData.appKey,
      AnalyticsHelper.eventEnum().showNext
    );
  }

  _handleShowSelectedItem(selectedItemID) {
    const selectedItem = this.state.dataSource.find(item => {
      return item.id === selectedItemID ? true : false;
    });

    this.setState({
      currentItem: selectedItem,
      showBrowseAll: false
    });

    AnimationHelper._startFadeOutAndFadeInAnimation(this.localData.fadeAnim);
  }

  _handleShowBrowseAll() {
    this.setState({ showBrowseAll: true });
    AnalyticsHelper.trackEvent(
      this.localData.appKey,
      AnalyticsHelper.eventEnum().browseAll
    );
  }

  _handleHideBrowseAll() {
    this.setState({ showBrowseAll: false });
  }

  _handleHideWelcomeModal() {
    this.setState({ showWelcomeModal: false });
  }

  _getRandomItem(dataSource = this.state.dataSource) {
    return ArrayHelper._getRandomItemFromArray(dataSource);
  }

  _getNextSequentialItem(
    dataSource = this.state.dataSource,
    currentItem = this.state.currentItem
  ) {
    const currentIndex = dataSource.findIndex((value, index) => {
      return value.id === currentItem.id ? true : false;
    });

    let nextIndex = currentIndex + 1;
    if (nextIndex === dataSource.length) nextIndex = 0;

    return dataSource[nextIndex];
  }

  async _handleNotification(notification) {
    let entryID = notification.data.id
      ? notification.data.id
      : this.props.exp.notification
      ? this.props.exp.notification.data.id
      : "";

    this._initializeEntries(this.localData.appKey, entryID);

    AnalyticsHelper.trackEvent(
      this.localData.appKey,
      AnalyticsHelper.eventEnum().appOpenFromNotification
    );
  }

  async _initializeEntries(appKey, id = "") {
    try {
      if (this._checkIfAllowInitialization(id) === true) return;

      // Fetch entries
      const items = await StorageService.fetchData(appKey, id);

      // Set internal state
      let dataSource = items ? items.allItems : "";
      let currentItem = items ? items.currentItem : "";
      this.setState({
        isDataLoadingDone: true,
        isInitializationDone: true,
        dataSource: dataSource,
        currentItem: currentItem
      });
    } catch (error) {
      LogService.log(
        error.name + ": " + error.message,
        "error",
        "_fetchEntries",
        LogService.loggingType.remote
      );
    }
  }

  _checkIfAllowInitialization(id) {
    return id !== "" || this.state.isInitializationDone === false
      ? true
      : false;
  }

  async _initializeUser() {
    let userConfig = await this._fetchUserConfig(this.localData.appKey);
    await UserService.registerUser(this.localData.appKey, userConfig);
  }

  async _fetchUserConfig(appKey) {
    try {
      let config = await StorageService.fetchConfigData(appKey);
      this.setState({ userConfig: config });
      return config;
    } catch (error) {
      LogService.log(error.name + ": " + error.message);
    }
  }

  async _initializeFonts() {
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

  _initializeAnalytics(appKey) {
    AnalyticsHelper.initialize(appKey);
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
