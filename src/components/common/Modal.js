import React from "react";
import { StyleSheet, Dimensions, Easing } from "react-native";
import Modal from "react-native-modalbox";
import { Constants } from "./Index";

var screen = Dimensions.get("window");

class ModalDialog extends React.Component {
  constructor(props) {
    super(props);

    this.localData = {
      isDisabled: false,
      backdropPressToClose: true,
      swipeThreshold: 50,
      backdropOpacity: 0.5,
      backdropColor: Constants.baseColors.darkGrey,
      animationDuration: 400,
      easing: Easing.elastic(0.8),
      coverScreen: false
    };
  }

  /*--------------------------------------------------
  ⭑ Render UI
  ----------------------------------------------------*/
  render() {
    const style = {
      backgroundColor: this.props.backgroundColor,
      width: this.props.width
    };

    return (
      <Modal
        isOpen={this.props.isOpen}
        onClosed={this.props.onClose}
        onOpened={this.props.onOpen}
        backdropPressToClose={this.props.backdropPressToClose}
        style={[styles.modal, style]}
        swipeToClose={this.props.swipeToClose}
        onClosingState={this.props.onClosingState}
        position="bottom"
        entry="bottom"
        swipeThreshold={50}
        backdropOpacity={0}
        backdropColor={Constants.baseColors.darkGrey}
        animationDuration={400}
        easing={Easing.elastic(0.8)}
      >
        {this.props.children}
      </Modal>
    );
  }
}

/*---------------------------------------------------
⭑ Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: screen.width,
    backgroundColor: Constants.baseColors.darkGrey
  }
});

/*---------------------------------------------------
⭑ Exports
----------------------------------------------------*/
export { ModalDialog };
