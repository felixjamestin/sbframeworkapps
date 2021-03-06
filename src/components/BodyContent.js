import React, { PureComponent } from "react";
import { Text, View, StyleSheet } from "react-native";
import { MarkdownView } from "react-native-markdown-view";
import { Constants } from "./common/Index";
import { StringHelper } from "../helpers/Index";

class BodyContent extends PureComponent {
  constructor(props) {
    super(props);
  }

  /*--------------------------------------------------
  ⭑ Render UI
  ----------------------------------------------------*/
  render() {
    return (
      <View
        style={
          Constants.displayOptions.showFixedFooterBar
            ? styles.container_fixed_footer
            : styles.container
        }
      >
        {this._getViewForRender()}
      </View>
    );
  }

  /*--------------------------------------------------
  ⭑ Helpers & Handlers
  ----------------------------------------------------*/
  _getViewForRender() {
    return StringHelper.isTextInMarkdown(this.props.content)
      ? this._renderMarkdown()
      : this._renderPlainText();
  }

  _renderMarkdown() {
    const stringForMarkdownRender = StringHelper.addNewLines(
      this.props.content
    );
    return (
      <MarkdownView styles={markdownStyles}>
        {stringForMarkdownRender}
      </MarkdownView>
    );
  }

  _renderPlainText() {
    const style = this._getItemStyles(this.props.content);
    return <Text style={style}>{this.props.content}</Text>;
  }

  _getItemStyles(body) {
    const style =
      body === "-" || body === ""
        ? styles.excerpt_body_empty
        : this._getDynamicSizeForText(body);

    return style;
  }

  _getDynamicSizeForText(text) {
    let textStyle = styles.excerpt_body_superlarge;
    const textLength = text.length;

    if (textLength > 250) {
      this.props.doesDescriptionExist == true
        ? (textStyle = styles.excerpt_body_tiny)
        : (textStyle = [
            styles.excerpt_body_tiny,
            styles.no_metadescription_spacer
          ]);
    } else if (textLength > 120) {
      textStyle = styles.excerpt_body_small;
    } else if (textLength > 100) {
      textStyle = styles.excerpt_body_medium;
    } else if (textLength > 60) {
      textStyle = styles.excerpt_body_large;
    }

    return textStyle;
  }
}

/*---------------------------------------------------
⭑ Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    marginBottom: 0
  },
  container_fixed_footer: {
    marginBottom: 100
  },
  no_metadescription_spacer: {
    marginTop: -180
  },
  excerpt_body_tiny: {
    color: Constants.baseColors.white,
    marginBottom: 0,
    fontFamily: "overpass-light",
    fontSize: 15,
    lineHeight: 27,
    letterSpacing: 0.2,
    opacity: 1
  },
  excerpt_body_small: {
    color: Constants.baseColors.white,
    marginBottom: 0,
    fontFamily: "overpass-light",
    fontSize: 15,
    lineHeight: 27,
    letterSpacing: 0.2,
    opacity: 1
  },
  excerpt_body_medium: {
    color: Constants.baseColors.white,
    marginBottom: 0,
    fontFamily: "overpass-light",
    fontSize: 15,
    lineHeight: 27,
    letterSpacing: 0.2,
    opacity: 1
  },
  excerpt_body_large: {
    color: Constants.baseColors.white,
    marginBottom: 0,
    fontFamily: "overpass-thin",
    fontSize: 24,
    lineHeight: 42,
    letterSpacing: 0.2,
    opacity: 1
  },
  excerpt_body_superlarge: {
    color: Constants.baseColors.white,
    marginVertical: 50,
    fontFamily: "overpass-thin",
    fontSize: 28,
    lineHeight: 42,
    letterSpacing: 0.2,
    opacity: 1
  },
  excerpt_body_empty: {
    height: 0,
    width: 0,
    opacity: 0
  }
});

const markdownStyles = {
  blockQuote: {
    marginLeft: 10,
    opacity: 1
  },
  codeBlock: {
    fontFamily: "Courier",
    fontWeight: "500"
  },
  del: {
    textDecorationLine: "line-through"
  },
  em: {
    fontStyle: "italic"
  },
  heading: {
    fontWeight: "700"
  },
  heading1: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    fontSize: 24,
    marginTop: 24,
    marginBottom: 10,
    marginHorizontal: 0
  },
  heading2: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    fontSize: 15,
    marginHorizontal: 0,
    marginBottom: 12
  },
  heading3: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    fontSize: 15,
    marginHorizontal: 0,
    marginBottom: 12
  },
  heading4: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    fontSize: 16,
    marginTop: 22,
    marginBottom: 22,
    marginHorizontal: 0
  },
  heading5: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    fontSize: 14,
    marginTop: 22,
    marginBottom: 22,
    marginHorizontal: 0
  },
  heading6: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    fontSize: 11,
    marginTop: 24,
    marginBottom: 24,
    marginLeft: 0,
    marginRight: 0
  },
  hr: {
    backgroundColor: "#ccc",
    height: 1
  },
  imageWrapper: {
    padding: 4,
    width: 320,
    height: 320
  },
  image: {
    flexGrow: 1
  },
  inlineCode: {
    backgroundColor: "rgba(128, 128, 128, 0.25)",
    fontFamily: "Courier",
    fontWeight: "500"
  },
  link: {
    color: "#0366d6"
  },
  list: {
    margin: 8
  },
  listItem: {
    flexDirection: "row"
  },
  listItemNumber: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    minWidth: 28,
    paddingRight: 4
  },
  listItemBullet: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    minWidth: 20,
    opacity: 0.8
  },
  listItemOrderedContent: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-thin",
    fontSize: 13,
    letterSpacing: 0.5,
    flex: 1
  },
  listItemUnorderedContent: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-thin",
    fontSize: 13,
    letterSpacing: 0.5,
    flex: 1,
    marginBottom: 10,
    opacity: 1
  },
  paragraph: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 10
  },
  strong: {
    color: Constants.baseColors.white,
    fontFamily: "overpass-light",
    letterSpacing: 0.5,
    fontWeight: "700"
  },
  table: {
    margin: 4,
    borderColor: "#222"
  },
  tableHeaderCell: {
    borderColor: "#222"
  },
  tableHeaderCellContent: {
    fontWeight: "700"
  },
  tableCell: {
    padding: 5
  },
  tableCellOddRow: {
    backgroundColor: "rgba(128, 128, 128, 0.1)"
  },
  tableCellEvenRow: {},
  tableCellLastRow: {
    borderBottomWidth: 0
  },
  tableCellOddColumn: {},
  tableCellEvenColumn: {},
  tableCellLastColumn: {
    borderRightWidth: 0
  },
  tableCellContent: {},
  tableCellContentOddRow: {},
  tableCellContentEvenRow: {},
  tableCellContentLastRow: {},
  tableCellContentOddColumn: {},
  tableCellContentEvenColumn: {},
  tableCellContentLastColumn: {},
  u: {
    color: Constants.baseColors.white,
    textDecorationLine: "underline"
  }
};

/*---------------------------------------------------
⭑ Exports
----------------------------------------------------*/
export { BodyContent };
