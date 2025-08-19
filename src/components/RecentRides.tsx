import React, { useState, useEffect, useCallback } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Pressable,
} from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import Colors from "../constants/Colors"
import { Values } from "../constants/Values"
import RidesCard from "./RidesCard"
import { apiRoute } from "../api/apiConfig"
import { getAccessToken, storeUserData } from "../utils/authUtils"
import axios from "axios"
import RidesCardSkeleton from "../components/RidesCardSkeleton"
import { useRouter } from "expo-router"
import useFetchToken from "../utils/useFetchToken"
import Number from "../assets/icons/roomNum.svg"
import Phone from "../assets/icons/phone.svg"
import SkeletonBox from "../utils/SkeletonBox"
import { FontAwesome, Ionicons } from "@expo/vector-icons"

const RecentRides = () => {
  const [data, setData] = useState<[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const router = useRouter()
  const token = useFetchToken()

  const handleViewAll = () => {
    router.push("/(main)/allRides")
  }
  const handleAdd = () => {
    router.push("/(main)/addRide")
  }

  const fetchData = async (token: string) => {
    setLoading(true)
    try {
      const res = await axios.get(apiRoute.GETRIDES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: 1,
          limit: 5,
        },
      })
      setData(res?.data?.rides)
      setLoading(false)
    } catch (error) {
      Alert.alert("Unable to fetch Rides", "Retry after sometime")
      setLoading(false)
    }
  }

  const handlePress = (ride) => {
    router.push({
      pathname: "/(screens)/rideDetails/[id]",
      params: {
        id: ride._id,
        data: JSON.stringify(ride),
      },
    })
  }

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchData(token)
      }
    }, [token])
  )
  //Empty State
  if (!loading && (!data || data.length === 0)) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.title}>
            <View style={styles.bar} />
            <Text style={styles.sectionTitle}>Recent Rides</Text>
          </View>
        </View>

        <View style={styles.emptyStateWrapper}>
          <Ionicons
            name='bicycle-outline'
            size={80}
            color={Colors.grayText}
          />
          <Text style={styles.emptyTitle}>No Rides Yet</Text>
          <Text style={styles.emptySubtitle}>
            Start by adding your first ride to see it here.
          </Text>

          <TouchableOpacity
            style={styles.addRideButton}
            onPress={handleViewAll}>
            <FontAwesome
              name='plus'
              size={22}
              color={Colors.white}
            />
            <Text style={styles.addRideButtonText}> Add Ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  //Skleton Container
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.title}>
            <View style={styles.bar} />
            <Text style={styles.sectionTitle}>Recent Rides</Text>
          </View>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={handleViewAll}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal>
          {data?.map((ride, index) => (
            <Pressable
              key={index}
              onPress={() => handlePress(ride)}>
              <View style={styles.cardContainer}>
                <SkeletonBox
                  height={100}
                  width={100}
                />
                <View style={styles.skeletonTextContainer}>
                  <SkeletonBox
                    height={20}
                    width={"auto"}
                  />
                  <View style={{ gap: 5 }}>
                    <View style={styles.details}>
                      <Number
                        height={18}
                        width={18}
                      />
                      <SkeletonBox
                        height={20}
                        width={60}
                      />
                    </View>

                    <View style={styles.details}>
                      <Phone
                        height={18}
                        width={18}
                      />
                      <SkeletonBox
                        height={20}
                        width={90}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    )
  }

  // Main content
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.title}>
          <View style={styles.bar} />
          <Text style={styles.sectionTitle}>Recent Rides</Text>
        </View>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={handleAdd}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}>
        {data?.map((ride, index) => (
          <Pressable
            key={index}
            onPress={() => handlePress(ride)}>
            <View style={styles.cardContainer}>
              <Image
                source={{ uri: ride?.customerPhoto }}
                style={styles.customerImage}
              />
              <View style={styles.textContainer}>
                <Text style={styles.customerName}>{ride?.customerName}</Text>
                <View>
                  <View style={styles.details}>
                    <Number
                      height={18}
                      width={18}
                    />
                    <Text style={styles.detailsText}>{ride?.roomNumber}</Text>
                  </View>

                  <View style={styles.details}>
                    <Phone
                      height={18}
                      width={18}
                    />
                    <Text style={styles.detailsText}>{ride?.phoneNumber}</Text>
                  </View>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: Values.paddingHorizontal,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "space-between",
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bar: {
    height: 25,
    width: 6,
    backgroundColor: Colors.secondary,
    borderRadius: 50,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: "poppins-semibold",
    color: Colors.primaryText,
  },
  viewAllButton: {
    height: 35,
    paddingHorizontal: 10,
    backgroundColor: Colors.transparent,
    borderRadius: 18,
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 16,
    fontFamily: "poppins-medium",
    color: Colors.primary,
  },

  cardContainer: {
    backgroundColor: Colors.transparent,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    padding: 20,
    marginRight: 10,
  },
  customerImage: {
    height: 100,
    width: 100,
  },
  textContainer: {
    height: 100,
  },
  customerName: {
    fontFamily: "poppins-semibold",
    fontSize: 16,
  },
  details: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailsText: {
    fontFamily: "poppins-medium",
    fontSize: 12,
    color: Colors.grayText,
    textAlign: "center",
  },

  emptyStateWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "poppins-semibold",
    color: Colors.primaryText,
    marginTop: 15,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: "poppins-medium",
    color: Colors.grayText,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  addRideButton: {
    backgroundColor: Colors.primary,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 30,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  addRideButtonText: {
    fontSize: 16,
    fontFamily: "poppins-semibold",
    color: Colors.white,
  },

  skeletonTextContainer: {
    height: 100,
    gap: 10,
  },
})

export default RecentRides
