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
              // Call the callback to update the parent component's state
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
      // Clean the phone number by removing all non-digit characters
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
        subject: "Ride Information", // For email sharing
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
          onPress={() => handlePress(ride)}>
          <View style={styles.container}>
            {ride.customerPhoto === "pending" ? (
              <SkeletonBox
                width={100}
                height={100}
                borderRadius={12}
                style={styles.imageSkeleton}
              />
            ) : (
              <Image
                source={{ uri: ride?.customerPhoto }}
                style={styles.image}
                resizeMode='contain'
              />
            )}
            <View style={styles.mainContainer}>
              <View>
                <Text style={styles.customerName}>{ride?.customerName}</Text>
                <View style={styles.customerDataField}>
                  <View style={styles.dataField}>
                    <Number
                      height={20}
                      width={20}
                    />
                    <Text style={styles.dataFieldText}>{ride.roomNumber}</Text>
                  </View>

                  <View style={styles.dataField}>
                    <Phone
                      height={20}
                      width={20}
                    />
                    <Text style={styles.dataFieldText}>{ride.phoneNumber}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.actionButtons}>
                <Pressable onPress={() => handleDelete(ride._id)}>
                  <Delete
                    height={24}
                    width={24}
                  />
                </Pressable>
                <Pressable onPress={() => handleShare(ride)}>
                  <ShareImg
                    height={24}
                    width={24}
                  />
                </Pressable>
                <Pressable onPress={() => handleCall(ride.phoneNumber)}>
                  <Call
                    height={24}
                    width={24}
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
    paddingHorizontal: 30,
    paddingVertical: 18,
    width: "100%",
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.grayStatus,
    marginBottom: 12,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
  },
  imageSkeleton: {
    alignSelf: "center",
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 12,
    alignSelf: "center",
  },
  customerName: {
    fontFamily: "poppins-semibold",
    fontSize: 16,
    color: Colors.black,
  },
  customerDataField: {
    padding: 4,
    justifyContent: "center",
  },
  dataField: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  dataFieldText: {
    fontFamily: "poppins-medium",
    fontSize: 14,
    textAlign: "center",
    color: Colors.grayText,
  },
  actionButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
})

export default RidesCard
