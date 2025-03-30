import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { Link } from 'expo-router';
import MapContainer from '@/components/MapContainer';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapContainer style={styles.map} />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  // This makes the View take up all available space
  },
  map: {
    width: '100%',
    height: '100%',
  },
});