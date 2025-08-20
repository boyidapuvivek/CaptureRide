import { Alert, Linking, AppState } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { Camera } from "expo-camera"
import React from "react"
import CameraScreen from "../components/CameraScreen"

let cameraRef = null
let setCameraComponent = null

export const CameraHost = () => {
  const ref = React.useRef(null)
  React.useEffect(() => {
    cameraRef = ref.current
  }, [])
  return (
    <CameraScreen
      ref={ref}
      onCapture={(photo) => {
        if (cameraRef?._resolver) {
          cameraRef._resolver({ success: true, uri: photo.uri })
          cameraRef._resolver = null
        }
      }}
      onCancel={() => {
        if (cameraRef?._resolver) {
          cameraRef._resolver({ success: false, cancelled: true })
          cameraRef._resolver = null
        }
      }}
    />
  )
}

class ImagePickerUtils {
  constructor() {
    this.appStateSubscription = null
    this.pendingPermissionCallback = null
  }

  /** Request camera permissions */
  async requestCameraPermissions() {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync()
      return status === "granted"
    } catch {
      return false
    }
  }

  /** Request gallery permissions */
  async requestMediaLibraryPermissions() {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      return status === "granted"
    } catch {
      return false
    }
  }

  showPermissionAlert(type = "camera") {
    return new Promise((resolve) => {
      Alert.alert(
        "Permission Required",
        `Permission to access ${type} is required.`,
        [
          { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
          {
            text: "Open Settings",
            onPress: async () => {
              await Linking.openSettings()
              this.setupAppStateListener(() => resolve(true))
            },
          },
        ]
      )
    })
  }

  setupAppStateListener(callback) {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove()
    }
    this.pendingPermissionCallback = callback
    this.appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "active" && this.pendingPermissionCallback) {
          setTimeout(() => {
            this.pendingPermissionCallback?.()
            this.pendingPermissionCallback = null
            this.appStateSubscription?.remove()
            this.appStateSubscription = null
          }, 500)
        }
      }
    )
  }

  async launchCamera() {
    const hasPermission = await this.requestCameraPermissions()
    if (!hasPermission) {
      const openSettings = await this.showPermissionAlert("camera")
      if (!openSettings)
        return { success: false, error: "Camera permission denied" }
      const after = await this.requestCameraPermissions()
      if (!after) return { success: false, error: "Camera still denied" }
    }

    return new Promise((resolve) => {
      if (cameraRef) {
        cameraRef._resolver = resolve
        cameraRef.open()
      } else {
        resolve({ success: false, error: "Camera not ready" })
      }
    })
  }

  async launchGallery(options = {}) {
    const { allowsEditing = true, aspect = [1, 1], quality = 0.8 } = options
    const hasPermission = await this.requestMediaLibraryPermissions()
    if (!hasPermission) {
      const openSettings = await this.showPermissionAlert("gallery")
      if (!openSettings) return { success: false, error: "Gallery denied" }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing,
      aspect,
      quality,
    })

    if (result.canceled) return { success: false, cancelled: true }
    return { success: true, uri: result.assets[0].uri, image: result.assets[0] }
  }

  async pickImage({ defaultSource, showSourceAlert = true, ...options }) {
    let source = defaultSource
    if (!source && showSourceAlert) {
      source = await new Promise((resolve) => {
        Alert.alert("Select Image", "Choose source", [
          { text: "Camera", onPress: () => resolve("camera") },
          { text: "Gallery", onPress: () => resolve("gallery") },
          { text: "Cancel", style: "cancel", onPress: () => resolve("cancel") },
        ])
      })
    }

    if (source === "camera") return await this.launchCamera()
    if (source === "gallery") return await this.launchGallery(options)
    return { success: false, cancelled: true }
  }

  cleanup() {
    this.appStateSubscription?.remove()
    this.appStateSubscription = null
    this.pendingPermissionCallback = null
  }
}

export const imagePickerUtils = new ImagePickerUtils()

export const pickImageFromGallery = (options = {}) =>
  imagePickerUtils.pickImage({
    ...options,
    defaultSource: "gallery",
    showSourceAlert: false,
  })

export const pickImageFromCamera = (options = {}) =>
  imagePickerUtils.pickImage({
    ...options,
    defaultSource: "camera",
    showSourceAlert: false,
  })

export const pickImageWithChoice = (options = {}) =>
  imagePickerUtils.pickImage({ ...options, showSourceAlert: true })
