import React from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Animated
} from "react-native";

import { Constants, ModalDialog } from "./common/Index";
import { CustomizationHelper, DeviceInfoHelper } from "../helpers/Index";

var screen = Dimensions.get("window");

class BrowseModal extends React.Component {
  constructor(props) {
    super(props);

    this.localData = {
      sections: [],
      animationStagger: {
        values: [],
        animations: []
      }
    };

    this.localData.sections = this._getSectionsForDisplay();
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
          backgroundColor: "rgba(34, 34, 34, .93)",
          opacity: 1
        }}
        isOpen={this.props.isOpen}
        onOpen={this._onOpen}
        onClose={this._onClose}
        onClosingState={this._onClosingState}
        backdropPressToClose
        swipeToClose={false}
        position="bottom"
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
        data={this.localData.sections}
        renderItem={this._renderItem}
        contentContainerStyle={styles.sectionLinkContainer}
        numColumns={3}
        keyExtractor={(item, index) => index}
      />
    );
  };

  _renderItem = ({ item }) => {
    return (
      <Animated.View
        key={item.displayIndex}
        style={{
          opacity: this.localData.animationStagger.values[item.displayIndex - 1]
        }}
      >
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
      </Animated.View>
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
    this.props.onHide();
  };

  _onOpen = () => {};

  _onClosingState = state => {};

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

  _startStaggerAnimation() {
    this._resetAnimations();
    Animated.stagger(20, this.localData.animationStagger.animations).start();
  }

  _initializeAnimations() {
    let animationStagger = { values: [], animations: [] };

    animationStagger.values = this.localData.sections.map(() => {
      return new Animated.Value(0);
    });

    animationStagger.animations = this.localData.sections.map(
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
    this.localData.sections.forEach((value, index) => {
      this.localData.animationStagger.values[index].setValue(0);
    });
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
    paddingVertical: 100,
    left: -5
  },
  sectionLinkText: {
    fontFamily: "roboto-thin",
    fontSize: 42,
    letterSpacing: 0,
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
