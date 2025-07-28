import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import Colors from "../../constants/Colors";
import Header from "../../components/Header";
import { Values } from "../../constants/Values";
import RidesCard from "../../components/RidesCard";
import { apiRoute } from "../../api/apiConfig";
import { getAccessToken } from "../../utils/authUtils";
import axios from "axios";
import RidesCardSkeleton from "../../components/RidesCardSkeleton";

const AllRides = () => {
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // For initial skeleton
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false); // For load more pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessToken();
        setToken(accessToken);
      } catch (error) {
        console.error("Error fetching access token:", error);
        setInitialLoading(false); // Stop skeleton even on error
      }
    };
    fetchToken();
  }, []);

  const fetchData = async (
    pageNum: number,
    isRefresh = false,
    isLoadMore = false
  ) => {
    if (!token) return;

    // Prevent multiple simultaneous requests
    if (loading || loadingMore) return;

    if (isRefresh) {
      setRefreshing(true);
    } else if (isLoadMore) {
      setLoadingMore(true);
    } else if (pageNum === 1 && data.length === 0) {
      setInitialLoading(true); // Only show skeleton for initial load
    }

    setLoading(true);

    try {
      const res = await axios.get(apiRoute.GETRIDES, {
        params: { page: pageNum },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000, // Fixed timeout syntax
      });

      const rides = Array.isArray(res.data?.data?.rides)
        ? res.data.data.rides
        : [];

      if (isRefresh) {
        setData(rides);
        setPage(2); // Set next page for subsequent loads
      } else if (isLoadMore || pageNum > 1) {
        setData((prev) => [...prev, ...rides]);
      } else {
        setData(rides);
        setPage(2); // Set next page for subsequent loads
      }

      setHasMore(res?.data?.data?.pagination?.hasNext || false);
    } catch (error) {
      console.error("Error fetching rides:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  // Initial data fetch when token is available
  useEffect(() => {
    if (token && data.length === 0) {
      fetchData(1);
    }
  }, [token]);

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore && data.length > 0) {
      fetchData(page, false, true);
      setPage((prev) => prev + 1);
    }
  }, [loading, loadingMore, hasMore, page, data.length]);

  const handleRefresh = useCallback(() => {
    if (!refreshing && !loading) {
      setPage(1);
      fetchData(1, true);
    }
  }, [refreshing, loading]);

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
    );
  }

  // Render main content
  return (
    <View style={styles.container}>
      <Header title={"All Rides"} />

      {data.length === 0 && !loading ? (
        // Empty state
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No rides available</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${item.id || index}-${index}`}
          renderItem={({ item }) => <RidesCard data={[item]} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={
            data.length === 0 ? styles.emptyList : undefined
          }
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
              );
            }
            return null;
          }}
        />
      )}
    </View>
  );
};

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
  },
  emptyText: {
    fontSize: 16,
    color: Colors.grayText,
    fontFamily: "poppins-medium",
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
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
});

export default AllRides;
