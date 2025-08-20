import React, { useEffect, useState, useRef, useCallback } from "react"
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import Header from "../../components/Header"
import { Values } from "../../constants/Values"
import QrImagePlaceholder from "../../assets/icons/qr_placeholder.svg"
import CustomButton from "../../components/CustomButton"
import Colors from "../../constants/Colors"
import axios from "axios"
import { apiRoute } from "../../api/apiConfig"
import { getAccessToken } from "../../utils/authUtils"
import SkeletonBox from "../../utils/SkeletonBox"
import useFetchToken from "../../utils/useFetchToken"
import Loader from "../../components/Loader"

const { width: screenWidth } = Dimensions.get("window")
const IMAGE_WIDTH = screenWidth - Values.paddingHorizontal * 2
const IMAGE_HEIGHT = 300

const Qr = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [qrImages, setQrImages] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [bankName, setBankName] = useState("")

  const scrollViewRef = useRef(null)

  const token = useFetchToken()

  // Request permissions on component mount
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Camera roll access is needed to select QR images."
          )
        }
      } catch (error) {
        Alert.alert("Error requesting permissions", error?.message)
      }
    }

    requestPermissions()
  }, [])

  // Fetch QR images when token is available
  useEffect(() => {
    if (token) {
      fetchQRImages()
    }
  }, [token])

  const fetchQRImages = useCallback(async () => {
    if (!token) return

    setIsLoadingImages(true)
    try {
      const response = await axios.get(apiRoute.GETQR, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const qrData = response?.data?.qrs || []
      setQrImages(qrData)

      if (qrData.length > 0) {
        setCurrentIndex(0)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load QR images")
    } finally {
      setIsLoadingImages(false)
    }
  }, [token])

  useEffect(() => {
    if (qrImages.length === 0) {
      setCurrentIndex(0)
    } else if (currentIndex >= qrImages.length) {
      setCurrentIndex(qrImages.length - 1) // ✅ Prevent out-of-bounds
    }
  }, [qrImages.length, currentIndex])

  // ✅ Clear selected image after upload
  const pickImage = async () => {
    try {
      setModalVisible(false)

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      })

      if (!result.canceled && result.assets?.[0]) {
        const imageUri = result.assets[0].uri
        setSelectedImage(imageUri)

        if (bankName.trim()) {
          // ✅ Validate bank name
          await uploadImage(imageUri)
        } else {
          Alert.alert("Error", "Please enter a bank name")
          setSelectedImage(null)
        }
      }
    } catch (error) {
      console.error("Image picker error:", error)
      Alert.alert("Error", "Failed to pick image")
      setSelectedImage(null) // ✅ Clear on error
    }
  }

  const uploadImage = async (imageUri) => {
    setIsLoading(true)
    if (!token) {
      Alert.alert("Error", "Authentication token not available")
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
      })

      const response = await axios.post(apiRoute.ADDQR, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      })

      if (response.status === 201) {
        await fetchQRImages()
        setBankName("")
      }
    } catch (error) {
      console.error("Upload error:", error)
      Alert.alert("Error", "Failed to upload QR code")
    } finally {
      setIsLoading(false)
      setSelectedImage(null)
    }
  }

  const deleteQrImage = async () => {
    if (!token || qrImages.length === 0) return

    const currentQr = qrImages[currentIndex]

    Alert.alert("Confirm Delete", "Are you sure you want to delete this QR?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setIsLoading(true)
            await axios.delete(apiRoute.DELETEQR, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                id: currentQr._id,
              },
            })
            await fetchQRImages()
            setIsLoading(false)
          } catch (error) {
            setIsLoading(false)
            Alert.alert("Error", "Failed to delete QR code")
          }
        },
      },
    ])
  }

  const showImagePickerOptions = () => {
    setModalVisible(true)
  }

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset
    const viewSize = event.nativeEvent.layoutMeasurement

    // Calculate current page index
    const pageIndex = Math.floor(contentOffset.x / viewSize.width)
    setCurrentIndex(pageIndex)
  }

  const scrollToIndex = (index) => {
    if (scrollViewRef.current && index >= 0 && index < qrImages.length) {
      scrollViewRef.current.scrollTo({
        x: index * IMAGE_WIDTH,
        animated: true,
      })
      setCurrentIndex(index)
    }
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
          {qrImages.map((qr, index) => (
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

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {qrImages.map((qr, index) => (
            <View
              key={`dot-${qr._id}`} // ✅ Unique key
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        {/* Image Counter */}
        <Text style={styles.imageCounter}>
          {currentIndex + 1} / {qrImages.length}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Show loader overlay when loading */}
      {isLoading && <Loader />}

      <Header title='QR Codes' />
      <View style={styles.mainContainer}>
        {renderQRImages()}

        <View style={styles.buttonContainer}>
          <CustomButton
            title={"Add QR"}
            width={140}
            onPress={showImagePickerOptions}
            disable={isLoadingImages || isLoading} // ✅ Disable during upload too
          />
          <CustomButton
            title='Delete Qr'
            color={Colors.red}
            fontColor={Colors.white}
            width={140}
            onPress={deleteQrImage}
            disable={isLoadingImages || isLoading || qrImages.length === 0} // ✅ Better disable logic
          />
        </View>
      </View>

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
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
              onPress={pickImage}
              style={styles.galleryButton}>
              <Text style={[styles.buttonText, { color: Colors.white }]}>
                Gallery
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
  imageSliderContainer: {
    width: "100%",
    alignItems: "center",
  },
  scrollViewContent: {
    alignItems: "center",
  },
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
  //Skleton styles
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
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: IMAGE_HEIGHT,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
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
    backgroundColor: Colors.primary || "#007AFF",
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
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: "poppins-medium",
  },
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
  buttonText: {
    fontFamily: "poppins-medium",
    fontSize: 14,
  },
})

export default Qr
