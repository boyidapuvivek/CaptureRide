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
} from "react-native"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import Colors from "../../../constants/Colors"
import Header from "../../../components/Header"
import { Values } from "../../../constants/Values"

const { width, height } = Dimensions.get("window")

export default function RideDetails() {
  const { data } = useLocalSearchParams()
  const ride = JSON.parse(data as string)

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header title={"Ride Details"} />
      </View>
      <ScrollView contentContainerStyle={styles.mainContainer}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity
              onPress={() => openImageModal(ride.customerPhoto)}>
              <Image
                source={{ uri: ride.customerPhoto }}
                style={styles.profileImage}
              />
              <View style={styles.profileImageOverlay}>
                <Ionicons
                  name='expand-outline'
                  size={24}
                  color={Colors.white}
                />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{ride.customerName}</Text>
          <Text style={styles.roomNumber}>Room {ride.roomNumber}</Text>
        </View>

        {/* Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons
              name='information-circle-outline'
              size={24}
              color={Colors.primary}
            />
            <Text style={styles.cardTitle}>Customer Information</Text>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons
                name='call-outline'
                size={20}
                color={Colors.primary}
              />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Phone Number</Text>
              <Text style={styles.detailValue}>{ride.phoneNumber}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons
                name='car-outline'
                size={20}
                color={Colors.primary}
              />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Vehicle Number</Text>
              <Text style={styles.detailValue}>{ride.vehicleNumber}</Text>
            </View>
          </View>
        </View>

        {/* Documents Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons
              name='document-attach-outline'
              size={24}
              color={Colors.primary}
            />
            <Text style={styles.cardTitle}>Documents</Text>
          </View>

          <View style={styles.documentsGrid}>
            <TouchableOpacity
              style={styles.documentItem}
              onPress={() => openImageModal(ride.aadharPhoto)}>
              <View style={styles.documentImageContainer}>
                <Image
                  source={{ uri: ride.aadharPhoto }}
                  style={styles.documentImage}
                />
                <View style={styles.documentOverlay}>
                  <Ionicons
                    name='expand-outline'
                    size={24}
                    color={Colors.white}
                  />
                </View>
              </View>
              <Text style={styles.documentLabel}>Aadhar Card</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.documentItem}
              onPress={() => openImageModal(ride.dlPhoto)}>
              <View style={styles.documentImageContainer}>
                <Image
                  source={{ uri: ride.dlPhoto }}
                  style={styles.documentImage}
                />
                <View style={styles.documentOverlay}>
                  <Ionicons
                    name='expand-outline'
                    size={24}
                    color={Colors.white}
                  />
                </View>
              </View>
              <Text style={styles.documentLabel}>Driving License</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType='fade'
        onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={closeModal}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeModal}>
                <Ionicons
                  name='close'
                  size={30}
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
    backgroundColor: Colors.transparent,
  },
  header: {
    backgroundColor: Colors.background,
    paddingTop: Values.paddingTop,
    paddingHorizontal: Values.paddingHorizontal,
  },
  mainContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  // Profile Section
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: Colors.primary,
  },
  profileImageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 70,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0,
  },
  name: {
    fontFamily: "poppins-bold",
    fontSize: 24,
    color: Colors.dark,
    marginBottom: 4,
    textAlign: "center",
  },
  roomNumber: {
    fontFamily: "poppins-medium",
    fontSize: 16,
    color: Colors.grayText,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  // Cards
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  cardTitle: {
    fontFamily: "poppins-semibold",
    fontSize: 18,
    color: Colors.dark,
    marginLeft: 8,
  },
  // Detail Items
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.transparent,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontFamily: "poppins-regular",
    fontSize: 14,
    color: Colors.grayText,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: "poppins-medium",
    fontSize: 16,
    color: Colors.dark,
  },
  // Documents
  documentsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  documentItem: {
    width: "48%",
    marginBottom: 16,
  },
  documentImageContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    aspectRatio: 1,
    marginBottom: 8,
  },
  documentImage: {
    width: "100%",
    height: "100%",
  },
  documentOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  documentLabel: {
    fontFamily: "poppins-medium",
    fontSize: 14,
    color: Colors.dark,
    textAlign: "center",
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    height: "80%",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: -50,
    right: 0,
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
})
