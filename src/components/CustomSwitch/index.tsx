import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import React, {useState, useEffect} from 'react';
import Animated, {
  interpolateColor,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';

type SwitchProps = {
  activeColor?: string;
  inActiveColor?: string;
  size?: 'small' | 'medium' | 'large';
  onChange?: (active: boolean) => void;
};

const SIZE_MAP = {
  small: {width: 40, height: 20, circleSize: 16, translateX: 22},
  medium: {width: 50, height: 28, circleSize: 24, translateX: 24},
  large: {width: 60, height: 34, circleSize: 30, translateX: 28},
};

const CustomSwitch: React.FC<SwitchProps> = ({
  activeColor = 'blue',
  inActiveColor = 'gray',
  size = 'medium',
  onChange,
}) => {
  const {width, height, circleSize, translateX} = SIZE_MAP[size];

  const switchTranslate = useSharedValue(0);
  const [active, setActive] = useState(false);

  const progress = useDerivedValue(() => {
    return withTiming(active ? translateX : 4);
  });

  useEffect(() => {
    switchTranslate.value = active ? translateX : 2;
  }, [active, switchTranslate, translateX]);

  const customSpringStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(switchTranslate.value, {
            mass: 1,
            damping: 15,
            stiffness: 120,
          }),
        },
      ],
    };
  });

  const backgroundColorStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, translateX],
      [inActiveColor, activeColor],
    );
    return {
      backgroundColor,
    };
  });

  const toggleSwitch = () => {
    const newActive = !active;
    setActive(newActive);
    onChange?.(newActive); // Gọi onChange nếu có
  };

  return (
    <TouchableWithoutFeedback onPress={toggleSwitch}>
      <Animated.View
        style={[
          styles.container,
          backgroundColorStyle,
          {width, height, borderRadius: height / 2},
        ]}>
        <Animated.View
          style={[
            styles.circle,
            customSpringStyles,
            {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
            },
          ]}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default CustomSwitch;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#F2F5F7',
  },
  circle: {
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 4,
  },
});
