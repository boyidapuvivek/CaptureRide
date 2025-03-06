import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";

const AddImageCard = ({ title, imageName }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("CameraScreen", { imageName: imageName });
      }}
      style={styles.card}
    >
      <View>
        <Text>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    width: "80%",
    backgroundColor: "#F1F1F1",
    marginBottom: 20,
    borderRadius: 20,
    borderColor: "#010101",
    borderWidth: 2,
  },
});

export default AddImageCard;
