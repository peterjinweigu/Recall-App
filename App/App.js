import { Camera, CameraType } from 'expo-camera';
import React, { useState, useRef } from 'react';
import { Button, Modal, ImageBackground, StyleSheet, Text, TouchableOpacity, View, StatusBar, TextInput } from 'react-native';
import { Octicons, AntDesign  } from '@expo/vector-icons'; 

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [photoVisible, setPhotoVisible] = useState(false)
  const [photoPreview, setPhotoPreview] = useState()
  const [inputVisible, setInputVisible] = useState(false)
  const [name, onChangeName] = useState()

  const camera = useRef(null)

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (camera) {
      const options = {base64: true}
      const data = await camera.current.takePictureAsync(options)
      setPhotoPreview(data.uri)
      setPhotoVisible(true)
    }
  }

  const retake = () => {
    setPhotoVisible(false)
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true}/>
      <Modal
        animationType="slide"
        transparent={true}
        visible={photoVisible}
        onRequestClose={() => setPhotoVisible(!photoVisible)}
      >
        <View style={styles.container}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={inputVisible}
            onRequestClose={() => setInputVisible(!inputVisible)}
          >
            <TouchableOpacity
              style={{...styles.container, backgroundColor: "rgba(0,0,0,.15)"}}
              onPress={() => setInputVisible(false)}
            >
              <View style={styles.inputContainer}>
                <TextInput 
                  style={styles.input}
                  onChangeText={onChangeName}
                  value={name}
                />
                <TouchableOpacity
                  style={styles.plusButton}
                  onPress={{}}
                >
                  <AntDesign name="plus" size={50} color="white" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
          <ImageBackground 
            source={{ uri: photoPreview }}
            style={{ ...styles.container, justifyContent: 'flex-end' }}
          >
            <View style={styles.buttonContainer}>
              <View style={styles.buttonBox}>
                <TouchableOpacity
                  onPress={{}}
                  style={styles.button}
                >
                  <AntDesign name="search1" size={45} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.buttonBox}>
                <TouchableOpacity
                  onPress={retake}
                  style={styles.button}
                >
                  <Text style={styles.text}>Retake</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.buttonBox}>
                <TouchableOpacity
                  onPress={() => setInputVisible(true)}
                  style={styles.button}
                >
                  <AntDesign name="adduser" size={45} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
      </Modal>
      <Camera 
        style={styles.camera}
        type={type}
        ref={camera}
      >
        <TouchableOpacity style={styles.flipButton} onPress={toggleCameraType}>
          <Octicons name="sync" size={45} color="white" />
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.photoButton} onPress={takePicture}>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  buttonBox: {
    width: '33%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    width: '100%',
    height: '20%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    height: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    width: '70%',
    height: '20%',
    borderRadius: 20,
    borderWidth: 5,
    borderColor: 'white',
    color: 'white',
    fontSize: 20,
  },
  photoButton: {
    width: '20%',
    height: '47%',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 5,
    bottom: 6,
  },
  flipButton: {
    width: '11%',
    height: '8%',
    top: 0,
    left: 0,
    alignItems: 'top',
    justifyContent: 'center',
    position: 'absolute',
    margin: 30,
  },
  plusButton: {
    width: '10%',
    height: '20%',
  },
  button: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});