
import {View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { RadioButton } from 'react-native-paper';
import { useState } from 'react';


const LocationButton = ({ onReport }) => {
    const [status, setStatus] = useState('safe');

    const handleReport = () => {
        onReport({
            status: status,
            timestamp: new Date().toISOString(),
        });
    };
    
    
    return (
        <View style={styles.container}>
          <View style={styles.radioGroup}>
            <TouchableOpacity 
              style={styles.radioOption}
              onPress={() => setStatus('safe')}
            >
              <RadioButton
                value="safe"
                status={status === 'safe' ? 'checked' : 'unchecked'}
                onPress={() => setStatus('safe')}
                color="#4CAF50"
                uncheckedColor="#4CAF50"
              />
              <Text style={styles.radioText}>Safe</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.radioOption}
              onPress={() => setStatus('danger')}
            >
              <RadioButton
                value="danger"
                status={status === 'danger' ? 'checked' : 'unchecked'}
                onPress={() => setStatus('danger')}
                color="#FF5252"
                uncheckedColor="#FF5252"
              />
              <Text style={styles.radioText}>In Danger</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={[
              styles.reportButton,
              { backgroundColor: status === 'safe' ? '#4CAF50' : '#e61f27' }
            ]}
            onPress={handleReport}
          >
                <Text style={styles.buttonText}>Report Location</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 40,
      alignSelf: 'center',
      backgroundColor: 'white',
      padding: 15,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    radioGroup: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 15,
    },
    radioOption: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
    },
    radioText: {
      fontSize: 16,
    },
    reportButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
      },
    });
    
    export default LocationButton;