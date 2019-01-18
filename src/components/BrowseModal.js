import React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList
} from "react-native";

import { Constants, ModalDialog } from "./common/Index";
import {
  CustomizationHelper,
  StringHelper,
  DeviceInfoHelper
} from "../helpers/Index";

var screen = Dimensions.get("window");

class BrowseModal extends React.Component {
  constructor(props) {
    super(props);
  }

  /*--------------------------------------------------
  ⭑ Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <ModalDialog
        isOpen={this.props.isOpen}
        backgroundColor="rgba(34, 34, 34, .95)"
        width={screen.width}
        onOpen={this._onOpen}
        onClose={this._onClose}
        onClosingState={this._onClosingState}
        backdropPressToClose
        swipeToClose={false}
      >
        <View style={styles.container}>
          {this._renderSectionLinksGrid()}
          {this._renderCloseButton()}
        </View>
      </ModalDialog>
    );
  }

  _renderSectionLinksGrid = () => {
    return (
      <FlatList
        data={this._getSectionsForDisplay()}
        renderItem={this._renderItem}
        contentContainerStyle={styles.sectionLinkContainer}
        numColumns={3}
        keyExtractor={(item, index) => index}
      />
    );
  };

  _renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          this._onSectionTap(item);
        }}
      >
        <Text style={this._getStyleForSectionLink(item)}>
          {item.displayIndex}
        </Text>
        <Text style={this._getStyleForSectionLinkSelectedBadge(item)}>
          Selected
        </Text>
      </TouchableOpacity>
    );
  };

  _renderCloseButton = () => {
    const icon = CustomizationHelper.getIconForApp(
      this.props.appKey,
      CustomizationHelper.customizationElements.close
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
          <Image source={icon} style={styles.icon} resizeMode="contain" />
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  };

  /*--------------------------------------------------
  ⭑ Helpers
  ----------------------------------------------------*/
  _onClose = () => {
    console.log("Modal just closed");
    this.props.onHide();
  };

  _onOpen = () => {
    console.log("Modal just opened");
  };

  _onClosingState = state => {
    console.log("The open/close of the swipeToClose just changed: " + state);
  };

  _getSectionsForDisplay() {
    let sections = [];
    let index = 1;
    this.props.items.forEach(item => {
      sections.push({
        id: item.id,
        displayIndex: index
      });
      index = index + 1;
    });

    return sections;
  }

  _onSectionTap(item) {
    this.props.onPress(item.id);
  }

  _getStyleForSectionLink(item) {
    const textColor = this._isSectionLinkForCurrentlyShownItem(item)
      ? CustomizationHelper.getHighlightColorForApp(this.props.appKey)
      : CustomizationHelper.getPrimaryColorForApp(this.props.appKey);

    return [styles.sectionLinkText, { color: textColor }];
  }

  _getStyleForSectionLinkSelectedBadge(item) {
    const textColor = this._isSectionLinkForCurrentlyShownItem(item)
      ? CustomizationHelper.getHighlightColorForApp(this.props.appKey)
      : CustomizationHelper.getPrimaryColorForApp(this.props.appKey);

    return this._isSectionLinkForCurrentlyShownItem(item)
      ? styles.sectionLinkNotSelected // NOTE: Not using this for now... [styles.sectionLinkSelected, { color: textColor }]
      : styles.sectionLinkNotSelected;
  }

  _isSectionLinkForCurrentlyShownItem(item) {
    return item.id === this.props.currentItem.id ? true : false;
  }
}

/*---------------------------------------------------
⭑ Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sectionLinkContainer: {
    paddingVertical: 100
  },
  sectionLinkText: {
    fontFamily: "roboto-thin",
    fontSize: 52,
    letterSpacing: 2,
    alignSelf: "center",
    textAlign: "center",
    paddingVertical: 20,
    width: screen.width / 3 - 5
  },
  sectionLinkSelected: {
    fontSize: 12,
    textAlign: "center",
    marginTop: -22,
    marginBottom: 22
  },
  sectionLinkNotSelected: {
    width: 0,
    height: 0
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
    marginTop: -25
  },
  closeText: {
    color: Constants.baseColors.white,
    textAlign: "center",
    width: 40
  },
  icon: {
    width: 10,
    height: 10,
    marginRight: 5,
    top: 0,
    left: 0
  }
});

/*---------------------------------------------------
⭑ Exports
----------------------------------------------------*/
export { BrowseModal };
