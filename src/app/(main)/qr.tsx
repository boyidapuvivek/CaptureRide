// qr.tsx
import React, { useEffect, useState, useRef, useCallback } from "react"
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  ScrollView,
  Dimensions,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native"
import Header from "../../components/Header"
import { Values } from "../../constants/Values"
import QrImagePlaceholder from "../../assets/icons/qr_placeholder.svg"
import CustomButton from "../../components/CustomButton"
import Colors from "../../constants/Colors"
import axios from "axios"
import { apiRoute } from "../../api/apiConfig"
import useFetchToken from "../../utils/useFetchToken"
import SkeletonBox from "../../utils/SkeletonBox"
import Loader from "../../components/Loader"
import {
  pickImageFromCamera,
  pickImageFromGallery,
} from "../../utils/imagePickerUtils"
import ImagePickerModal from "../../components/ImagePickerModal"

const { width: screenWidth } = Dimensions.get("window")
const IMAGE_WIDTH = screenWidth - Values.paddingHorizontal * 2
const IMAGE_HEIGHT = 300

const Qr = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [qrImages, setQrImages] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [bankName, setBankName] = useState("")
  const [pickerVisible, setPickerVisible] = useState(false)

  const scrollViewRef = useRef<ScrollView | null>(null)
  const token = useFetchToken()

  useEffect(() => {
    if (token) fetchQRImages()
  }, [token])

  const fetchQRImages = useCallback(async () => {
    if (!token) return
    setIsLoadingImages(true)
    try {
      const response = await axios.get(apiRoute.GETQR, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const qrData = response?.data?.qrs || []
      setQrImages(qrData)
      if (qrData.length > 0) setCurrentIndex(0)
    } catch {
      Alert.alert("Error", "Failed to load QR images")
    } finally {
      setIsLoadingImages(false)
    }
  }, [token])

  const handlePick = async (source: "camera" | "gallery") => {
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
      setSelectedImage(result.uri)
      if (bankName.trim()) {
        await uploadImage(result.uri)
      } else {
        Alert.alert("Error", "Please enter a bank name")
        setSelectedImage(null)
      }
    }
  }

  const uploadImage = async (imageUri: string) => {
    setIsLoading(true)
    if (!token) {
      Alert.alert("Error", "Auth token missing")
      setIsLoading(false)
      return
    }
    try {
      const formData = new FormData()
      formData.append("bankName", bankName)
      formData.append("qrPhoto", {
        uri: imageUri,
        type: "image/jpeg",
        name: `qr_${Date.now()}.jpg`,
      } as any)

      const response = await axios.post(apiRoute.ADDQR, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      if (response.status === 201) {
        await fetchQRImages()
        setBankName("")
      }
    } catch {
      Alert.alert("Error", "Failed to upload QR code")
    } finally {
      setIsLoading(false)
      setSelectedImage(null)
    }
  }

  const deleteQrImage = async () => {
    if (!token || qrImages.length === 0) return
    const currentQr = qrImages[currentIndex]
    Alert.alert("Confirm Delete", "Delete this QR?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoading(true)
            await axios.delete(apiRoute.DELETEQR, {
              headers: { Authorization: `Bearer ${token}` },
              params: { id: currentQr._id },
            })
            await fetchQRImages()
          } finally {
            setIsLoading(false)
          }
        },
      },
    ])
  }

  const handleScroll = (event: any) => {
    const pageIndex = Math.floor(
      event.nativeEvent.contentOffset.x /
        event.nativeEvent.layoutMeasurement.width
    )
    setCurrentIndex(pageIndex)
  }

  const renderQRImages = () => {
    if (isLoadingImages) {
      return (
        <View style={styles.skeletonContainer}>
          <SkeletonBox
            height={40}
            width={140}
          />
          <SkeletonBox style={styles.skeletonImage} />
          <SkeletonBox
            height={50}
            width={80}
          />
        </View>
      )
    }
    if (qrImages.length === 0) {
      return (
        <View style={styles.placeholderContainer}>
          <QrImagePlaceholder
            height={IMAGE_HEIGHT}
            width={IMAGE_WIDTH}
          />
          <Text style={styles.noQrText}>Add QR to display them</Text>
        </View>
      )
    }
    return (
      <View style={styles.imageSliderContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          decelerationRate='fast'
          snapToInterval={IMAGE_WIDTH}
          snapToAlignment='center'
          contentContainerStyle={styles.scrollViewContent}>
          {qrImages.map((qr) => (
            <View
              key={qr._id}
              style={styles.imageWrapper}>
              <Text style={styles.bankName}>{qr?.bankName}</Text>
              <Image
                source={{ uri: qr?.qrPhoto }}
                style={styles.qrImage}
                resizeMode='contain'
              />
            </View>
          ))}
        </ScrollView>
        <View style={styles.paginationContainer}>
          {qrImages.map((qr, index) => (
            <View
              key={`dot-${qr._id}`}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
        <Text style={styles.imageCounter}>
          {currentIndex + 1} / {qrImages.length}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {isLoading && <Loader />}
      <Header title='QR Codes' />
      <View style={styles.mainContainer}>
        {renderQRImages()}
        <View style={styles.buttonContainer}>
          <CustomButton
            title='Add QR'
            width={140}
            onPress={() => setModalVisible(true)}
            disable={isLoadingImages || isLoading}
          />
          <CustomButton
            title='Delete QR'
            color={Colors.red}
            fontColor={Colors.white}
            width={140}
            onPress={deleteQrImage}
            disable={isLoadingImages || isLoading || qrImages.length === 0}
          />
        </View>
      </View>

      {/* Bank Name Input Modal */}
      <Modal
        animationType='slide'
        transparent
        visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Enter Bank Name</Text>
            <TextInput
              style={styles.input}
              placeholder='Bank Name'
              value={bankName}
              onChangeText={setBankName}
            />
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false)
                setPickerVisible(true)
              }}
              style={styles.galleryButton}>
              <Text style={[styles.buttonText, { color: Colors.white }]}>
                Camera / Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}>
              <Text style={[styles.buttonText, { color: Colors.darkText }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modern Picker Modal */}
      <ImagePickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onPickCamera={() => handlePick("camera")}
        onPickGallery={() => handlePick("gallery")}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Values.paddingHorizontal,
    paddingTop: Values.paddingTop,
    backgroundColor: Colors.background,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    gap: 40,
    paddingTop: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingBottom: 20,
  },
  imageSliderContainer: { width: "100%", alignItems: "center" },
  scrollViewContent: { alignItems: "center" },
  imageWrapper: {
    width: IMAGE_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 20,
  },
  qrImage: {
    width: IMAGE_WIDTH - 20,
    height: IMAGE_HEIGHT - 20,
    borderRadius: 12,
  },
  skeletonContainer: {
    height: 400,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around",
  },
  skeletonImage: {
    width: IMAGE_WIDTH - 100,
    height: IMAGE_HEIGHT - 20,
    borderRadius: 12,
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 400,
  },
  noQrText: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.darkText,
    fontFamily: "poppins-medium",
    textAlign: "center",
  },
  bankName: {
    marginTop: 20,
    fontSize: 20,
    color: Colors.darkText,
    fontFamily: "poppins-medium",
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },
  paginationDotActive: {
    backgroundColor: Colors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  imageCounter: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.grayText,
    fontFamily: "poppins-medium",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  label: { fontSize: 18, marginBottom: 10, fontFamily: "poppins-medium" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  galleryButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.grayStatus,
    padding: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: { fontFamily: "poppins-medium", fontSize: 14 },
})

export default Qr
