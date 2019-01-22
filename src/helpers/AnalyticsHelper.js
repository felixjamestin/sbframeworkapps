// import { Analytics } from "aws-amplify";
import { Amplitude } from "expo";
import { CustomizationHelper } from "./Index";
import { UserService } from "../services/UserService";

class AnalyticsHelper {
  static eventEnum() {
    return {
      appOpen: "appOpen",
      appOpenFromNotification: "appOpenFromNotification",
      showNext: "showNext-tapped",
      browseAll: "browseAll-tapped",
      share: "share-tapped",
      ratingScreenAskIfLiked: "ratingAskIfLiked-shown",
      ratingScreenAskIfLikedNo: "ratingAskIfLikedNo-tapped",
      ratingScreenAskIfLikedYes: "ratingAskIfLikedYes-tapped",
      ratingScreenAskForRatingYes: "ratingAskForRatingYes-tapped",
      ratingScreenAskForRatingSkip: "ratingAskForRatingSkip-tapped",
      ratingScreenFeedbackNo: "ratingScreenFeedbackNo-tapped",
      ratingScreenFeedbackYesViaEmail: "ratingScreenFeedbackYesViaEmail-tapped"
    };
  }

  static initialize(appKey) {
    const apiKey = CustomizationHelper.getAmplitudeAnalyticsKey(appKey);
    Amplitude.initialize(apiKey);
    Amplitude.setUserId(UserService.userData.deviceID);
    Amplitude.setUserProperties(UserService.userData);

    AnalyticsHelper.trackEvent(appKey, AnalyticsHelper.eventEnum().appOpen);
  }

  static trackEvent(appKey, event) {
    const eventName = appKey + "-" + event;
    Amplitude.logEvent(eventName);
  }
}

export { AnalyticsHelper };
