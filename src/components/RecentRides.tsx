import React, { useState, useEffect, useCallback } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import Colors from "../constants/Colors"
import { Values } from "../constants/Values"
import RidesCard from "./RidesCard"
import { apiRoute } from "../api/apiConfig"
import { getAccessToken } from "../utils/authUtils"
import axios from "axios"
import RidesCardSkeleton from "../components/RidesCardSkeleton"
import { useRouter } from "expo-router"

interface RecentRidesProps {
  shouldRefresh?: boolean
  onRefreshComplete?: () => void
}

const RecentRides = ({
  shouldRefresh,
  onRefreshComplete,
}: RecentRidesProps) => {
  const [token, setToken] = useState<string | null>(null)
  const [recentRides, setRecentRides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessToken()
        setToken(accessToken)
      } catch (error) {
        console.error("Error fetching access token:", error)
        setLoading(false)
        setError(true)
      }
    }
    fetchToken()
  }, [])

  const fetchRecentRides = useCallback(async () => {
    if (!token) return

    setLoading(true)
    setError(false)

    try {
      const res = await axios.get(apiRoute.GETRIDES, {
        params: { page: 1, limit: 5 }, // Fetch only 5 recent rides
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      })

      const data = res.data?.data
      const rides = Array.isArray(data?.rides) ? data.rides.slice(0, 5) : []

      setRecentRides(rides)
    } catch (error) {
      console.error("Error fetching recent rides:", error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [token])

  // Initial fetch when token is available
  useEffect(() => {
    if (token) {
      fetchRecentRides()
    }
  }, [token, fetchRecentRides])

  // Handle external refresh trigger
  useEffect(() => {
    if (shouldRefresh && token) {
      fetchRecentRides().then(() => {
        onRefreshComplete?.()
      })
    }
  }, [shouldRefresh, token, fetchRecentRides, onRefreshComplete])

  // Auto-refresh when screen comes into focus (optional)
  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchRecentRides()
      }
    }, [token, fetchRecentRides])
  )

  const handleViewAll = () => {
    router.push("/(main)/allRides")
  }

  const handleRetry = () => {
    fetchRecentRides()
  }

  // Function to handle successful deletion
  const handleDeleteSuccess = useCallback(
    (deletedId: string) => {
      setRecentRides((prevRides) => {
        const updatedRides = prevRides.filter((ride) => ride._id !== deletedId)
        // If we have less than 5 rides after deletion, we might want to fetch fresh data
        if (updatedRides.length < 5 && prevRides.length === 5) {
          // Optionally refetch to get more recent rides
          setTimeout(() => fetchRecentRides(), 500)
        }
        return updatedRides
      })
    },
    [fetchRecentRides]
  )

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.title}>
            <View style={styles.bar} />
            <Text style={styles.sectionTitle}>Recent Rides</Text>
          </View>
        </View>
        <View style={styles.skeletonContainer}>
          {[...Array(3)].map((_, i) => (
            <RidesCardSkeleton key={i} />
          ))}
        </View>
      </View>
    )
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.title}>
            <View style={styles.bar} />
            <Text style={styles.sectionTitle}>Recent Rides</Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load recent rides</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // Empty state
  if (recentRides.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.title}>
            <View style={styles.bar} />
            <Text style={styles.sectionTitle}>Recent Rides</Text>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No recent rides available</Text>
        </View>
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
          onPress={handleViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        vertical
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {recentRides.map((ride, index) => (
          <View
            key={`${ride._id || index}-${index}`}
            style={styles.rideCard}>
            <RidesCard
              data={[ride]}
              onDeleteSuccess={handleDeleteSuccess}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: Values.paddingHorizontal,
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
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: Colors.transparent,
    borderRadius: 18,
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: "poppins-medium",
    color: Colors.primary,
  },
  scrollContainer: {
    paddingHorizontal: Values.paddingHorizontal,
    gap: 10,
  },
  rideCard: {
    marginBottom: 10,
  },
  skeletonContainer: {
    paddingHorizontal: Values.paddingHorizontal,
    gap: 10,
  },
  errorContainer: {
    paddingHorizontal: Values.paddingHorizontal,
    alignItems: "center",
    paddingVertical: 30,
  },
  errorText: {
    fontSize: 14,
    color: Colors.grayText,
    fontFamily: "poppins-regular",
    marginBottom: 15,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "poppins-medium",
  },
  emptyContainer: {
    paddingHorizontal: Values.paddingHorizontal,
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.grayText,
    fontFamily: "poppins-regular",
    textAlign: "center",
  },
})

export default RecentRides
