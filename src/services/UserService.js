import { Permissions, Notifications, Constants } from "expo";
import { API } from "aws-amplify";

class UserService {
  static userData = {};

  static async registerUser(appKey, userConfig) {
    try {
      // 1. Handle setup for push notifications
      const wasPushNotificationPermissionObtained = await this._getOSPermissionForPushNotifications();
      if (!wasPushNotificationPermissionObtained) return;
      let token = await Notifications.getExpoPushTokenAsync();

      // 2. Prepare user attributes for registration
      this._prepareUserData(token, userConfig);

      // 3. Send user details (push token, user timezone, etc) to backend
      const result = await this._sendUserDetailsToBackend(appKey);
    } catch (error) {
      console.log(error);
    }
  }

  /*---------------------------------------------------
  ⭑ Private methods
  ----------------------------------------------------*/
  static _prepareUserData(deviceToken, userConfig) {
    // Get user's timezone
    const date = new Date();
    const timeZoneOffset = date.getTimezoneOffset() / 60;

    // Get notification preferences
    const notificationTime = 9; // Send at 9 AM
    const notificationFrequency = 1; // Every "1" day

    UserService.userData = {
      deviceToken: deviceToken,
      deviceID: Constants.deviceId,
      deviceName: Constants.deviceName,
      timeZoneOffset: timeZoneOffset,
      shouldSendNotifications: true,
      notificationTime: notificationTime,
      notificationFrequency: notificationFrequency,
      email: "felixjamestin@gmail.com", //NOTE: Temporary in case we do full registration later; it isn't used anywhere
      appType: Constants.appOwnership,
      ratingCompleted: userConfig.ratingCompleted,
      ratingShownCount: userConfig.ratingShownCount,
      welcomeShown: userConfig.welcomeShown,
      appFirstOpened: userConfig.appFirstOpened,
      updatedOn: new Date().toLocaleDateString()
    };

    return UserService.userData;
  }

  static async _sendUserDetailsToBackend(appKey) {
    const apiName = "sbapi";
    const createPath = "/users";

    // Get app details
    const userDetails = {
      headers: {},
      response: true,
      queryStringParameters: {},
      body: {
        token: UserService.userData.deviceToken,
        email: UserService.userData.email,
        shouldSendNotifications: UserService.userData.shouldSendNotifications,
        timeZoneOffset: UserService.userData.timeZoneOffset,
        notificationTime: UserService.userData.notificationTime,
        notificationFrequency: UserService.userData.notificationFrequency,
        deviceID: UserService.userData.deviceID,
        deviceName: UserService.userData.deviceName,
        appType: UserService.userData.appType,
        ratingCompleted: UserService.userData.ratingCompleted,
        ratingShownCount: UserService.userData.ratingShownCount,
        welcomeShown: UserService.userData.welcomeShown,
        appFirstOpened: UserService.userData.appFirstOpened,
        appKey: appKey,
        updatedOn: UserService.userData.updatedOn
      }
    };
    const result = await API.post(apiName, createPath, userDetails);
    return result;
  }

  static async _getOSPermissionForPushNotifications() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );

    let finalStatus =
      existingStatus === "granted"
        ? existingStatus
        : (await Permissions.askAsync(Permissions.NOTIFICATIONS)).status; // Only for iOS; Android perms are granted during app install

    return finalStatus === "granted" ? true : false;
  }
}

/*--------------------------------------------------
⭑ Exports
----------------------------------------------------*/
export { UserService };
