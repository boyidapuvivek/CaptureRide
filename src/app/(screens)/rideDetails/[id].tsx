import { useLocalSearchParams } from "expo-router"
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Linking,
  Alert,
} from "react-native"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import Colors from "../../../constants/Colors"
import Header from "../../../components/Header"
import { Values } from "../../../constants/Values"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const { width, height } = Dimensions.get("window")

export default function RideDetails() {
  const { data } = useLocalSearchParams()
  const ride = JSON.parse(data as string)
  const insets = useSafeAreaInsets()

  const [modalVisible, setModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")

  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri)
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setSelectedImage("")
  }

  const handlePhoneCall = () => {
    const phoneNumber = ride.phoneNumber
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`)
    } else {
      Alert.alert("Error", "Phone number not available")
    }
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Header title='Ride Details' />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={() => openImageModal(ride.customerPhoto)}
            activeOpacity={0.8}>
            <Image
              source={{ uri: ride.customerPhoto }}
              style={styles.profileImage}
              resizeMode='cover'
            />
            <View style={styles.profileImageOverlay}>
              <Ionicons
                name='expand-outline'
                size={20}
                color={Colors.white}
              />
            </View>
          </TouchableOpacity>

          <Text style={styles.customerName}>{ride.customerName}</Text>
          <View style={styles.roomBadge}>
            <Text style={styles.roomText}>Room {ride.roomNumber}</Text>
          </View>
        </View>

        {/* Info Cards Container */}
        <View style={styles.cardsContainer}>
          {/* Contact Info Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <Ionicons
                  name='person-outline'
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.cardTitle}>Customer Details</Text>
            </View>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={handlePhoneCall}
              activeOpacity={0.7}>
              <View style={styles.contactIconContainer}>
                <Ionicons
                  name='call'
                  size={18}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Phone Number</Text>
                <Text style={styles.contactValue}>{ride.phoneNumber}</Text>
              </View>
              <Ionicons
                name='chevron-forward'
                size={18}
                color={Colors.gray}
              />
            </TouchableOpacity>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons
                  name='car'
                  size={18}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Vehicle Number</Text>
                <Text style={styles.infoValue}>{ride.vehicleNumber}</Text>
              </View>
            </View>
          </View>

          {/* Documents Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconContainer}>
                <Ionicons
                  name='document-text-outline'
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <Text style={styles.cardTitle}>Documents</Text>
            </View>

            <View style={styles.documentsGrid}>
              <TouchableOpacity
                style={styles.documentCard}
                onPress={() => openImageModal(ride.aadharPhoto)}
                activeOpacity={0.8}>
                <View style={styles.documentImageWrapper}>
                  <Image
                    source={{ uri: ride.aadharPhoto }}
                    style={styles.documentImage}
                    resizeMode='cover'
                  />
                  <View style={styles.documentOverlay}>
                    <Ionicons
                      name='expand-outline'
                      size={16}
                      color={Colors.white}
                    />
                  </View>
                </View>
                <Text style={styles.documentTitle}>Aadhar Card</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.documentCard}
                onPress={() => openImageModal(ride.dlPhoto)}
                activeOpacity={0.8}>
                <View style={styles.documentImageWrapper}>
                  <Image
                    source={{ uri: ride.dlPhoto }}
                    style={styles.documentImage}
                    resizeMode='cover'
                  />
                  <View style={styles.documentOverlay}>
                    <Ionicons
                      name='expand-outline'
                      size={16}
                      color={Colors.white}
                    />
                  </View>
                </View>
                <Text style={styles.documentTitle}>Driving License</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType='fade'
        onRequestClose={closeModal}
        statusBarTranslucent>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={closeModal}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModal}
                activeOpacity={0.8}>
                <Ionicons
                  name='close'
                  size={24}
                  color={Colors.white}
                />
              </TouchableOpacity>

              <Image
                source={{ uri: selectedImage }}
                style={styles.fullImage}
                resizeMode='contain'
              />
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    backgroundColor: Colors.background,
    paddingTop: Values.paddingTop,
    paddingHorizontal: Values.paddingHorizontal,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  // Profile Section
  profileSection: {
    backgroundColor: Colors.white,
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.lightGray,
  },
  profileImageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.8,
  },
  customerName: {
    fontSize: 20,
    fontFamily: "poppins-semibold",
    color: Colors.darkText,
    marginBottom: 8,
    textAlign: "center",
  },
  roomBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roomText: {
    fontSize: 14,
    fontFamily: "poppins-medium",
    color: Colors.white,
  },

  // Cards Container
  cardsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },

  // Card Styles
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  cardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.transparent,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "poppins-semibold",
    color: Colors.darkText,
  },

  // Contact Item (Clickable)
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAFF",
  },
  contactIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    marginRight: 12,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: Colors.grayText,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontFamily: "poppins-medium",
    color: Colors.darkText,
  },

  // Info Item (Non-clickable)
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.transparent,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.grayText,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontFamily: "poppins-medium",
    color: Colors.darkText,
  },

  // Documents Grid
  documentsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  documentCard: {
    flex: 1,
    alignItems: "center",
  },
  documentImageWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: 1.4,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
    backgroundColor: Colors.lightGray,
  },
  documentImage: {
    width: "100%",
    height: "100%",
  },
  documentOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  documentTitle: {
    fontSize: 13,
    fontFamily: "poppins-medium",
    color: Colors.darkText,
    textAlign: "center",
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.grayStatus,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    height: "80%",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: -50,
    right: 10,
    zIndex: 1,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
})
