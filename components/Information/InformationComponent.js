import { StyleSheet, View, ScrollView, RefreshControl, Dimensions} from 'react-native'
import React, { useState, useEffect} from 'react'
import { db } from '../../firebase/firebase'
import { doc, getDoc, updateDoc, onSnapshot} from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import { Subheading, Text, TextInput, Button } from 'react-native-paper';
import { scale, verticalScale, moderateScale, ScaledSheet } from 'react-native-size-matters';

const {height, width} = Dimensions.get('window')


export default function InformationComponent() {
  const [user, setUser] = useState("");
  const [newUsername, setNewUsername] = useState("");
  let userID = firebase.auth().currentUser.uid;


  useEffect(
    () => 
      onSnapshot(doc(db, "users", `${userID}`), (doc) => 
        setUser(doc.data())
      ),
    []
  );


  const addNewUsername = async() => {
    await updateDoc(doc(db, "users", `${userID}`), {
      username: newUsername
    });
  };


  return (
    <View>
      <Subheading style={styles.subheading}>Your information</Subheading>
      <View>
            <Text style={styles.textStyle}>Email: {user.email}</Text>
            <Text style={styles.textStyle}>Firstname: {user.firstname}</Text>
            <Text style={styles.textStyle}>Lastname: {user.lastname}</Text>
            <Text style={styles.textStyle}>Username: {user.username}</Text>
      </View>
      <View>
            <Text style={styles.textIntroUsername}>You can change your username to an awesome one! Just write your new username here:</Text>
      </View>
      <View>
            <TextInput style={styles.inputUsername} placeholder="Enter your new username" value={newUsername} onChangeText={text => setNewUsername(text)}/>
      </View>
      <View>
        <Button style={styles.buttonSave} mode="contained" uppercase={false} onPress={ () => {addNewUsername()}}>
          <Text style={styles.buttonTextSave}>Save</Text>
        </Button>
      </View>
    </View>
  )
}


const styles = ScaledSheet.create({
  subheading: {
    fontSize: '26@s',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '20@s',
    lineHeight: 26 *2.5
  },
  textStyle: {
    fontSize: '16@s',
    textAlign: 'left',
    marginLeft: '20@s',
    marginTop: '24@s'
  },
  textIntroUsername: {
    fontSize: '18@s',
    marginTop: '40@s',
    textAlign: 'center'
  },
  inputUsername: {
    marginTop: '10@s',
    width: width * 0.75,
    height: height * 0.05,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: '14@s'
  },
  buttonSave: {
    marginTop: '20@s',
    width: width * 0.5,
    alignSelf: 'center'
  },
  buttonTextSave: {
    fontSize: '14@s',
    color: 'white'
  }
})

