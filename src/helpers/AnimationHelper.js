import { Animated } from "react-native";

class AnimationHelper {
  static _startFadeInAnimation(animationDriver) {
    Animated.timing(animationDriver, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true
    }).start();
  }

  static _startFadeOutAndFadeInAnimation(animationDriver) {
    animationDriver.setValue(0);
    Animated.timing(animationDriver, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }
}

export { AnimationHelper };
