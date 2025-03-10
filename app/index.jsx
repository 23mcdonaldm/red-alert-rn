import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { Link } from 'expo-router';
import MyButton from '@/components/MyButton';


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <MyButton title="Map" href="/map" />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  // This makes the View take up all available space
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});