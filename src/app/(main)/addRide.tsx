import React, { useCallback, useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, View } from "react-native"
import Header from "../../components/Header"
import TextInputField from "../../components/TextInputField"
import RoomNumber from "../../assets/icons/roomNum.svg"
import Phone from "../../assets/icons/phone.svg"
import User from "../../assets/icons/user.svg"
import CustomDropdown from "../../components/CustomDropDown"
import Colors from "../../constants/Colors"
import CustomButton from "../../components/CustomButton"
import UploadPhoto from "../../components/UploadPhoto"
import axios from "axios"
import Loader from "../../components/Loader"
import { Values } from "../../constants/Values"
import { getAccessToken } from "../../utils/authUtils"
import { apiRoute } from "../../api/apiConfig"
import useFetchToken from "../../utils/useFetchToken"
import { useFocusEffect } from "expo-router"
import { addRideSchema } from "../../utils/validationSchemas"
import { z } from "zod"

type ValidationErrors = {
  customerName?: string
  phoneNumber?: string
  roomNumber?: string
  vehicleNumber?: string
  aadharPhoto?: string
  dlPhoto?: string
  customerPhoto?: string
}

const AddRide = () => {
  const [roomNumber, setRoomNumber] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [vehicleNumber, setVehicle] = useState("")
  const [aadharPhoto, setAadharPhoto] = useState("")
  const [dlPhoto, setDLPhoto] = useState("")
  const [customerPhoto, setCustomerPhoto] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [bikes, setBikes] = useState([])
  const [bikeOptions, setBikeOptions] = useState([])
  const [resetKey, setResetKey] = useState(0)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const token = useFetchToken()

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchBikes(token)
      }
    }, [token])
  )

  const fetchBikes = async (token: string) => {
    try {
      const response = await axios.get(apiRoute.GETBIKE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setBikes(response.data.bikes)

      // Transform the bikes data to match CustomDropdown expected format
      const transformedBikes = response.data.bikes.map((bike) => ({
        label: `${bike.bikeName} - ${bike.bikeNumber}`,
        value: bike.bikeNumber,
        id: bike._id,
      }))

      setBikeOptions(transformedBikes)
    } catch (error) {
      Alert.alert("No Bikes", "no bikes available")
    }
  }

  const formatData = () => {
    setRoomNumber("")
    setPhoneNumber("")
    setCustomerName("")
    setVehicle("")
    setAadharPhoto("")
    setDLPhoto("")
    setCustomerPhoto("")
    setErrors({})
    // Increment reset key to force all components to re-render and reset
    setResetKey((prev) => prev + 1)
  }

  const validateForm = () => {
    try {
      addRideSchema.parse({
        customerName,
        phoneNumber,
        roomNumber,
        vehicleNumber,
        aadharPhoto,
        dlPhoto,
        customerPhoto,
      })
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: ValidationErrors = {}
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof ValidationErrors
          validationErrors[field] = err.message
        })
        setErrors(validationErrors)
      }
      return false
    }
  }

  const handlePress = async () => {
    if (!validateForm()) {
      Alert.alert(
        "Enter All Valid Data",
        "Please fix all the errors and add all the above data."
      )
      return
    }

    try {
      setIsLoading(true)
      const formData = new FormData()

      formData.append("roomNumber", roomNumber)
      formData.append("customerName", customerName)
      formData.append("phoneNumber", phoneNumber)
      formData.append("vehicleNumber", vehicleNumber)
      formData.append("aadharPhoto", {
        uri: aadharPhoto,
        type: "image/jpeg",
        name: "aadhar.jpg",
      })
      formData.append("dlPhoto", {
        uri: dlPhoto,
        type: "image/jpeg",
        name: "dl.jpg",
      })
      formData.append("customerPhoto", {
        uri: customerPhoto,
        type: "image/jpeg",
        name: "customer.jpg",
      })

      const res = await axios.post(apiRoute.ADDRIDE, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (res.status === 202) {
        Alert.alert("Success", "Ride added successfully!")
        formatData() // This will now properly reset all components
      } else {
        Alert.alert("Upload Failed", "Please try again.")
      }
    } catch (error) {
      Alert.alert("Error", error?.message || "Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  // Clear individual field errors when user starts typing
  const handleCustomerNameChange = (text: string) => {
    setCustomerName(text)
    if (errors.customerName) {
      setErrors((prev) => ({ ...prev, customerName: undefined }))
    }
  }

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text)
    if (errors.phoneNumber) {
      setErrors((prev) => ({ ...prev, phoneNumber: undefined }))
    }
  }

  const handleRoomNumberChange = (text: string) => {
    setRoomNumber(text)
    if (errors.roomNumber) {
      setErrors((prev) => ({ ...prev, roomNumber: undefined }))
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <View style={styles.container}>
        <Header title={"Add Ride"} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}>
          <View style={styles.mainContainer}>
            <TextInputField
              placeholder='Customer Name'
              value={customerName}
              onChangeText={handleCustomerNameChange}
              error={errors.customerName}>
              <User
                height={20}
                width={20}
              />
            </TextInputField>

            <TextInputField
              placeholder='Mobile Number'
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              error={errors.phoneNumber}>
              <Phone
                height={25}
                width={25}
              />
            </TextInputField>

            <TextInputField
              placeholder='Hotel Name and Room Number'
              value={roomNumber}
              onChangeText={handleRoomNumberChange}
              error={errors.roomNumber}>
              <RoomNumber
                height={25}
                width={25}
              />
            </TextInputField>

            <CustomDropdown
              key={`dropdown-${resetKey}`} // Force complete re-render
              placeholder='Select Vehicle'
              data={bikeOptions}
              onSelect={(item) => {
                setVehicle(item.value)
                if (errors.vehicleNumber) {
                  setErrors((prev) => ({ ...prev, vehicleNumber: undefined }))
                }
              }}
              message={
                "No Bikes Added \n First Click on Add Bike on Home Screen"
              }
            />

            <UploadPhoto
              key={`customer-photo-${resetKey}`} // Force complete re-render
              title='Upload Photo'
              captureImage={(uri) => {
                setCustomerPhoto(uri)
                if (errors.customerPhoto) {
                  setErrors((prev) => ({ ...prev, customerPhoto: undefined }))
                }
              }}
            />
            <UploadPhoto
              key={`aadhar-photo-${resetKey}`} // Force complete re-render
              title='Upload Aadhaar'
              captureImage={(uri) => {
                setAadharPhoto(uri)
                if (errors.aadharPhoto) {
                  setErrors((prev) => ({ ...prev, aadharPhoto: undefined }))
                }
              }}
            />
            <UploadPhoto
              key={`dl-photo-${resetKey}`} // Force complete re-render
              title='Upload DL'
              captureImage={(uri) => {
                setDLPhoto(uri)
                if (errors.dlPhoto) {
                  setErrors((prev) => ({ ...prev, dlPhoto: undefined }))
                }
              }}
            />

            <CustomButton
              title='Upload'
              onPress={handlePress}
            />
          </View>
        </ScrollView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Values.paddingHorizontal,
    paddingTop: Values.paddingTop,
    backgroundColor: Colors.background,
  },
  mainContainer: {
    gap: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
})

export default AddRide
