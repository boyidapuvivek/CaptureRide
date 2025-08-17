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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setBikes(response.data.bikes)
    } catch (error) {
      Alert.alert("No Bikes", "no bikes available")
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
        {
          bikeName: bikeName,
          bikeNumber: bikeNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                id: bikeId,
              },
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
    <View style={styles.bikeCard}>
      <View style={styles.bikeInfo}>
        <Ionicons
          name='bicycle'
          size={24}
          color={Colors.primary}
        />
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
          if (token) {
            deleteBike(item._id, token)
          }
        }}>
        <Ionicons
          name='trash'
          size={18}
          color='#FF4444'
        />
      </TouchableOpacity>
    </View>
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

      <View style={styles.header}>
        <Text style={styles.count}>{bikes.length} Bikes</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}>
          <Ionicons
            name='add'
            size={20}
            color='white'
          />
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>

      {bikes.length === 0 ? (
        <View style={styles.center}>
          <Ionicons
            name='bicycle-outline'
            size={60}
            color={Colors.lightGray}
          />
          <Text style={styles.emptyText}>No bikes available</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.emptyBtnText}>Add Your First Bike</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bikes}
          renderItem={renderBike}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          style={styles.list}
        />
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType='slide'>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Bike</Text>
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
              <Text style={styles.submitText}>Add Bike</Text>
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  count: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.darkGray,
  },
  addBtn: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  addText: {
    color: "white",
    marginLeft: 4,
    fontWeight: "500",
  },
  list: {
    flex: 1,
  },
  bikeCard: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bikeInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  bikeText: {
    marginLeft: 12,
  },
  bikeName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.darkGray,
  },
  bikeNumber: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
    backgroundColor: "#FFE5E5",
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 16,
    marginBottom: 24,
  },
  emptyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyBtnText: {
    color: "white",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.darkGray,
  },
  input: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
})

export default MyBikes
