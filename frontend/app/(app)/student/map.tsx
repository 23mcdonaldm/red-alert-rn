import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import MapContainer from '@/components/Map/MapContainer';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapContainer />
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