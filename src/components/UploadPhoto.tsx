// UploadPhoto.tsx
import Colors from "../constants/Colors"
import React, { useRef, useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ImageBackground,
  Alert,
} from "react-native"
import Upload from "../assets/icons/upload.svg"
import { CameraView, CameraType, useCameraPermissions } from "expo-camera"
import Capture from "../assets/icons/capture.svg"
import Flash from "../assets/icons/flash.svg"
import FlashOn from "../assets/icons/flashon.svg"
import Flip from "../assets/icons/flip.svg"
import {
  pickImageFromCamera,
  pickImageFromGallery,
} from "../utils/imagePickerUtils"
import ImagePickerModal from "./ImagePickerModal"

type Props = {
  title?: string
  captureImage?: (uri: string) => void
  resetKey?: number // Add resetKey prop to force reset
  initialPhoto?: string // Add prop to set initial photo value
}

const UploadPhoto = ({
  title,
  captureImage,
  resetKey,
  initialPhoto = "",
}: Props) => {
  const [photo, setPhoto] = useState(initialPhoto)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [permission, requestPermissions] = useCameraPermissions()
  const [facing, setFacing] = useState<CameraType>("back")
  const [flash, setFlash] = useState<"off" | "on">("off")
  const [isProcessing, setIsProcessing] = useState(false)
  const [pickerVisible, setPickerVisible] = useState(false)
  const cameraRef = useRef<CameraView | null>(null)

  // Reset component when resetKey changes
  useEffect(() => {
    if (resetKey !== undefined) {
      setPhoto(initialPhoto)
      setIsModalVisible(false)
      setPickerVisible(false)
      setIsProcessing(false)
      setFacing("back")
      setFlash("off")
    }
  }, [resetKey, initialPhoto])

  const toggleCameraFacing = () =>
    setFacing((current) => (current === "back" ? "front" : "back"))

  const toggleFlash = () => setFlash((prev) => (prev === "off" ? "on" : "off"))

  const handleCapture = async () => {
    if (cameraRef?.current && !isProcessing) {
      try {
        setIsProcessing(true)
        const res = await cameraRef.current.takePictureAsync()
        setPhoto(res.uri)
        captureImage?.(res.uri)
        setIsModalVisible(false)
      } catch (error) {
        Alert.alert("Error", "Failed to take picture. Please try again.")
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleImageSelection = () => {
    setPickerVisible(true)
  }

  const handlePick = async (source: "camera" | "gallery") => {
    try {
      let result =
        source === "camera"
          ? await pickImageFromCamera({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            })
          : await pickImageFromGallery({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            })

      if (result.success && result.uri) {
        setPhoto(result.uri)
        captureImage?.(result.uri)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select image.")
    }
  }

  return (
    <>
      <TouchableOpacity
        onPress={handleImageSelection}
        disabled={isProcessing}
        activeOpacity={0.7}>
        {photo ? (
          <ImageBackground
            source={{ uri: photo }}
            style={styles.imageContainer}
            resizeMode='cover'
            borderRadius={18}
          />
        ) : (
          <View
            style={[
              styles.inputContainer,
              isProcessing && styles.inputContainerDisabled,
            ]}>
            <Upload
              height={48}
              width={48}
            />
            <Text style={styles.title}>
              {isProcessing ? "Processing..." : title}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Camera Modal */}
      <Modal
        visible={isModalVisible}
        animationType='slide'
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalWrapper}>
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
            flash={flash}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={toggleCameraFacing}>
                <Flip
                  height={64}
                  width={64}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCapture}
                style={styles.captureButton}>
                <Capture
                  height={100}
                  width={100}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleFlash}>
                {flash === "on" ? (
                  <FlashOn
                    height={64}
                    width={64}
                  />
                ) : (
                  <Flash
                    height={64}
                    width={64}
                  />
                )}
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      </Modal>

      {/* Modern Picker Modal */}
      <ImagePickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onPickCamera={() => handlePick("camera")}
        onPickGallery={() => handlePick("gallery")}
      />
    </>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: 200,
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  inputContainerDisabled: { opacity: 0.7, backgroundColor: Colors.grayStatus },
  imageContainer: { width: "100%", minHeight: 200 },
  title: {
    fontFamily: "poppins-regular",
    fontSize: 18,
    color: Colors.grayText,
  },
  modalWrapper: { flex: 1, backgroundColor: "black" },
  camera: { flex: 1 },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    paddingBottom: 50,
    alignItems: "flex-end",
    justifyContent: "space-around",
  },
  captureButton: { position: "relative" },
})

export default UploadPhoto
