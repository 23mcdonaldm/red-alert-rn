import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import LocationButton from '@/components/LocationButton';


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
  };

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
    </View>
  )
}

//passes in reportData as parameter, 
//LocationButton calls handleLocationReport with reportData as its parameter after handling onReport



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
});

export default MapContainer;