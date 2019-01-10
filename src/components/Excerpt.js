import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { StringHelper } from "../helpers/Index";
import {
  BodyContent,
  BodyMetaDesc,
  BodyImage,
  Footer,
  FooterBar
} from "./Index";

import { Constants as AppConstants } from "./common/Index";

class Excerpt extends React.PureComponent {
  constructor(props) {
    super(props);

    // Bind methods
    this.renderItem = this.renderItem.bind(this);
  }

  /*--------------------------------------------------
  ⭑ Render UI
  ----------------------------------------------------*/
  render() {
    const items = [this.props.item];

    return (
      <View style={styles.container}>
        <FlatList
          data={items}
          renderItem={this.renderItem}
          ListFooterComponent={this.renderFooter}
          keyExtractor={(item, index) => index.toString()}
        />
        <FooterBar
          showFixedFooterBar={AppConstants.displayOptions.showFixedFooterBar}
          onShowNextExcerpt={this.props.onShowNextExcerpt}
          appKey={this.props.appKey}
        />
      </View>
    );
  }

  renderItem({ item }) {
    const [author, body, title, uri] = this.getItemDetails(item);
    const doesDescriptionExist = author !== "-" || title !== "-";
    const doesContentExist = body !== "-" && body !== "";

    return (
      <View>
        <View style={styles.container_desc}>
          <BodyMetaDesc
            title={title}
            author={author}
            doesDescriptionExist={doesDescriptionExist}
            doesContentExist={doesContentExist}
            appKey={this.props.appKey}
          />
          <BodyContent
            content={body}
            doesDescriptionExist={doesDescriptionExist}
            appKey={this.props.appKey}
          />
        </View>

        {this.renderBodyImage(uri, doesDescriptionExist, doesContentExist)}
      </View>
    );
  }

  renderBodyImage = (uri, doesDescriptionExist, doesContentExist) => {
    const image = (
      <BodyImage
        uri={uri}
        doesDescriptionExist={doesDescriptionExist}
        doesContentExist={doesContentExist}
      />
    );

    return uri !== "" ? image : null;
  };

  renderFooter = () => {
    const onShowNextExcerpt = this.props.onShowNextExcerpt;
    return (
      <Footer
        showFixedFooterBar={AppConstants.displayOptions.showFixedFooterBar}
        onShowNextExcerpt={onShowNextExcerpt}
        appKey={this.props.appKey}
      />
    );
  };

  /*--------------------------------------------------
  ⭑ Helpers & Handlers
  ----------------------------------------------------*/
  getItemDetails(item) {
    const author = StringHelper.convertToCamelCase(item.fields.author);
    const body = StringHelper.convertToSentenceCase(item.fields.extract);
    const title = StringHelper.convertToCamelCase(item.fields.title);
    const uri = this.getImageURL(item);

    return [author, body, title, uri];
  }

  getImageURL(item) {
    return item.fields.image !== undefined
      ? item.fields.image[0].url !== undefined
        ? item.fields.image[0].url
        : ""
      : "";
  }
}

/*---------------------------------------------------
⭑ Styles
----------------------------------------------------*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 0
  },
  container_desc: {
    paddingLeft: 42,
    paddingRight: 48
  }
});

/*---------------------------------------------------
⭑ Exports
----------------------------------------------------*/
export { Excerpt };