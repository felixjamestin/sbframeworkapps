import React, { PureComponent } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Constants } from "./common/Constants";
import { CustomizationHelper } from "../helpers/Index";

class BodyMetaDesc extends PureComponent {
  constructor(props) {
    super(props);
  }

  /*--------------------------------------------------
       Render UI 
  ----------------------------------------------------*/
  render() {
    const itemStyle = this._getItemStyles(
      this.props.appKey,
      this.props.author,
      this.props.title
    );

    const doesMetaDescriptionExist =
      this.props.doesContentExist === true ||
      this.props.doesDescriptionExist === true
        ? true
        : false;

    const index = this.props.index + 1;

    return (
      <View
        style={
          doesMetaDescriptionExist ? styles.container : styles.container_empty
        }
      >
        <Text style={itemStyle.index}>{index}</Text>
        <Text style={itemStyle.title}>{this.props.title}</Text>
        <Text style={itemStyle.author}>{this.props.author}</Text>
        <View style={itemStyle.redbar} />
      </View>
    );
  }

  /*--------------------------------------------------
      Helpers & Handlers
  ----------------------------------------------------*/
  _getItemStyles(appKey, author, title) {
    let itemStyle = {
      author: "",
      title: "",
      redbar: "",
      index: ""
    };

    CustomizationHelper.shouldShowMetaDescription(appKey)
      ? this._getItemStylesForHasMetaDescription(author, title, itemStyle)
      : this._getItemStylesForNoMetaDescription(appKey, itemStyle);

    return itemStyle;
  }

  _getItemStylesForHasMetaDescription(author, title, itemStyle) {
    itemStyle.title =
      title === "-" || title === ""
        ? styles.excerpt_title_empty
        : styles.excerpt_title;

    itemStyle.author =
      author === "-" || author === ""
        ? styles.excerpt_author_empty
        : title === "-" || title === ""
        ? styles.excerpt_author
        : styles.excerpt_author_secondary;

    itemStyle.redbar = this.props.doesDescriptionExist
      ? styles.redbar
      : styles.redbar_empty;

    itemStyle.index = styles.excerpt_index_empty;

    return itemStyle;
  }

  _getItemStylesForNoMetaDescription(appKey, itemStyle) {
    itemStyle.title = [styles.excerpt_title_empty, styles.excerpt_empty];
    itemStyle.author = styles.excerpt_author_empty;
    itemStyle.redbar = styles.redbar_empty;

    let indexColor = CustomizationHelper.getPrimaryColorForApp(appKey);
    itemStyle.index = [styles.excerpt_index, { color: indexColor }];

    return itemStyle;
  }
}

/*---------------------------------------------------
    Styles 
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    paddingTop: 80
  },
  container_empty: {
    paddingTop: 0
  },
  redbar: {
    backgroundColor: Constants.baseColors.red,
    height: 2,
    width: 40,
    marginTop: 10,
    marginBottom: 50
  },
  redbar_empty: {
    height: 0,
    width: 0,
    opacity: 0
  },
  excerpt_title: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    fontSize: 15,
    letterSpacing: 0.5
  },
  excerpt_title_empty: {
    height: 0,
    width: 0,
    opacity: 0
  },
  excerpt_author: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    fontSize: 15,
    letterSpacing: 0.5
  },
  excerpt_author_empty: {
    height: 0,
    width: 0,
    opacity: 0
  },
  excerpt_author_secondary: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    fontSize: 13,
    opacity: 0.65,
    marginTop: 5,
    marginBottom: 2,
    letterSpacing: 0.5
  },
  excerpt_type: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    fontSize: 15
  },
  excerpt_index: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-thin",
    fontSize: 58,
    marginLeft: -5,
    marginBottom: -20,
    letterSpacing: 0
  },
  excerpt_index_empty: {
    height: 0,
    width: 0,
    opacity: 0
  },
  excerpt_empty: {
    marginBottom: 50
  }
});

/*--------------------------------------------------
    Export
----------------------------------------------------*/
export { BodyMetaDesc };
