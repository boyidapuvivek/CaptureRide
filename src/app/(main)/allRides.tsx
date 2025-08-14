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

const AllRides = () => {
  const [token, setToken] = useState<string | null>(null)
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessToken()
        setToken(accessToken)
      } catch (error) {
        console.error("Error fetching access token:", error)
        setInitialLoading(false)
      }
    }
    fetchToken()
  }, [])

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

      const responseData = res.data?.data
      const rides = Array.isArray(responseData?.rides) ? responseData.rides : []

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
      console.error("Error fetching rides:", error)
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

  // Function to handle successful deletion from RidesCard
  const handleDeleteSuccess = useCallback((deletedId: string) => {
    setData((prevData) => prevData.filter((ride) => ride._id !== deletedId))
  }, [])

  // Render skeleton loader for initial loading
  if (initialLoading || (!token && data.length === 0)) {
    return (
      <View style={styles.container}>
        <Header title={"All Rides"} />
        <View style={styles.skeletonContainer}>
          {[...Array(6)].map((_, i) => (
            <RidesCardSkeleton key={i} />
          ))}
        </View>
      </View>
    )
  }

  // Empty state component
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No rides available</Text>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={handleRefresh}
        disabled={refreshing}>
        <Text style={styles.refreshButtonText}>Tap to Refresh</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <Header title={"All Rides"} />

      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item._id || index}-${index}`}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.grayText,
    fontFamily: "poppins-medium",
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  refreshButtonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "poppins-medium",
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
