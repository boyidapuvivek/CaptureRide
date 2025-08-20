import React, { useRef, useState, forwardRef, useImperativeHandle } from "react"
import { View, TouchableOpacity, StyleSheet, Modal } from "react-native"
import { CameraView, CameraType, FlashMode } from "expo-camera"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"

const CameraScreen = forwardRef(({ onCapture, onCancel }, ref) => {
  const cameraRef = useRef(null)
  const [facing, setFacing] = useState<CameraType>("back")
  const [flash, setFlash] = useState<FlashMode>("auto")
  const [visible, setVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => setVisible(false),
  }))

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        flashMode: flash,
      })
      onCapture(photo)
      setVisible(false)
    }
  }

  const toggleFlash = () => {
    setFlash((prev) => {
      if (prev === "auto") return "on"
      if (prev === "on") return "off"
      return "auto"
    })
  }

  const flashIcon = () => {
    if (flash === "auto") return "flash-auto"
    if (flash === "on") return "flash-on"
    return "flash-off"
  }

  return (
    <Modal
      visible={visible}
      animationType='slide'>
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          flash={flash}>
          {/* Cancel at top-right */}
          <View style={styles.topControls}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                setVisible(false)
                onCancel?.()
              }}>
              <Ionicons
                name='close'
                size={32}
                color='white'
              />
            </TouchableOpacity>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            {/* Flash (left) */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={toggleFlash}>
              <MaterialIcons
                name={flashIcon()}
                size={32}
                color='white'
              />
            </TouchableOpacity>

            {/* Shutter (center) */}
            <TouchableOpacity
              style={styles.shutterOuter}
              onPress={takePicture}>
              <View style={styles.shutterInner} />
            </TouchableOpacity>

            {/* Flip Camera (right) */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() =>
                setFacing((prev) => (prev === "back" ? "front" : "back"))
              }>
              <Ionicons
                name='camera-reverse'
                size={32}
                color='white'
              />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    </Modal>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  camera: { flex: 1 },

  // Cancel button top-right
  topControls: {
    position: "absolute",
    top: 40,
    right: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  // Bottom row (flash - shutter - flip)
  bottomControls: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconButton: {
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 25,
  },

  shutterOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
})

export default CameraScreen
