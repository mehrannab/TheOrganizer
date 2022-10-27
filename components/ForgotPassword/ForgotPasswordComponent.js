import { StyleSheet, View, ToastAndroid, Dimensions } from 'react-native'
import React, {useState} from 'react'
import {Button, Headline, Text, TextInput} from 'react-native-paper';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { ScaledSheet } from 'react-native-size-matters';

const {height, width} = Dimensions.get('window')

export default function ForgotPasswordComponent() {
    const [email, setEmail] = useState('');
    const auth = getAuth();
    const navigation = useNavigation();


    const forgotPassword = () => {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            ToastAndroid.show('Reset password mail sent successfully!', ToastAndroid.LONG);
        })
        .catch(() => {
            ToastAndroid.show('Error: Please check your entered e-mail!', ToastAndroid.LONG)
        });
    }


  return (
    <View style={styles.container}>
        <View>
            <Button style={styles.buttonBack} uppercase={false} onPress={() => {navigation.navigate("Login")}}>
                <Text style={styles.buttonTextGoBack}>Go back</Text>
            </Button>
        </View>
        <View>
            <Headline style={styles.headline}>Forgot your password? No problem!</Headline>
        </View>
        <View>
            <Text style={styles.inputText}>Email:</Text>
            <TextInput style={styles.input} placeholder="Enter your email" value={email} onChangeText={text => setEmail(text)}></TextInput>
        </View>
        <View>
            <Button testID='ResetPassword.Button' style={styles.buttonResetPassword} mode="contained" uppercase={false} onPress={forgotPassword}>
                <Text style={styles.buttonTextResetPassword}>Reset password</Text>
            </Button>
        </View>

    </View>
  )
}


const styles = ScaledSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '200@s'
    },
    headline: {
        fontSize: '18@s',
        marginTop: '60@s',
        padding: '20@s',
    },
    inputText: {
        paddingLeft: '14@s',
        paddingTop: '6@s',
        fontSize: '14@s'
    },
    input: {
        padding: '10@s',
        margin: '15@s',
        width: width * 0.8,
        height: height * 0.03,
        fontSize: '14@s'
    },
    buttonResetPassword: {
        width: width * 0.5,
    },
    buttonBack: {
        paddingRight: '260@s',
        width: width * 1.1,
    },
    buttonTextResetPassword: {
        color: 'white',
        fontSize: '14@s'
    },
    buttonTextGoBack: {
        fontSize: '14@s'
    }
})