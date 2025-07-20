import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextStyle,
  LayoutRectangle,
} from "react-native";
import Colors from "../constants/Colors";
import DownArrow from "../assets/icons/downarrow.svg";

interface DropdownItem {
  label: string;
  value: string | number;
}

interface CustomDropdownProps {
  data: DropdownItem[];
  placeholder?: string;
  onSelect: (item: DropdownItem) => void;
  style?: ViewStyle;
  disabled?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  data,
  placeholder = "Select an option",
  onSelect,
  style,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);
  const [dropdownLayout, setDropdownLayout] = useState<LayoutRectangle | null>(
    null
  );

  const dropdownRef = useRef<View>(null);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsVisible((prev) => !prev);
    }
  };

  const handleItemSelect = (item: DropdownItem) => {
    setSelectedItem(item);
    onSelect(item);
    setIsVisible(false);
  };

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
  );

  return (
    <View style={[{ position: "relative" }, style]}>
      <View
        ref={dropdownRef}
        onLayout={(event) => {
          setDropdownLayout(event.nativeEvent.layout);
        }}>
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
      </View>

      {isVisible && dropdownLayout && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={toggleDropdown}>
          <View
            style={[
              styles.modal,
              {
                top: dropdownLayout.y + dropdownLayout.height,
                left: dropdownLayout.x,
                width: dropdownLayout.width,
              },
            ]}>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 18,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderRightColor: "#00000026",
    borderBottomColor: "#00000026",
  } as ViewStyle,

  dropdownText: {
    backgroundColor: Colors.transparent,
    fontFamily: "poppins-regular",
    color: Colors.black,
    fontSize: 16,
  } as TextStyle,

  placeholder: {
    color: Colors.grayText,
  } as TextStyle,

  downIcon: {
    transform: [{ scaleY: -1 }],
  },

  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    backgroundColor: "rgba(0,0,0,0.1)",
  } as ViewStyle,

  modal: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 8,
    maxHeight: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  } as ViewStyle,

  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  } as ViewStyle,

  selectedItem: {
    backgroundColor: "#f0f8ff",
  } as ViewStyle,

  itemText: {
    fontSize: 16,
    color: "#333",
  } as TextStyle,

  selectedItemText: {
    color: "#007AFF",
    fontWeight: "600",
  } as TextStyle,
});

export default CustomDropdown;

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   Modal,
//   StyleSheet,
//   ViewStyle,
//   TextStyle,
// } from "react-native";
// import Colors from "../constants/Colors";
// import DownArrow from "../assets/icons/downarrow.svg";

// interface DropdownItem {
//   label: string;
//   value: string | number;
// }

// interface CustomDropdownProps {
//   data: DropdownItem[];
//   placeholder?: string;
//   onSelect: (item: DropdownItem) => void;
//   style?: ViewStyle;
//   disabled?: boolean;
// }

// const CustomDropdown: React.FC<CustomDropdownProps> = ({
//   data,
//   placeholder = "Select an option",
//   onSelect,
//   style,
//   disabled = false,
// }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<DropdownItem | null>(null);

//   const toggleDropdown = () => {
//     if (!disabled) {
//       setIsVisible(!isVisible);
//     }
//   };

//   const handleItemSelect = (item: DropdownItem) => {
//     setSelectedItem(item);
//     onSelect(item);
//     setIsVisible(false);
//   };

//   const renderItem = ({ item }: { item: DropdownItem }) => (
//     <TouchableOpacity
//       style={[
//         styles.item,
//         selectedItem?.value === item.value && styles.selectedItem,
//       ]}
//       onPress={() => handleItemSelect(item)}>
//       <Text
//         style={[
//           styles.itemText,
//           selectedItem?.value === item.value && styles.selectedItemText,
//         ]}>
//         {item.label}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={style}>
//       <TouchableOpacity
//         style={styles.dropdown}
//         onPress={toggleDropdown}>
//         <Text
//           style={[styles.dropdownText, !selectedItem && styles.placeholder]}>
//           {selectedItem ? selectedItem.label : placeholder}
//         </Text>
//         <DownArrow
//           height={25}
//           width={25}
//           style={isVisible && styles.downIcon}
//         />
//       </TouchableOpacity>

//       <Modal
//         visible={isVisible}
//         transparent>
//         <TouchableOpacity
//           style={styles.overlay}
//           onPress={toggleDropdown}>
//           <View style={styles.modal}>
//             <FlatList
//               data={data}
//               keyExtractor={(item) => item.id.toString()}
//               renderItem={renderItem}
//             />
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   dropdown: {
//     flexDirection: "row",
//     gap: 10,
//     alignItems: "center",
//     justifyContent: "space-between",
//     width: "100%",
//     paddingHorizontal: 12,
//     paddingVertical: 18,

//     backgroundColor: Colors.white,
//     borderRadius: 18,
//     borderRightWidth: 2,
//     borderBottomWidth: 2,
//     borderRightColor: "#00000026",
//     borderBottomColor: "#00000026",
//   } as ViewStyle,

//   dropdownText: {
//     backgroundColor: Colors.transparent,
//     fontFamily: "poppins-regular",
//     color: Colors.black,
//     height: "auto",
//     fontSize: 16,
//   } as TextStyle,

//   placeholder: {
//     color: Colors.grayText,
//   } as TextStyle,

//   downIcon: {
//     transform: [{ scaleY: -1 }],
//   },

//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.3)",
//     // justifyContent: "center",
//     padding: 20,
//   } as ViewStyle,

//   modal: {
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     maxHeight: 300,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   } as ViewStyle,

//   item: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   } as ViewStyle,

//   selectedItem: {
//     backgroundColor: "#f0f8ff",
//   } as ViewStyle,

//   itemText: {
//     fontSize: 16,
//     color: "#333",
//   } as TextStyle,

//   selectedItemText: {
//     color: "#007AFF",
//     fontWeight: "600",
//   } as TextStyle,
// });

// export default CustomDropdown;
