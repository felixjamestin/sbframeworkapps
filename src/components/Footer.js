import React from "react";
import { View, StyleSheet } from "react-native";
import { ShowNextButton, ShareButton } from "./Index";

class Footer extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    return this.props.showFixedFooterBar ? null : (
      <View style={styles.container}>
        <ShowNextButton
          appKey={this.props.appKey}
          onPress={this.props.onShowNextExcerpt}
        />
        <ShareButton
          appKey={this.props.appKey}
          currentItem={this.props.currentItem}
        />
      </View>
    );
  }
}

/*---------------------------------------------------
    Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 150,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 42,
    paddingRight: 50
  }
});

/*---------------------------------------------------
    Exports
----------------------------------------------------*/
export { Footer };
