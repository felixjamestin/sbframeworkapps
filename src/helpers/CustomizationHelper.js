import { Constants } from "../components/common/Index";

const secondbrainApps = require("../../amplify/backend/function/sbapigetallitems/src/constants");

class CustomizationHelper {
  static customizationElements = {
    showNext: "Show Next",
    browseAll: "Browse all",
    share: "Share",
    close: "Close"
  };

  static getPrimaryColorForApp(appKey) {
    let primaryColorForApp;
    if (appKey === secondbrainApps.appKeys.sb) {
      primaryColorForApp = Constants.customizationColors.sbPrimary;
    } else if (appKey === secondbrainApps.appKeys.rmed) {
      primaryColorForApp = Constants.customizationColors.rmedPrimary;
    } else if (appKey === secondbrainApps.appKeys.ted) {
      primaryColorForApp = Constants.customizationColors.tedPrimary;
    } else if (appKey === secondbrainApps.appKeys.red) {
      primaryColorForApp = Constants.customizationColors.redPrimary;
    }

    return primaryColorForApp;
  }

  static getHighlightColorForApp(appKey) {
    let primaryColorForApp;
    if (appKey === secondbrainApps.appKeys.sb) {
      primaryColorForApp = Constants.baseColors.white;
    } else if (appKey === secondbrainApps.appKeys.rmed) {
      primaryColorForApp = Constants.baseColors.white;
    } else if (appKey === secondbrainApps.appKeys.ted) {
      primaryColorForApp = Constants.baseColors.white;
    } else if (appKey === secondbrainApps.appKeys.red) {
      primaryColorForApp = Constants.baseColors.white;
    }

    return primaryColorForApp;
  }

  static getIconForApp(appKey, customizationType) {
    if (
      customizationType == CustomizationHelper.customizationElements.showNext
    ) {
      return appKey === secondbrainApps.appKeys.sb
        ? require("../../assets/sb-show-next-icon.png")
        : appKey === secondbrainApps.appKeys.rmed
        ? require("../../assets/rmed-show-next-icon.png")
        : appKey === secondbrainApps.appKeys.ted
        ? require("../../assets/ted-show-next-icon.png")
        : appKey === secondbrainApps.appKeys.red
        ? require("../../assets/red-show-next-icon.png")
        : "";
    } else if (
      customizationType == CustomizationHelper.customizationElements.browseAll
    ) {
      return appKey === secondbrainApps.appKeys.sb
        ? require("../../assets/sb-browse-icon.png")
        : appKey === secondbrainApps.appKeys.rmed
        ? require("../../assets/rmed-browse-icon.png")
        : appKey === secondbrainApps.appKeys.ted
        ? require("../../assets/ted-browse-icon.png")
        : appKey === secondbrainApps.appKeys.red
        ? require("../../assets/red-browse-icon.png")
        : "";
    } else if (
      customizationType == CustomizationHelper.customizationElements.share
    ) {
      return appKey === secondbrainApps.appKeys.sb
        ? require("../../assets/sb-share-icon.png")
        : appKey === secondbrainApps.appKeys.rmed
        ? require("../../assets/rmed-share-icon.png")
        : appKey === secondbrainApps.appKeys.ted
        ? require("../../assets/ted-share-icon.png")
        : appKey === secondbrainApps.appKeys.red
        ? require("../../assets/red-share-icon.png")
        : "";
    } else if (
      customizationType == CustomizationHelper.customizationElements.close
    ) {
      return appKey === secondbrainApps.appKeys.sb
        ? require("../../assets/sb-close-icon.png")
        : appKey === secondbrainApps.appKeys.rmed
        ? require("../../assets/rmed-close-icon.png")
        : appKey === secondbrainApps.appKeys.ted
        ? require("../../assets/ted-close-icon.png")
        : appKey === secondbrainApps.appKeys.red
        ? require("../../assets/red-close-icon.png")
        : "";
    }
  }

  static shouldShowMetaDescription(appKey) {
    let shouldShowMetaDescription;

    if (appKey === secondbrainApps.appKeys.sb) {
      shouldShowMetaDescription = true; // Only showing for Secondbrain. In other apps, the description doesn't vary...
    } else if (appKey === secondbrainApps.appKeys.rmed) {
      shouldShowMetaDescription = false;
    } else if (appKey === secondbrainApps.appKeys.ted) {
      shouldShowMetaDescription = false;
    } else if (appKey === secondbrainApps.appKeys.red) {
      shouldShowMetaDescription = false;
    } else {
      shouldShowMetaDescription = false;
    }

    return shouldShowMetaDescription;
  }
}

export { CustomizationHelper };
