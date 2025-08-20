import React, { useRef, useEffect } from "react"
import { View, Animated, StyleSheet, Easing } from "react-native"
import Colors from "../constants/Colors"

const Loader = () => {
  const dots = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ]

  useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.sequence([
        Animated.delay(i * 50), // Slightly longer delay for better visual sequence
        Animated.timing(dot, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 120,
          useNativeDriver: true,
          easing: Easing.in(Easing.quad),
        }),
      ])
    )

    Animated.loop(Animated.sequence(animations)).start()
  }, [])

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {dots.map((dot, index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                opacity: dot.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
                transform: [
                  {
                    scale: dot.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
    marginHorizontal: 8,
  },
})

export default Loader
