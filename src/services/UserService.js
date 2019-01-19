import { Permissions, Notifications, Constants } from "expo";
import { API } from "aws-amplify";

class UserService {
  static async registerAndGetUserDetails(appKey) {
    try {
      // 1. Handle setup for push notifications
      const wasPushNotificationPermissionObtained = await this._getOSPermissionForPushNotifications();
      if (!wasPushNotificationPermissionObtained) return;
      let token = await Notifications.getExpoPushTokenAsync();

      // 2. Prepare user attributes for registration
      const userData = this._prepareUserData(token);

      // 3. Send user details (push token, user timezone, etc) to backend
      this._sendUserDetailsToBackend(appKey, userData);
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

    return {
      deviceToken: deviceToken,
      deviceID: Constants.deviceId,
      deviceName: Constants.deviceName,
      timeZoneOffset: timeZoneOffset,
      shouldSendNotifications: true,
      notificationTime: notificationTime,
      notificationFrequency: notificationFrequency,
      email: "felixjamestin@gmail.com", //NOTE: Temporary in case we do full registration later; it isn't used anywhere
      appType: Constants.appOwnership
    };
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
        token: userData.token,
        email: userData.email,
        shouldSendNotifications: userData.shouldSendNotifications,
        timeZoneOffset: userData.timeZoneOffset,
        notificationTime: userData.notificationTime,
        notificationFrequency: userData.notificationFrequency,
        deviceID: userData.deviceId,
        deviceName: userData.deviceName,
        appType: userData.appOwnership,
        appKey: appKey
      }
    };
    return await API.post(apiName, createPath, userDetails);
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
