import React from "react";
import { View, StyleSheet } from "react-native";
import { ShowNextButton, ShareButton } from "./Index";
import { Constants as AppConstants } from "./common/Index";

class FooterBar extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  /*--------------------------------------------------
    Render UI
  ----------------------------------------------------*/
  render() {
    return this.props.showFixedFooterBar ? (
      <View style={styles.container}>
        <ShowNextButton
          appKey={this.props.appKey}
          onShowNextExcerpt={this.props.onShowNextExcerpt}
        />
        <ShareButton
          appKey={this.props.appKey}
          currentItem={this.props.currentItem}
        />
      </View>
    ) : null;
  }
}

/*---------------------------------------------------
    Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    height: 96,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: AppConstants.baseColors.whiteBorder,
    borderTopWidth: 1,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 42,
    paddingRight: 50
  }
});

/*---------------------------------------------------
    Exports
----------------------------------------------------*/
export { FooterBar };
