import { StyleSheet, View, Image, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import {Title, Button, Subheading, Text, TextInput} from 'react-native-paper';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth";
import { scale, ScaledSheet } from 'react-native-size-matters';

const {height, width} = Dimensions.get('window')


export default function LoginComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const auth = getAuth();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("Category");
      }
    })
    return unsubscribe
  }, [])


  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        userCredentials.user;
      })
      .catch(error => alert(error.message))
  }


    return (
      <View style={styles.container}>
        <View>
          <Image style={{width: scale(110), height: scale(80), resizeMode: 'center'}} source={require('../../assets/41-410195_blue-cloud-clipart.png')}  />
        </View>
        <View>
          <Title style={styles.titleText}>The Organizer {"\n"}</Title>
        </View>
        <View>
        <Subheading style={styles.subheading}>Hi there! Nice to see you again</Subheading>
        </View>
        <View>
          <Text style={styles.inputText}>E-mail:</Text>
          <TextInput style={styles.input} placeholder="Enter your email" value={email} onChangeText={text => setEmail(text)}/>
          <Text style={styles.inputText}>Password:</Text>
          <TextInput style={styles.input} secureTextEntry placeholder="Enter your password" 
          value={password} onChangeText={text => setPassword(text)}/>
        </View>
        <View>
            <Button style={styles.buttonLogin} mode="contained" uppercase={false} onPress={handleLogin}>
              <Text style={styles.buttonLoginText}>Login</Text>
            </Button>
        </View>
        <View style={styles.buttonSignUpAndForgotPassword}>
            <Button style={styles.buttonContainer} uppercase={false} onPress={() => {navigation.navigate("SignUp")}}>
              <Text style={styles.buttonTextSignUpAndForgot}>Sign up here</Text>
            </Button>
            <Button style={styles.buttonContainer} uppercase={false} onPress={() => {navigation.navigate("ForgotPassword")}}>
              <Text style={styles.buttonTextSignUpAndForgot}>Forgot password?</Text>
            </Button>
        </View>
      </View>
    );
  }
  

  const styles = ScaledSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: width * 1,
      height: height * 1,
    },
    titleText: {
      fontSize: '30@s',
      fontWeight: 'bold',
      lineHeight: 30*2.50
    },
    subheading: {
      fontSize: '18@s',
      lineHeight: 18*2.50
    },
    inputText: {
      paddingLeft: '14@s',
      paddingTop: '7@s',
      fontSize: '14@s'
    },
    input: {
      padding: '10@s',
      margin: '10@s',
      width: width * 0.8,
      height: height * 0.03,
      fontSize: '14@s'
    },
    buttonLogin: {
      width: width*0.4,
      marginTop: '6@s'
    },
    buttonSignUpAndForgotPassword: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: '95@s'
    },
    buttonContainer: {
      flex: 1
    },
    buttonLoginText: {
      color: 'white',
      fontSize: '14@s'
    },
    buttonTextSignUpAndForgot: {
      fontSize: '14@s'
    }
  });
  
  