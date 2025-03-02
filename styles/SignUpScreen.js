import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    textField: {
        height: 50,
        width: 200,
        borderWidth: 2,
        borderColor: "#000000",
        borderRadius: 10,
    }
});

export default styles;