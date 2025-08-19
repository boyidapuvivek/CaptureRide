import React from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import BackArrow from "../../assets/icons/arrow_back.svg"
import TextInputField from "../../components/TextInputField"
import CustomButton from "../../components/CustomButton"
import Colors from "../../constants/Colors"
import { useRouter } from "expo-router"
import { OtpInput } from "react-native-otp-entry"
import { Values } from "../../constants/Values"

const Otp = () => {
  const router = useRouter()

  const handlePress = () => {
    router.push("/(auth)/resetpassword")
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          router.back()
        }}>
        <BackArrow
          height={24}
          width={24}
        />
      </Pressable>

      <View style={styles.mainContainer}>
        <Text style={styles.text}>Enter Otp</Text>

        <OtpInput
          numberOfDigits={6}
          focusColor='green'
          autoFocus={false}
          hideStick={true}
          placeholder='******'
          blurOnFilled={true}
          disabled={false}
          type='numeric'
          secureTextEntry={false}
          focusStickBlinkingDuration={500}
          textInputProps={{
            accessibilityLabel: "One-Time Password",
          }}
          textProps={{
            accessibilityRole: "text",
            accessibilityLabel: "OTP digit",
            allowFontScaling: false,
          }}
          theme={{
            containerStyle: styles.container,
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
            focusStickStyle: styles.focusStick,
            focusedPinCodeContainerStyle: styles.activePinCodeContainer,
            placeholderTextStyle: styles.placeholderText,
            filledPinCodeContainerStyle: styles.filledPinCodeContainer,
            disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
          }}
        />

        <CustomButton
          title='Continue'
          onPress={handlePress}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Values.paddingHorizontal,
    paddingTop: Values.paddingTop,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    maxHeight: "40%",
  },
  text: {
    fontFamily: "poppins-semibold",
    fontSize: 32,
    color: Colors.primary,
  },
})

export default Otp
