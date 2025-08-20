import React, { useState, useCallback, useEffect } from "react"
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import axios from "axios"

import Colors from "../../constants/Colors"
import { Values } from "../../constants/Values"
import Header from "../../components/Header"
import RidesCard from "../../components/RidesCard"
import RidesCardSkeleton from "../../components/RidesCardSkeleton"
import { apiRoute } from "../../api/apiConfig"
import useFetchToken from "../../utils/useFetchToken"

import SearchBar from "../../components/SearchBar"
import AllRidesEmptyState from "../../components/AllRidesEmptyState"
import useDebounce from "../../utils/useDebounce"

const AllRides = () => {
  const [allData, setAllData] = useState<any[]>([])
  const [displayData, setDisplayData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchMode, setIsSearchMode] = useState(false)

  const router = useRouter()
  const token = useFetchToken()
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // --- Fetch Data ---
  const fetchData = async (
    pageNum: number,
    isRefresh = false,
    isLoadMore = false,
    searchTerm = ""
  ) => {
    if (!token) return
    if (loading || loadingMore) return

    if (isRefresh) setRefreshing(true)
    else if (isLoadMore) setLoadingMore(true)
    else if (pageNum === 1 && allData.length === 0) setInitialLoading(true)

    if (searchTerm) setSearchLoading(true)

    setLoading(true)

    try {
      const params: any = { page: pageNum }
      if (searchTerm) params.search = searchTerm

      const res = await axios.get(apiRoute.GETRIDES, {
        params,
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      })

      const rides = Array.isArray(res?.data?.rides) ? res.data.rides : []

      if (searchTerm) {
        setAllData(rides)
        setDisplayData(rides)
        setIsSearchMode(true)
      } else {
        if (isRefresh) {
          setAllData(rides)
          setDisplayData(rides)
          setPage(rides.length > 0 ? 2 : 1)
        } else if (isLoadMore && pageNum > 1) {
          const newAllData = [...allData, ...rides]
          setAllData(newAllData)
          setDisplayData(newAllData)
          setPage(pageNum + 1)
        } else {
          setAllData(rides)
          setDisplayData(rides)
          setPage(rides.length > 0 ? 2 : 1)
        }
        setIsSearchMode(false)
      }

      setHasMore(res?.data?.pagination?.hasNext || false)
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
      setInitialLoading(false)
      setRefreshing(false)
      setLoadingMore(false)
      setSearchLoading(false)
    }
  }

  // --- Search Logic ---
  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setDisplayData(allData)
      setIsSearchMode(false)
      return
    }

    const filtered = allData.filter(
      (item) =>
        item.customerName
          ?.toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        item.roomNumber
          ?.toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        item.phoneNumber?.includes(debouncedSearchQuery) ||
        item.vehicleNumber
          ?.toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase())
    )
    setDisplayData(filtered)

    if (allData.length >= 100 || filtered.length === 0) {
      fetchData(1, false, false, debouncedSearchQuery)
    } else {
      setIsSearchMode(true)
    }
  }, [debouncedSearchQuery, allData])

  useFocusEffect(
    useCallback(() => {
      if (token) {
        setPage(1)
        setHasMore(true)
        setSearchQuery("")
        fetchData(1, true)
      }
    }, [token])
  )

  const loadMore = () => {
    if (
      !loading &&
      !loadingMore &&
      hasMore &&
      displayData.length > 0 &&
      !isSearchMode
    ) {
      fetchData(page, false, true)
    }
  }

  const handleRefresh = () => {
    if (!refreshing && !loading) {
      setPage(1)
      setHasMore(true)
      setSearchQuery("")
      fetchData(1, true)
    }
  }

  const handleDeleteSuccess = (deletedId: string) => {
    setAllData((prev) => prev.filter((ride) => ride._id !== deletedId))
    setDisplayData((prev) => prev.filter((ride) => ride._id !== deletedId))
  }

  if (initialLoading && token) {
    return (
      <View style={styles.container}>
        <Header title='All Rides' />
        <View style={styles.skeletonContainer}>
          {[...Array(5)].map((_, i) => (
            <RidesCardSkeleton key={i} />
          ))}
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header title='All Rides' />
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchLoading={searchLoading}
        clearSearch={() => {
          setSearchQuery("")
          setDisplayData(allData)
          setIsSearchMode(false)
        }}
        resultCount={isSearchMode ? displayData.length : null}
      />

      <FlatList
        data={displayData}
        keyExtractor={(item, index) => `${item._id || index}`}
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
        keyboardShouldPersistTaps='handled'
        keyboardDismissMode='on-drag'
        contentContainerStyle={
          displayData.length === 0 ? styles.emptyList : undefined
        }
        ListEmptyComponent={
          !initialLoading ? (
            <AllRidesEmptyState clearSearch={() => setSearchQuery("")} />
          ) : null
        }
        ListFooterComponent={() =>
          loadingMore && !isSearchMode ? (
            <View style={styles.loadMoreContainer}>
              <ActivityIndicator
                size='small'
                color={Colors.primary}
              />
              <Text style={styles.loadMoreText}>Loading more rides...</Text>
            </View>
          ) : null
        }
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
    gap: 15,
  },
  skeletonContainer: { flex: 1 },
  emptyList: { flexGrow: 1 },
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
