import { Constants } from "expo";

class DeviceInfoHelper {
  static getDeviceInfo() {
    return Constants;
  }

  static isDeviceScreenFullBleed() {
    let isDeviceScreenFullBleed = true;
    switch (Constants.platform.ios.model) {
      case "iPhone 4":
      case "iPhone 4S":
      case "iPhone 5":
      case "iPhone 5C":
      case "iPhone 5c":
      case "iPhone 5S":
      case "iPhone 5s":
      case "iPhone 6":
      case "iPhone 6s":
      case "iPhone 6S":
      case "iPhone 6 Plus":
      case "iPhone 6s Plus":
      case "iPhone 7":
      case "iPhone 7 Plus":
      case "iPhone 8":
      case "iPhone 8 Plus":
        isDeviceScreenFullBleed = false;
        break;

      default:
        break;
    }
    return isDeviceScreenFullBleed;
  }
}

export { DeviceInfoHelper };
