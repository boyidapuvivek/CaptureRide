import React from "react"
import { View, ActivityIndicator, StyleSheet } from "react-native"
import Colors from "../constants/Colors"

const Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size='large'
        color='#007BFF'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
})

export default Loader
