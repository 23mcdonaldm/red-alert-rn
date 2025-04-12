import { Dimensions, StyleSheet, Text, View, Modal, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import LocationButton from '@/components/Map/LocationButton';
import { Platform } from 'react-native';


let locationPermissionGranted = false;

const MapContainer = () => {
  //initialize at student's school
  const initialLocation = {
    latitude: 38.98543, 
    longitude: -76.94260,
  };


  
  const [userLocation, setUserLocation] = useState(initialLocation);
  const [mapDelta, setMapDelta] = useState(0.025);
  const [region, setRegion] = useState({
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: mapDelta,
    longitudeDelta: mapDelta,
  });
  const [reportedLocation, setReportedLocation] = useState(null);
  const [reportedStatus, setReportedStatus] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const mapRef = useRef();
  

  useEffect(() => {
    _getLocation();
  }, [])

  const _getLocation = async () => {
    try {
      if(!locationPermissionGranted) {
        let { status } = await Location.requestForegroundPermissionsAsync();

        if(status !== 'granted') {
          console.warn('Permission to access location was denied');
          return
        }
        locationPermissionGranted = true;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
      console.log(location.coords);
      setMapDelta(0.015)

      startLocationTracking();
    } catch(err) {
      console.warn(err);
    }
  }

  const startLocationTracking = async () => {
    //stops from creating multiple subscriptions
    if (locationSubscription || !locationPermissionGranted) return;

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.high,
        timeInterval: 1000,
        distanceInterval: 10
      },
      (location) => {
        //runs every time location changes
        setUserLocation(location.coords);
      }
    );

    setLocationSubscription(subscription);
  };
  
  useEffect(() => {
    return () => {
      if(locationSubscription) {
        locationSubscription.remove();
        setLocationSubscription(null);
      }
    };
  }, [locationSubscription]);

  const handleLocationReport = (reportData) => {
    const newReport = {
      coordinate: {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      },
      status: reportData.status,
      timestamp: reportData.timestamp,
    };

    setReportedLocation(newReport.coordinate);
    setReportedStatus(newReport.status);
    setModalVisible(true);
  };

  const handleSubmitDescription = () => {
    setModalVisible(false);
    setDescription('submitted');
  }

  const focusOnLocation = () => {
    if (userLocation.latitude && userLocation.longitude) {
      const newRegion = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: mapDelta,
        longitudeDelta: mapDelta
      };
      
      if(mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    }
  }
  


  return (
    <View>
      <MapView 
        
        showsUserLocation={true}
        style={styles.map}
        initialRegion={{
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        }}
        region={region}
        onRegionChangeComplete={setRegion}
        ref={mapRef}
      >
        { reportedLocation && reportedLocation.latitude && reportedLocation.longitude &&
          <Marker
            coordinate={{
              latitude: reportedLocation.latitude,
              longitude: reportedLocation.longitude
            }}
            title='User Reported Location'
            description='User: miles1301 ID: 119709979 Date: 01-01-2025' 
            pinColor={reportedStatus === 'safe' ? "#1fa012" : "#e61f27"}
          />
        }
        

      </MapView>
      <View style={styles.buttonContainer}>
        <LocationButton onReport={(reportData) => {
            focusOnLocation();
            handleLocationReport(reportData);
        }}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>✓ Report Submitted</Text>
            <TextInput
              style={styles.input}
              placeholder="Add a description (optional)"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitDescription}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

//passes in reportData as parameter, 
//LocationButton calls handleLocationReport with reportData as its parameter 
//after handling onReport



const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },

  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 68,  // Increased from 40 to 80 to move it up
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,  // Ensure it's above the map
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },
  input: {
    width: 250,
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    textAlignVertical: 'top'
  },
  submitButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default MapContainer;
