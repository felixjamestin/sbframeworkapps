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
    return (
      <Modal
        style={[styles.modal, this.props.style]}
        position={this.props.position}
        entry="bottom"
        isOpen={this.props.isOpen}
        onClosed={this.props.onClose}
        onOpened={this.props.onOpen}
        swipeToClose={this.props.swipeToClose}
        swipeThreshold={50}
        onClosingState={this.props.onClosingState}
        backdropPressToClose={this.props.backdropPressToClose}
        backdropOpacity={this.props.backdropOpacity}
        backdropColor={Constants.baseColors.darkGrey}
        backdropContent={null}
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
    justifyContent: "center",
    width: screen.width,
    height: screen.height
  }
});

/*---------------------------------------------------
⭑ Exports
----------------------------------------------------*/
export { ModalDialog };
