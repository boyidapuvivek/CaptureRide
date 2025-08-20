import React from "react"
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Colors from "../constants/Colors"

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  searchLoading,
  clearSearch,
  resultCount,
}) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputWrapper}>
        <Ionicons
          name='search-outline'
          size={20}
          color={Colors.grayText}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder='Search by name, room, phone, or vehicle...'
          placeholderTextColor={Colors.grayText}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize='none'
          returnKeyType='search'
        />
        {(searchQuery.trim() || searchLoading) && (
          <TouchableOpacity
            onPress={searchLoading ? undefined : clearSearch}
            style={styles.clearButton}
            activeOpacity={0.7}>
            {searchLoading ? (
              <ActivityIndicator
                size='small'
                color={Colors.grayText}
              />
            ) : (
              <Ionicons
                name='close-circle'
                size={20}
                color={Colors.grayText}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
      {resultCount !== null && (
        <Text style={styles.searchResultText}>
          {resultCount} result{resultCount !== 1 ? "s" : ""} found
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  searchContainer: { marginBottom: 5 },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "poppins-regular",
    color: Colors.primaryText,
    padding: 0,
  },
  clearButton: { padding: 4 },
  searchResultText: {
    fontSize: 12,
    fontFamily: "poppins-medium",
    color: Colors.grayText,
    marginTop: 8,
    marginLeft: 4,
  },
})

export default SearchBar
