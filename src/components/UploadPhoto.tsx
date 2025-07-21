import Colors from "../constants/Colors";
import React, { ReactNode } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Upload from "../assets/icons/upload.svg";

type Props = {
  title?: string;
};

const UploadPhoto = ({ title }: Props) => {
  return (
    <TouchableOpacity>
      <View style={styles.inputContainer}>
        <Upload
          height={48}
          width={48}
        />
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",

    width: "100%",
    minHeight: 160,
    paddingHorizontal: 12,
    paddingVertical: 12,

    backgroundColor: Colors.white,
    borderRadius: 18,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderRightColor: "#00000026",
    borderBottomColor: "#00000026",
  },
  title: {
    fontFamily: "poppins-semibold",
    fontSize: 18,
    color: Colors.grayText,
  },
});

export default UploadPhoto;
