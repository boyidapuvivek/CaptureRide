import React from "react"
import {
  Image,
  StyleSheet,
  Text,
  Pressable,
  View,
  Alert,
  Linking,
  Share,
} from "react-native"
import Colors from "../constants/Colors"
import Number from "../assets/icons/roomNum.svg"
import Phone from "../assets/icons/phone.svg"
import Delete from "../assets/icons/allRides/delete.svg"
import ShareImg from "../assets/icons/allRides/share.svg"
import Call from "../assets/icons/allRides/call.svg"
import SkeletonBox from "../utils/SkeletonBox"
import { useRouter } from "expo-router"
import axios from "axios"
import { apiRoute } from "../api/apiConfig"
import useFetchToken from "../utils/useFetchToken"

type Ride = {
  _id: string
  roomNumber: string
  customerName: string
  phoneNumber: string
  vehicleNumber: string
  aadharPhoto: string
  dlPhoto: string
  customerPhoto: string
}

type Props = {
  data: Ride[]
  onDeleteSuccess?: (deletedId: string) => void
}

const RidesCard = ({ data, onDeleteSuccess }: Props) => {
  const router = useRouter()
  const token = useFetchToken()

  const handlePress = (ride) => {
    router.push({
      pathname: "/(screens)/rideDetails/[id]",
      params: {
        id: ride._id,
        data: JSON.stringify(ride),
      },
    })
  }

  const handleDelete = async (rideId: string) => {
    Alert.alert("Delete Ride", "Are you sure you want to delete this ride?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await axios.delete(apiRoute.DELETERIDE, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                id: rideId,
              },
            })

            if (res?.status === 200) {
              Alert.alert("Success", "Ride deleted successfully")
              if (onDeleteSuccess) {
                onDeleteSuccess(rideId)
              }
            }
          } catch (error) {
            Alert.alert("Error", "Failed to delete ride. Please try again.")
          }
        },
      },
    ])
  }

  const handleCall = async (phoneNumber: string) => {
    try {
      const cleanedNumber = phoneNumber.replace(/\D/g, "")
      const phoneUrl = `tel:${cleanedNumber}`
      await Linking.openURL(phoneUrl)
    } catch (error) {
      Alert.alert("Error", "Failed to make call. Please try again.")
    }
  }

  const handleShare = async (ride: Ride) => {
    try {
      const shareContent = {
        title: "Ride Details",
        message: `🚗 Ride Information:\n\n👤 Customer: ${
          ride.customerName
        }\n🏠 Room: ${ride.roomNumber}\n📞 Phone: ${
          ride.phoneNumber
        }\n🚙 Vehicle: ${ride.vehicleNumber || "N/A"}`,
        url: "",
      }

      const result = await Share.share(shareContent, {
        dialogTitle: "Share Ride Details",
        subject: "Ride Information",
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          Alert.alert("Shared via:", result.activityType)
        } else {
          alert("Shared successfully")
        }
      } else if (result.action === Share.dismissedAction) {
        alert("Shared successfully")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to share ride details. Please try again.")
    }
  }

  return (
    <>
      {data.map((ride, index) => (
        <Pressable
          key={ride._id || index}
          onPress={() => handlePress(ride)}
          style={({ pressed }) => [
            styles.container,
            pressed && styles.containerPressed,
          ]}>
          <View style={styles.cardContent}>
            {/* Left side - Image */}
            <View style={styles.imageContainer}>
              {ride.customerPhoto === "pending" ? (
                <SkeletonBox
                  width={80}
                  height={80}
                  borderRadius={40}
                  style={styles.imageSkeleton}
                />
              ) : (
                <Image
                  source={{ uri: ride?.customerPhoto }}
                  style={styles.customerImage}
                />
              )}
            </View>

            {/* Right side - Content */}
            <View style={styles.contentSection}>
              {/* Header with name and actions */}
              <View style={styles.headerRow}>
                <View style={styles.nameSection}>
                  <Text
                    style={styles.customerName}
                    numberOfLines={1}>
                    {ride?.customerName}
                  </Text>
                </View>

                <View style={styles.quickActions}>
                  <Pressable
                    style={[styles.actionButton, styles.callButton]}
                    onPress={() => handleCall(ride.phoneNumber)}>
                    <Call
                      height={16}
                      width={16}
                      color='#fff'
                    />
                  </Pressable>
                  <Pressable
                    style={[styles.actionButton, styles.shareButton]}
                    onPress={() => handleShare(ride)}>
                    <ShareImg
                      height={16}
                      width={16}
                      color='#6366f1'
                    />
                  </Pressable>
                </View>
              </View>

              {/* Details section */}
              <View style={styles.detailsSection}>
                <View style={styles.detailItem}>
                  <View style={styles.iconWrapper}>
                    <Number
                      height={14}
                      width={14}
                      color='#6b7280'
                    />
                  </View>
                  <Text style={styles.detailText}>Room {ride.roomNumber}</Text>
                </View>

                <View style={styles.detailItem}>
                  <View style={styles.iconWrapper}>
                    <Phone
                      height={14}
                      width={14}
                      color='#6b7280'
                    />
                  </View>
                  <Text style={styles.detailText}>{ride.phoneNumber}</Text>
                </View>
              </View>

              {/* Footer with delete action */}
              <View style={styles.footerRow}>
                <Text style={styles.vehicleText}>
                  {ride.vehicleNumber || "No vehicle info"}
                </Text>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDelete(ride._id)}>
                  <Delete
                    height={16}
                    width={16}
                    color='#ef4444'
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </Pressable>
      ))}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: Colors.lightGray,
  },
  containerPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  cardContent: {
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  customerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f3f4f6",
  },
  imageSkeleton: {
    alignSelf: "center",
  },
  contentSection: {
    flex: 1,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  nameSection: {
    flex: 1,
    gap: 6,
  },
  customerName: {
    fontSize: 18,
    color: "#111827",
    fontFamily: "poppins-semibold",
  },
  quickActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  callButton: {
    backgroundColor: "#22c55e",
  },
  shareButton: {
    backgroundColor: "#e0e7ff",
  },
  detailsSection: {
    gap: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#374151",
    fontFamily: "poppins-medium",
    flex: 1,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  vehicleText: {
    fontSize: 13,
    color: "#6b7280",
    fontFamily: "poppins-regular",
    fontStyle: "italic",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
  },
})

export default RidesCard
