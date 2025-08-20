import React, { useState, useEffect, useCallback } from "react"
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import Colors from "../../constants/Colors"
import Header from "../../components/Header"
import { Values } from "../../constants/Values"
import RidesCard from "../../components/RidesCard"
import { apiRoute } from "../../api/apiConfig"
import { getAccessToken } from "../../utils/authUtils"
import axios from "axios"
import RidesCardSkeleton from "../../components/RidesCardSkeleton"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import useFetchToken from "../../utils/useFetchToken"

const AllRides = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const router = useRouter()
  const token = useFetchToken()

  useEffect(() => {
    console.log("Data length:", data.length)
    if (data.length > 1000) {
      console.warn("Data array getting very large:", data.length)
    }
  }, [data])

  const fetchData = async (
    pageNum: number,
    isRefresh = false,
    isLoadMore = false
  ) => {
    if (!token) return

    if (loading || loadingMore) return

    if (isRefresh) {
      setRefreshing(true)
    } else if (isLoadMore) {
      setLoadingMore(true)
    } else if (pageNum === 1 && data.length === 0) {
      setInitialLoading(true)
    }

    setLoading(true)

    try {
      const res = await axios.get(apiRoute.GETRIDES, {
        params: { page: pageNum },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      })

      const responseData = res?.data

      const rides = Array.isArray(responseData?.rides)
        ? responseData?.rides
        : []

      if (isRefresh) {
        setData(rides)
        setPage(2)
      } else if (isLoadMore || pageNum > 1) {
        setData((prev) => [...prev, ...rides])
      } else {
        setData(rides)
        setPage(2)
      }

      setHasMore(responseData?.pagination?.hasNext || false)
    } catch (error) {
    } finally {
      setLoading(false)
      setInitialLoading(false)
      setRefreshing(false)
      setLoadingMore(false)
    }
  }

  // Auto-refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (token) {
        // Reset pagination and refresh data
        setPage(1)
        fetchData(1, true)
      }
    }, [token])
  )

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore && data.length > 0) {
      fetchData(page, false, true)
      setPage((prev) => prev + 1)
    }
  }, [loading, loadingMore, hasMore, page, data.length])

  const handleRefresh = useCallback(() => {
    if (!refreshing && !loading) {
      setPage(1)
      fetchData(1, true)
    }
  }, [refreshing, loading])

  const handleAddRides = () => {
    router.push("/(main)/addRide")
  }

  // Function to handle successful deletion from RidesCard
  const handleDeleteSuccess = useCallback((deletedId: string) => {
    setData((prevData) => prevData.filter((ride) => ride._id !== deletedId))
  }, [])

  // Render skeleton loader for initial loading
  if (initialLoading && token) {
    return (
      <View style={styles.container}>
        <Header title={"All Rides"} />
        <View style={styles.skeletonContainer}>
          {[...Array(5)].map((_, i) => (
            <RidesCardSkeleton key={i} />
          ))}
        </View>
      </View>
    )
  }

  const EmptyState = () => (
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
        You haven’t added any rides yet. Add Rides to display data.
      </Text>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={handleAddRides}
        activeOpacity={0.8}>
        <Ionicons
          name='add'
          size={18}
          color={Colors.white}
        />
        <Text style={styles.refreshButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <Header title={"All Rides"} />

      <FlatList
        data={data}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <RidesCard
            data={[item]}
            onDeleteSuccess={handleDeleteSuccess}
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={data.length === 0 ? styles.emptyList : undefined}
        ListEmptyComponent={!initialLoading ? EmptyState : null}
        ListFooterComponent={() => {
          if (loadingMore) {
            return (
              <View style={styles.loadMoreContainer}>
                <ActivityIndicator
                  size='small'
                  color={Colors.primary}
                />
                <Text style={styles.loadMoreText}>Loading more rides...</Text>
              </View>
            )
          }
          return null
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Values.paddingHorizontal,
    paddingTop: Values.paddingTop,
    gap: 20,
  },
  skeletonContainer: {
    flex: 1,
  },
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  refreshButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: "poppins-semibold",
  },

  emptyList: {
    flexGrow: 1,
  },
  loadMoreContainer: {
    paddingVertical: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  loadMoreText: {
    fontSize: 14,
    color: Colors.grayText,
    fontFamily: "poppins-regular",
  },
})

export default AllRides
