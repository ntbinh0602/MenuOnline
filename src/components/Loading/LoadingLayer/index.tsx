import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import LoadingAnimation from '../../../assets/animation/loading_dots.json';

interface LoadingLayerProps {
  text?: string;
  containerStyles?: ViewStyle;
  animationLoading?: any;
}

const LoadingLayer: React.FC<LoadingLayerProps> = ({
  text,
  containerStyles,
  animationLoading,
}) => {
  return (
    <View style={[styles.container, containerStyles]}>
      <View
        style={{
          width: '100%',
          height: animationLoading ? 70 : 200,
          maxWidth: 300,
        }}>
        <LottieView
          style={{width: '100%', height: '100%'}}
          source={animationLoading || LoadingAnimation}
          autoPlay
          loop
        />
        {text && (
          <Text
            style={{
              position: 'absolute',
              textAlign: 'center',
              fontSize: 16,
              fontFamily: 'Roboto-Medium',
              color: 'blue',
              top: '75%',
              alignSelf: 'center',
            }}>
            {text}
          </Text>
        )}
      </View>
    </View>
  );
};

export default LoadingLayer;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.9)',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
});
