import { Camera, CameraType } from 'expo-camera';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, ImageBackground, StyleSheet, Text, TouchableOpacity, View, StatusBar, TextInput } from 'react-native';
import { Octicons, AntDesign  } from '@expo/vector-icons'; 

const Status = (props) => {
  return (
    <View style={styles.statusContainer}>
      <View style={styles.status}>
        <Text style={styles.text}>{props.message}</Text>
      </View>
    </View>
  )
}

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [photoVisible, setPhotoVisible] = useState(false)
  const [photoPreview, setPhotoPreview] = useState()
  const [inputVisible, setInputVisible] = useState(false)
  const [name, onChangeName] = useState()
  const [base64, setBase64] = useState()
  const [message, setMessage] = useState("Perry was added")
  const [statusVisible, setStatusVisible] = useState(false)

  const camera = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      setStatusVisible(false)
    }, 3000)
  }, [message]) 
  
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

  const addPerson = () => {
    console.log(name)
    fetch(`http://128.189.132.103:5000/insert/`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({1 : name, 2 : base64})
    }).then((response) => response.json())
    .then((data) => {
      if (data['1']) {
        console.log("cringe")
        setStatusVisible(true)
        setMessage(name + " was added")
      }
    });
    setInputVisible(false)
  }

  const findPerson = () => {
    fetch(`http://128.189.132.103:5000/grab/`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({1 : base64})
    }).then((response) => response.json())
    .then((data) => {
      console.log(data['1'])
      if (data['1']) {
        console.log("cringe")
        setStatusVisible(true)
        setMessage(data['2'] + " was found")
      } else{
        setStatusVisible(true)
        setMessage("Person was not found")
      }
    });
  }

  const takePicture = async () => {
    if (camera) {
      const options = {base64: true}
      const data = await camera.current.takePictureAsync(options)
      setPhotoPreview(data.uri)
      setBase64(data.base64)
      setPhotoVisible(true)
    }
  }

  const retake = () => {
    setStatusVisible(false)
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
                  onPress={addPerson}
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
            {statusVisible ? <Status message={message}/> : null}
            <View style={styles.buttonContainer}>
              <View style={styles.buttonBox}>
                <TouchableOpacity
                  onPress={findPerson}
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
  statusContainer: {
    width: "100%",
    height: "20%",
    top: '5%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  status: {
    width: '80%',
    height: '50%',
    backgroundColor: 'black',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 'white',
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