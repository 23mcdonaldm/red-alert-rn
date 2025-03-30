import { Link } from "expo-router";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

const MyButton = ({ title, href }) => {
    return (
        <Link href={href} asChild>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
            
        </Link>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#e61f27', // Button color
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },

    buttonText: {
        color: '#fff', // White text
        fontSize: 16,
        fontWeight: 'bold',
      },

    
  });
  

export default MyButton;