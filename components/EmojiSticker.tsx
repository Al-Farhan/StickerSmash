import React from "react";
import { ImageSourcePropType, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

type Props = {
  imageSize: number;
  stickerSource: ImageSourcePropType;
};

const EmojiSticker = ({ imageSize, stickerSource }: Props) => {
  const scaleImage = useSharedValue(imageSize);
  const savedScale = useSharedValue(imageSize);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Pinch gesture
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scaleImage.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scaleImage.value;
    });

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleImage.value }],
  }));

  // Pan Gesture - Drag emoji over image
  const drag = Gesture.Pan().onChange((e) => {
    translateX.value += e.changeX;
    translateY.value += e.changeY;
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={drag}>
      <Animated.View style={[containerStyle, { top: -250, left: 150 }]}>
        <GestureDetector gesture={pinchGesture}>
          <Animated.Image
            source={stickerSource}
            resizeMode="contain"
            style={[imageStyle, { width: imageSize, height: imageSize }]}
          />
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
};

export default EmojiSticker;

const styles = StyleSheet.create({});
