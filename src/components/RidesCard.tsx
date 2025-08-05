import React from "react"
import { Image, StyleSheet, Text, Pressable, View } from "react-native"
import Colors from "../constants/Colors"
import Number from "../assets/icons/roomNum.svg"
import Phone from "../assets/icons/phone.svg"
import Edit from "../assets/icons/allRides/edit.svg"
import Share from "../assets/icons/allRides/share.svg"
import Call from "../assets/icons/allRides/call.svg"
import SkeletonBox from "../utils/SkeletonBox"

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
}

const RidesCard = ({ data }: Props) => {
  return (
    <>
      {data.map((ride, index) => (
        <Pressable key={ride._id || index}>
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
                source={{ uri: ride.customerPhoto }}
                style={styles.image}
              />
            )}
            <View style={styles.mainContainer}>
              <View>
                <Text style={styles.customerName}>{ride.customerName}</Text>
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
                <Pressable>
                  <Edit
                    height={24}
                    width={24}
                  />
                </Pressable>
                <Pressable>
                  <Share
                    height={24}
                    width={24}
                  />
                </Pressable>
                <Pressable>
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
