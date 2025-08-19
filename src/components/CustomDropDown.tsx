import React, { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native"
import Colors from "../constants/Colors"
import DownArrow from "../assets/icons/downarrow.svg"

interface DropdownItem {
  label: string
  value: string | number
  id?: string | number // Make id optional
}

interface CustomDropdownProps {
  data: DropdownItem[]
  placeholder?: string
  onSelect: (item: DropdownItem) => void
  style?: ViewStyle
  disabled?: boolean
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  data,
  placeholder = "Select an option",
  onSelect,
  style,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null)

  const toggleDropdown = () => {
    if (!disabled) {
      setIsVisible(!isVisible)
    }
  }

  const handleItemSelect = (item: DropdownItem) => {
    setSelectedItem(item)
    onSelect(item)
    setIsVisible(false)
  }

  const renderItem = ({ item }: { item: DropdownItem }) => (
    <TouchableOpacity
      style={[
        styles.item,
        selectedItem?.value === item.value && styles.selectedItem,
      ]}
      onPress={() => handleItemSelect(item)}>
      <Text
        style={[
          styles.itemText,
          selectedItem?.value === item.value && styles.selectedItemText,
        ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  )

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No data available</Text>
    </View>
  )

  return (
    <View style={style}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={toggleDropdown}>
        <Text
          style={[styles.dropdownText, !selectedItem && styles.placeholder]}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <DownArrow
          height={25}
          width={25}
          style={isVisible && styles.downIcon}
        />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent>
        <TouchableOpacity
          style={styles.overlay}
          onPress={toggleDropdown}>
          <View style={styles.modal}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={data}
              keyExtractor={(item, index) =>
                item.id?.toString() ||
                item.value?.toString() ||
                index.toString()
              }
              renderItem={renderItem}
              ListEmptyComponent={renderEmptyComponent}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  } as ViewStyle,

  dropdownText: {
    fontFamily: "poppins-regular",
    color: Colors.black,
    fontSize: 18,
  } as TextStyle,

  placeholder: {
    color: Colors.grayText,
  } as TextStyle,

  downIcon: {
    transform: [{ rotate: "0deg" }],
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  } as ViewStyle,

  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: 280,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  } as ViewStyle,

  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  } as ViewStyle,

  selectedItem: {
    backgroundColor: "#f0f8ff",
  } as ViewStyle,

  itemText: {
    fontSize: 15,
    color: "#333",
    fontFamily: "poppins-regular",
  } as TextStyle,

  selectedItemText: {
    color: "#007AFF",
    fontFamily: "poppins-semibold",
  } as TextStyle,

  emptyContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,

  emptyText: {
    fontSize: 14,
    color: Colors.grayText || "#999",
    fontStyle: "italic",
  } as TextStyle,
})

export default CustomDropdown
