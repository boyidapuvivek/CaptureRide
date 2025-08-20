import React, { useState, useEffect } from "react"
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import axios from "axios"
import Header from "../../components/Header"
import Colors from "../../constants/Colors"
import { Values } from "../../constants/Values"
import { apiRoute } from "../../api/apiConfig"
import useFetchToken from "../../utils/useFetchToken"

const MyBikes = () => {
  const [bikes, setBikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [bikeName, setBikeName] = useState("")
  const [bikeNumber, setBikeNumber] = useState("")
  const token = useFetchToken()

  useEffect(() => {
    if (token) {
      fetchBikes(token)
    }
  }, [token])

  const fetchBikes = async (token: string) => {
    try {
      const response = await axios.get(apiRoute.GETBIKE, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBikes(response.data.bikes)
    } catch (error) {
      Alert.alert("No Bikes", "No bikes available")
    } finally {
      setLoading(false)
    }
  }

  const addBike = async () => {
    if (!bikeName.trim() || !bikeNumber.trim()) {
      Alert.alert("Error", "Please fill in both fields")
      return
    }

    try {
      await axios.post(
        apiRoute.ADDBIKE,
        { bikeName, bikeNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setBikeName("")
      setBikeNumber("")
      setModalVisible(false)
      fetchBikes(token)
      Alert.alert("Success", "Bike added successfully")
    } catch (error) {
      Alert.alert("Error", "Failed to add bike")
    }
  }

  const deleteBike = (bikeId, token) => {
    Alert.alert("Delete Bike", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await axios.delete(apiRoute.DELETEBIKE, {
              headers: { Authorization: `Bearer ${token}` },
              params: { id: bikeId },
            })
            fetchBikes(token)
            Alert.alert("Success", "Bike deleted")
          } catch (error) {
            Alert.alert("Error", "Failed to delete bike")
          }
        },
      },
    ])
  }

  const renderBike = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.bikeCard,
        pressed && { transform: [{ scale: 0.98 }] },
      ]}>
      <View style={styles.bikeInfo}>
        <View style={styles.bikeIcon}>
          <Ionicons
            name='bicycle'
            size={22}
            color='white'
          />
        </View>
        <View style={styles.bikeText}>
          <Text style={styles.bikeName}>{item.bikeName || item.name}</Text>
          <Text style={styles.bikeNumber}>
            #{item.bikeNumber || item.number}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => {
          if (token) deleteBike(item._id, token)
        }}>
        <Ionicons
          name='trash'
          size={18}
          color='#FF4444'
        />
      </TouchableOpacity>
    </Pressable>
  )

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title='My Bikes' />
        <View style={styles.center}>
          <ActivityIndicator
            size='large'
            color={Colors.primary}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header title='My Bikes' />

      {/* Top Stats Card */}
      <View style={styles.statsCard}>
        <View>
          <Text style={styles.statsCount}>{bikes.length}</Text>
          <Text style={styles.statsLabel}>Total Bikes</Text>
        </View>
        <TouchableOpacity
          style={styles.quickAddBtn}
          onPress={() => setModalVisible(true)}>
          <Ionicons
            name='add'
            size={22}
            color='white'
          />
          <Text style={styles.quickAddText}>Add Bike</Text>
        </TouchableOpacity>
      </View>

      {/* Empty State or List */}
      {bikes.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name='bicycle-outline'
            size={100}
            color={Colors.gray}
          />
          <Text style={styles.emptyTitle}>No Bikes Yet</Text>
          <Text style={styles.emptySubtitle}>
            Start by adding your first bike to manage rides easily.
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.emptyBtnText}>+ Add Bike</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bikes}
          renderItem={renderBike}
          keyExtractor={(item, index) => item._id || index.toString()}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal as Bottom Sheet */}
      <Modal
        visible={modalVisible}
        transparent
        animationType='slide'>
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Add New Bike</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons
                  name='close'
                  size={24}
                  color={Colors.darkGray}
                />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder='Bike Name'
              value={bikeName}
              onChangeText={setBikeName}
            />
            <TextInput
              style={styles.input}
              placeholder='Bike Number'
              value={bikeNumber}
              onChangeText={setBikeNumber}
            />

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={addBike}>
              <Text style={styles.submitText}>Save Bike</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Values.paddingHorizontal,
    paddingTop: Values.paddingTop,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Top stats card
  statsCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
  },
  statsCount: { fontSize: 32, fontFamily: "poppins-bold", color: "white" },
  statsLabel: { fontSize: 14, color: "white", marginTop: 4 },
  quickAddBtn: {
    flexDirection: "row",
    backgroundColor: Colors.darkGray,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  quickAddText: { color: "white", marginLeft: 6, fontFamily: "poppins-medium" },

  // Bike card
  bikeCard: {
    backgroundColor: "white",
    padding: 18,
    marginBottom: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  bikeInfo: { flexDirection: "row", alignItems: "center" },
  bikeIcon: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 10,
  },
  bikeText: { marginLeft: 12 },
  bikeName: {
    fontSize: 16,
    fontFamily: "poppins-semibold",
    color: Colors.darkGray,
  },
  bikeNumber: { fontSize: 14, color: Colors.gray, marginTop: 2 },
  deleteBtn: { padding: 8 },

  emptyState: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: "poppins-semibold",
    marginTop: 16,
    color: Colors.darkGray,
  },
  emptySubtitle: {
    fontSize: 18,
    color: Colors.gray,
    marginTop: 6,
    textAlign: "center",
    marginBottom: 20,
  },
  emptyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyBtnText: {
    color: "white",
    fontFamily: "poppins-semibold",
    fontSize: 15,
  },

  // Modal Bottom Sheet
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  bottomSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontFamily: "poppins-bold",
    color: Colors.darkGray,
  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 14,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 14,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  submitText: { color: "white", fontFamily: "poppins-semibold", fontSize: 16 },
})

export default MyBikes
