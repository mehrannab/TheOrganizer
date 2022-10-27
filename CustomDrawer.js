import { View, StyleSheet, Image, Dimensions} from 'react-native'
import React, { useEffect, useState } from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { Avatar, Text, Button } from 'react-native-paper'
import { db } from './firebase/firebase'
import { doc, getDoc, onSnapshot} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import { ScaledSheet } from 'react-native-size-matters';
import { getAuth, signOut } from "firebase/auth";



export default function CustomDrawer(props){
  const navigation = useNavigation();
  let userID = firebase.auth().currentUser.uid;
  const [user, setUser] = useState("");
  const auth = getAuth();

  useEffect(
    () => 
      onSnapshot(doc(db, "users", `${userID}`), (doc) => 
        setUser(doc.data())
      ),
    []
  );


  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message));
  }


  return (
      <View style={{flex:1}} >
            <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1, backgroundColor: 'dodgerblue'}}>
            <View style={styles.drawerItems}>
            <Image style={styles.image} source={require('./assets/welcomelogo.png')} />
            <View style={styles.space10}/>
            <Text style={styles.avatarAndUsername}>{user.username}</Text>
            <View style={styles.space20} />
            </View>
            <View style={{flex:1, backgroundColor: '#fff', paddingTop: 10}}>
            <DrawerItemList {...props} style={styles.drawerItems}/>
            </View>
            </DrawerContentScrollView>
            <View style={{backgroundColor: 'white', padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
            <Button icon="logout" uppercase={false} onPress={handleSignOut}>
                Log out
            </Button>
            </View>
      </View>
  )
}


const styles = ScaledSheet.create({
    avatarAndUsername: {
      marginLeft: '10@s',
      color: 'darkblue',
      fontSize: '24@s',
      fontWeight: 'bold'
    },
    image: {
      width: 225,
      height: 100,
      alignSelf: 'center'
    },
    space10: {
      height: 10
    },
    space20: {
      height: 20
    },
  });