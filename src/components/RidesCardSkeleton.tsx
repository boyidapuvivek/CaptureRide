import React from "react"
import { StyleSheet, View } from "react-native"
import Colors from "../constants/Colors"
import SkeletonBox from "../utils/SkeletonBox"

const RidesCardSkeleton = () => {
  return (
    <View style={styles.container}>
      <View style={styles.cardContent}>
        {/* Left side - Image skeleton */}
        <View style={styles.imageContainer}>
          <SkeletonBox
            width={80}
            height={80}
            borderRadius={40}
            style={styles.imageSkeleton}
          />
        </View>

        {/* Right side - Content skeleton */}
        <View style={styles.contentSection}>
          {/* Header row skeleton */}
          <View style={styles.headerRow}>
            <View style={styles.nameSection}>
              {/* Customer name skeleton */}
              <SkeletonBox
                width={100}
                height={22}
                borderRadius={6}
                style={styles.customerNameSkeleton}
              />
            </View>

            {/* Quick actions skeleton */}
            <View style={styles.quickActions}>
              <SkeletonBox
                width={32}
                height={32}
                borderRadius={16}
              />
              <SkeletonBox
                width={32}
                height={32}
                borderRadius={16}
              />
            </View>
          </View>

          {/* Details section skeleton */}
          <View style={styles.detailsSection}>
            {/* Room number field skeleton */}
            <View style={styles.detailItem}>
              <SkeletonBox
                width={24}
                height={24}
                borderRadius={12}
              />
              <SkeletonBox
                width={80}
                height={16}
                borderRadius={4}
              />
            </View>

            {/* Phone number field skeleton */}
            <View style={styles.detailItem}>
              <SkeletonBox
                width={24}
                height={24}
                borderRadius={12}
              />
              <SkeletonBox
                width={120}
                height={16}
                borderRadius={4}
              />
            </View>
          </View>

          {/* Footer row skeleton */}
          <View style={styles.footerRow}>
            <SkeletonBox
              width={100}
              height={14}
              borderRadius={4}
            />
            <SkeletonBox
              width={32}
              height={32}
              borderRadius={16}
            />
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
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
  customerNameSkeleton: {
    marginBottom: 2,
  },

  quickActions: {
    flexDirection: "row",
    gap: 8,
  },
  detailsSection: {
    gap: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
})

export default RidesCardSkeleton
