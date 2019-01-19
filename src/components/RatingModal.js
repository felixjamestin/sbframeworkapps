import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";

import { Constants, ModalDialog } from "./common/Index";
import { CustomizationHelper } from "../helpers/Index";

var screen = Dimensions.get("window");

class RatingModal extends React.Component {
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
        backgroundColor="rgba(34, 34, 34, .5)"
        width={screen.width}
        backdropPressToClose={false}
        swipeToClose={false}
      >
        <View style={styles.container}>
          {this._renderContent()}
          {this._renderActions()}
        </View>
      </ModalDialog>
    );
  }

  _renderContent = () => {
    return <View>Hola!!</View>;
  };

  _renderActions = () => {
    const icon = CustomizationHelper.getIconForApp(
      this.props.appKey,
      CustomizationHelper.customizationElements.close
    );

    return (
      <View style={styles.dismissModalContainer}>
        <TouchableOpacity
          onPress={this.props.onHide}
          style={styles.dismissModalButton}
          activeOpacity={0.6}
        >
          <Image source={icon} style={styles.icon} resizeMode="contain" />
          <Text style={styles.closeText}>No!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.props.onHide}
          style={styles.dismissModalButton}
          activeOpacity={0.6}
        >
          <Image source={icon} style={styles.icon} resizeMode="contain" />
          <Text style={styles.closeText}>OK!</Text>
        </TouchableOpacity>
      </View>
    );
  };

  /*--------------------------------------------------
  ⭑ Helpers
  ----------------------------------------------------*/
}

/*---------------------------------------------------
⭑ Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  subContainer: {
    paddingVertical: 100
  },
  dismissModalContainer: {
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
export { RatingModal };
