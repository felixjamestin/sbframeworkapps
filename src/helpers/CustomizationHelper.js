import { Constants } from "../components/common/Index";

const secondbrainApps = require("../../amplify/backend/function/sbapigetallitems/src/constants");

class CustomizationHelper {
  static customizationElements = {
    showNext: "Show Next",
    browseAll: "Browse all",
    share: "Share",
    close: "Close"
  };

  static showNextBehaviour = {
    random: 1,
    sequential: 2
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

  static getHeaderLogoAndStyleForApp(appKey) {
    let headerLogo;
    if (appKey === secondbrainApps.appKeys.sb) {
      headerLogo = {
        image: require("../../assets/sb-header_logo.png"),
        style: { width: 180 }
      };
    } else if (appKey === secondbrainApps.appKeys.rmed) {
      headerLogo = {
        image: require("../../assets/rmed-header_logo.png"),
        style: { width: 220 }
      };
    } else if (appKey === secondbrainApps.appKeys.ted) {
      headerLogo = {
        image: require("../../assets/ted-header_logo.png"),
        style: { width: 220 }
      };
    } else if (appKey === secondbrainApps.appKeys.red) {
      headerLogo = {
        image: require("../../assets/red-header_logo.png"),
        style: { width: 220 }
      };
    }

    return headerLogo;
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

  static getConfig(appKey = secondbrainApps.appKeys.sb) {
    let config = {
      cacheTimeout: 2,
      loggingEnabled: true,
      showNextBehaviour: CustomizationHelper.showNextBehaviour.random
    };

    if (appKey === secondbrainApps.appKeys.sb) {
      config.showNextBehaviour = CustomizationHelper.showNextBehaviour.random;
    } else if (appKey === secondbrainApps.appKeys.rmed) {
      config.showNextBehaviour =
        CustomizationHelper.showNextBehaviour.sequential;
    } else if (appKey === secondbrainApps.appKeys.ted) {
      config.showNextBehaviour =
        CustomizationHelper.showNextBehaviour.sequential;
    } else if (appKey === secondbrainApps.appKeys.red) {
      config.showNextBehaviour =
        CustomizationHelper.showNextBehaviour.sequential;
    }

    return config;
  }

  static getAmplitudeAnalyticsKey(appKey) {
    let apiKey;
    if (appKey === secondbrainApps.appKeys.sb) {
      apiKey = "6f64b7a3d08ab37a3252e61f6d832db3";
    } else if (appKey === secondbrainApps.appKeys.rmed) {
      apiKey = "54117478bc880f83b825426df5be7f12";
    } else if (appKey === secondbrainApps.appKeys.ted) {
      apiKey = "eb97b2baac761f905cdb4c770424e9c3";
    } else if (appKey === secondbrainApps.appKeys.red) {
      apiKey = "2be5ea23bd65844f8220b496577d3b08";
    }

    return apiKey;
  }
}

export { CustomizationHelper };
