import Colors from "../constants/Colors";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Button,
  Linking,
  AppState,
  ImageBackground,
  Alert,
} from "react-native";
import Upload from "../assets/icons/upload.svg";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import Header from "./Header";
import CustomButton from "./CustomButton";
import Capture from "../assets/icons/capture.svg"
import Flash from "../assets/icons/flash.svg"
import FlashOn from "../assets/icons/flashon.svg"
import Flip from "../assets/icons/flip.svg"

type Props = {
  title?: string;
  captureImage ?: ()=>{};
};

const UploadPhoto = ({ title,captureImage }: Props) => {
  const [photo,setPhoto] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [permission, requestPermissions] = useCameraPermissions();
  const [isPermissionModal, setIsPermissionModal] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    if (permission?.granted === false) {
      setIsPermissionModal(true);
    } else if (permission?.granted === true) {
      setIsPermissionModal(false);
    }
  }, [permission]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && isPermissionModal) {
        // Re-check permissions when app becomes active
        requestPermissions();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [isPermissionModal, requestPermissions]);

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const toggleFlash = () => {
    setFlash((prev) => prev === 'off' ? 'on' : 'off');
  };

  const handleCapture = async () => {
    if (cameraRef?.current) {
      try {
        const res = await cameraRef.current.takePictureAsync();
        setPhoto(res.uri);
        captureImage(res.uri);
        setIsModalVisible(false);
      } catch (error) {

        Alert.alert("Error taking picture:", error?.message)
      }
    }
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermissions();
      if (!result.granted) {
        setIsPermissionModal(true);
        return;
      }
    }
    setIsModalVisible(true);
  };

  return (
    <>
      <TouchableOpacity onPress={openCamera}>
        {
          photo ? (
            <ImageBackground
            source={{uri : photo}}
             style={styles.imageContainer}
             resizeMode="cover" 
             borderRadius={18}
            />
          ):(
            <View style={styles.inputContainer}>
          <Upload
            height={48}
            width={48}
          />
          <Text style={styles.title}>{title}</Text>
        </View>
          )
        }
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        style={styles.modalContainer}>
        <CameraView 
          style={styles.camera} 
          facing={facing} 
          ref={cameraRef} 
          flash={flash}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={toggleCameraFacing}>
              <Flip
                height={64}
                width={64}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCapture}>
              <Capture
                height={100}
                width={100}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFlash}>
              {flash === "on" ?
              <FlashOn
               height={64}
                width={64}
              />:
                <Flash
                height={64}
                width={64}
              />}
            </TouchableOpacity>
          </View>
        </CameraView>
      </Modal>

      <Modal
        visible={isPermissionModal}
        transparent
        animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.message}>
              We need your permission to show the camera
            </Text>
            <Text style={styles.message}>
              Click Button >> Open Permissions >> Allow all Permissions
            </Text>
            <CustomButton
              onPress={() => {
                Linking.openSettings();
              }}
              title='Grant Permission'
            />
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setIsPermissionModal(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: 200,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderRightColor: "#00000026",
    borderBottomColor: "#00000026",
  },
  imageContainer:{
    width: "100%",
    minHeight: 200,
  },
  title: {
    fontFamily: "poppins-regular",
    fontSize: 18,
    color: Colors.grayText,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center"
  },
  camera: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingBottom: 50,
    alignItems: "flex-end",
    justifyContent: "space-around"
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 30,
    gap: 20,
  },
  message: {
    textAlign: "center",
    fontFamily: "poppins-regular",
    fontSize: 16,
    color: Colors.grayText,
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelText: {
    color: Colors.grayText,
    fontSize: 16,
    fontFamily: "poppins-regular",
  },
});
export default UploadPhoto;