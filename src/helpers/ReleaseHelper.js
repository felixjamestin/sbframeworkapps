const secondbrainApps = require("../../amplify/backend/function/sbapigetallitems/src/constants");

class ReleaseHelper {
  static getAppKeyFromExpoReleaseChannel(channel) {
    const releaseChannel = channel || "default";

    let appKey;
    switch (releaseChannel) {
      case "default":
        appKey = secondbrainApps.appKeys.sb;
        break;

      case "sb-staging":
      case "sb-prod":
        appKey = secondbrainApps.appKeys.sb;
        break;

      case "rmed-staging":
      case "rmed-prod":
        appKey = secondbrainApps.appKeys.rmed;
        break;

      case "ted-staging":
      case "ted-prod":
        appKey = secondbrainApps.appKeys.ted;
        break;

      default:
        break;
    }

    return appKey;
  }
}

export { ReleaseHelper };
