import React, { useEffect, useRef } from "react"
import { Animated } from "react-native"

const SkeletonBox = ({
  width,
  height,
  borderRadius = 4,
  style = {},
  backgroundColor = "#E1E9EE",
  minOpacity = 0.3,
  maxOpacity = 0.7,
  duration = 800,
}) => {
  const opacity = useRef(new Animated.Value(minOpacity)).current

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: maxOpacity,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: minOpacity,
          duration: duration,
          useNativeDriver: true,
        }),
      ]).start(() => animate())
    }
    animate()

    // Cleanup function to stop animation when component unmounts
    return () => {
      opacity.stopAnimation()
    }
  }, [opacity, minOpacity, maxOpacity, duration])

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  )
}

export default SkeletonBox
