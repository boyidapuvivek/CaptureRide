import React from "react"
import { StyleSheet, View, Pressable } from "react-native"
import Colors from "../constants/Colors"
import Edit from "../assets/icons/allRides/edit.svg"
import Share from "../assets/icons/allRides/share.svg"
import Call from "../assets/icons/allRides/call.svg"
import SkeletonBox from "../utils/SkeletonBox" // Import the separate component

const RidesCardSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Image skeleton */}
      <SkeletonBox
        width={100}
        height={100}
        borderRadius={12}
        style={styles.image}
      />

      <View style={styles.mainContainer}>
        <View>
          {/* Customer name skeleton */}
          <SkeletonBox
            width={120}
            height={20}
            borderRadius={4}
            style={styles.customerNameSkeleton}
          />

          <View style={styles.customerDataField}>
            {/* Room number field skeleton */}
            <View style={styles.dataField}>
              <SkeletonBox
                width={20}
                height={20}
                borderRadius={10}
              />
              <SkeletonBox
                width={40}
                height={16}
                borderRadius={4}
              />
            </View>

            {/* Phone number field skeleton */}
            <View style={styles.dataField}>
              <SkeletonBox
                width={20}
                height={20}
                borderRadius={10}
              />
              <SkeletonBox
                width={100}
                height={16}
                borderRadius={4}
              />
            </View>
          </View>
        </View>

        {/* Action buttons - keeping them visible but you could skeleton these too */}
        <View style={styles.actionButtons}>
          <Pressable disabled>
            <Edit
              height={24}
              width={24}
              style={{ opacity: 0.6 }}
            />
          </Pressable>
          <Pressable disabled>
            <Share
              height={24}
              width={24}
              style={{ opacity: 0.6 }}
            />
          </Pressable>
          <Pressable disabled>
            <Call
              height={24}
              width={24}
              style={{ opacity: 0.6 }}
            />
          </Pressable>
        </View>
      </View>
    </View>
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
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderRightColor: "#00000026",
    borderBottomColor: "#00000026",
    marginBottom: 12,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 10,
  },
  image: {
    alignSelf: "center",
  },
  customerNameSkeleton: {
    marginBottom: 8,
  },
  customerDataField: {
    padding: 4,
    justifyContent: "center",
    gap: 8,
  },
  dataField: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
})

export default RidesCardSkeleton
