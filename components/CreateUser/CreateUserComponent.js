import { StyleSheet, View, Dimensions} from 'react-native'
import React, {useState, useEffect} from 'react'
import { db } from '../../firebase/firebase'
import { doc, setDoc} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import {Button, Headline, Text, TextInput} from 'react-native-paper';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { ScaledSheet } from 'react-native-size-matters';

const {height, width} = Dimensions.get('window')

export default function CreateUserComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const navigation = useNavigation();
  let userID = "";
  const auth = getAuth();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("Category");
      }
    })
    return unsubscribe
  }, [])


  const handleSignUp = () => {
    if(username.trim() && firstname.trim() && lastname.trim()) {
      createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        userID = userCredentials.user.uid

        onAuthStateChanged(auth, (user) => {
          if(user) {
            setDoc(doc(db, "users", `${userID}`), {
              id: userID,
              email: email,
              firstname: firstname,
              lastname: lastname,
              username: username,
              categories: []
          }
        )}});
      })
      .catch(error => alert(error.message))
    }
  };


  const alertRequiredFields = () => {
    if(!username.trim() || !firstname.trim() || !lastname.trim()) {
      alert('Please enter all fields');
    }
  }


  return (
    <View style={styles.container}>
      <View>
        <Headline style={styles.headline}>Welcome to your registration</Headline>
      </View>
      <View>
          <Text style={styles.inputText}>E-mail:</Text>
          <TextInput style={styles.input} placeholder="Enter your email" value={email} onChangeText={text => setEmail(text)}></TextInput>
          <Text style={styles.inputText}>Username:</Text>
          <TextInput style={styles.input} placeholder="Enter your username" value={username} onChangeText={text => setUsername(text)}></TextInput>
          <Text style={styles.inputText}>Firstname:</Text>
          <TextInput style={styles.input} placeholder="Enter your firstname" value={firstname} onChangeText={text => setFirstname(text)}></TextInput>
          <Text style={styles.inputText}>Lastname:</Text>
          <TextInput style={styles.input} placeholder="Enter your lastname" value={lastname} onChangeText={text => setLastname(text)} ></TextInput>
          <Text style={styles.inputText}>Password:</Text>
          <TextInput style={styles.input} secureTextEntry placeholder="Enter your password" value={password} onChangeText={text => setPassword(text)}></TextInput>
      </View>
      <View>
            <Button style={styles.buttonContinue} mode="contained" uppercase={false} onPress={ () => {handleSignUp(); alertRequiredFields();}}>
              <Text style={styles.buttonTextCreateAccount}>Create account</Text>
            </Button>
      </View>
      <View>
            <Button style={styles.buttonBack} uppercase={false} onPress={() => {navigation.navigate("Login")}}>
              <Text style={styles.buttonTextGoBack}>Go Back</Text>
            </Button>
      </View>
    </View>
  )
}


const styles = ScaledSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '160@s'
    },
    headline: {
      marginTop: '70@s',
      padding: '20@s',
      fontSize: '18@s',
    },
    input: {
      padding: '10@s',
      margin: '6@s',
      width: width * 0.75,
      height: height * 0.031,
      fontSize: '14@s'
    },
    inputText: {
      paddingLeft: '14@s',
      paddingTop: '6@s',
      fontSize: '14@s'
    },
    buttonContinue: {
      width: width * 0.5,
    },
    buttonBack: {
      paddingRight: '280@s',
      marginTop: '0@s',
      width: width * 1.1
    },
    buttonTextCreateAccount: {
      fontSize: '14@s',
      color: 'white'
    },
    buttonTextGoBack: {
      fontSize: '14@s'
  }
})