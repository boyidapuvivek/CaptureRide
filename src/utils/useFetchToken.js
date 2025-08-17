import { useEffect, useState } from "react"
import { Alert } from "react-native"
import { getAccessToken } from "./authUtils"

const useFetchToken = () => {
  const [token, setToken] = useState("")

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessToken()
        setToken(accessToken)
      } catch (error) {
        Alert.alert("Error", "Failed to authenticate. Please try again.")
      }
    }

    fetchToken()
  }, [])

  return token
}

export default useFetchToken
