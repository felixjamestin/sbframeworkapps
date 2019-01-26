import { Permissions, Notifications, Constants } from "expo";
import { API } from "aws-amplify";

class UserService {
  static userData = {};

  static async registerUser(appKey) {
    try {
      // 1. Handle setup for push notifications
      const wasPushNotificationPermissionObtained = await this._getOSPermissionForPushNotifications();
      if (!wasPushNotificationPermissionObtained) return;
      let token = await Notifications.getExpoPushTokenAsync();

      // 2. Prepare user attributes for registration
      this._prepareUserData(token);

      // 3. Send user details (push token, user timezone, etc) to backend
      const result = await this._sendUserDetailsToBackend(
        appKey,
        UserService.userData
      );
    } catch (error) {
      console.log(error);
    }
  }

  /*---------------------------------------------------
  ⭑ Private methods
  ----------------------------------------------------*/
  static _prepareUserData(deviceToken) {
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
      updatedOn: new Date().toLocaleDateString()
    };

    return UserService.userData;
  }

  static async _sendUserDetailsToBackend(appKey, userData) {
    const apiName = "sbapi";
    const createPath = "/users";

    // Get app details
    const userDetails = {
      headers: {},
      response: true,
      queryStringParameters: {},
      body: {
        token: userData.deviceToken,
        email: userData.email,
        shouldSendNotifications: userData.shouldSendNotifications,
        timeZoneOffset: userData.timeZoneOffset,
        notificationTime: userData.notificationTime,
        notificationFrequency: userData.notificationFrequency,
        deviceID: userData.deviceID,
        deviceName: userData.deviceName,
        appType: userData.appType,
        appKey: appKey,
        updatedOn: userData.updatedOn
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
