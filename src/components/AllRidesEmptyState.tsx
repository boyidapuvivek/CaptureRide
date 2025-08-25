import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import Colors from "../constants/Colors"
import { useRouter } from "expo-router"

const AllRidesEmptyState = ({ clearSearch }) => {
  const router = useRouter()
  const handleAddRide = () => {
    router.push("/(main)/addRide")
  }

  return (
    <View style={styles.emptyCard}>
      <View style={styles.iconWrapper}>
        <Ionicons
          name='bicycle-outline'
          size={60}
          color={Colors.primary}
        />
      </View>
      <Text style={styles.emptyTitle}>No Rides Found</Text>
      <Text style={styles.emptySubtitle}>
        You haven't added any rides yet. Add Rides to display data.
      </Text>
      <View style={{ gap: 10 }}>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={clearSearch}
          activeOpacity={0.8}>
          <Ionicons
            name='refresh'
            size={18}
            color={Colors.white}
          />
          <Text style={styles.refreshButtonText}>Clear Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleAddRide}
          activeOpacity={0.8}>
          <MaterialIcons
            name='add'
            size={20}
            color={Colors.white}
          />
          <Text style={styles.refreshButtonText}>Add Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  emptyCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    marginBottom: 100,
  },
  iconWrapper: {
    height: 90,
    width: 90,
    borderRadius: 45,
    backgroundColor: "#F4F7FA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "poppins-semibold",
    color: Colors.primaryText,
    marginBottom: 6,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "poppins-medium",
    color: Colors.grayText,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  refreshButton: {
    minWidth: 200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  refreshButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "poppins-semibold",
    marginLeft: 6,
  },
})

export default AllRidesEmptyState
