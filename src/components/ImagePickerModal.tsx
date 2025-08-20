// components/ImagePickerModal.tsx
import React from "react"
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native"
import Colors from "../constants/Colors"

type Props = {
  visible: boolean
  onClose: () => void
  onPickCamera: () => void
  onPickGallery: () => void
}

const ImagePickerModal = ({
  visible,
  onClose,
  onPickCamera,
  onPickGallery,
}: Props) => {
  return (
    <Modal
      transparent
      animationType='slide'
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Image Source</Text>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              onPickCamera()
              onClose()
            }}>
            <Text style={styles.optionText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              onPickGallery()
              onClose()
            }}>
            <Text style={styles.optionText}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: {
    fontFamily: "poppins-semibold",
    fontSize: 18,
    color: Colors.darkText,
    textAlign: "center",
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  optionText: {
    color: Colors.white,
    fontFamily: "poppins-semibold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: Colors.grayStatus,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelText: {
    color: Colors.darkText,
    fontFamily: "poppins-medium",
    fontSize: 16,
  },
})

export default ImagePickerModal
