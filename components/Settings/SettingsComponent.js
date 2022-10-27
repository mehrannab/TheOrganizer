import { View, StyleSheet, ToastAndroid, Dimensions } from 'react-native'
import React, { useState, useEffect} from 'react'
import { Subheading, Button, Text, TextInput, Switch } from 'react-native-paper';
import firebase from 'firebase/compat/app';
import { db } from '../../firebase/firebase'
import { doc, onSnapshot, setDoc} from 'firebase/firestore';
import axios from 'axios';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import {scheduleNotificationAsync} from 'expo-notifications';
import { ScaledSheet } from 'react-native-size-matters';

const {height, width} = Dimensions.get('window')


export default function SettingsComponent() {
  const BACKGROUND_FETCH_TASK = 'background-fetch';
  const [isRegistered, setIsRegistered] = useState(false)
  const [status, setStatus] = useState(null)
  const [isSwitchOn, setIsSwitchOn] = useState(false)
  const [city, setCity] = useState('')
  const [data, setData] = useState({
    temp: '', wind: ''
  })
  let result;
  let userID = firebase.auth().currentUser.uid;


  useEffect(() => {
    checkStatusAsync();
  }, []);


  useEffect(
    () => 
      onSnapshot(doc(db, "users", `${userID}`), (doc) => 
        setCity(doc.data().city),
      ),
    [],
  );


  useEffect(
    () => 
      onSnapshot(doc(db, "users", `${userID}`), (doc) => 
        setIsSwitchOn(doc.data().switchState),
      ),
    []
  );


  useEffect(() => {
    if(result === undefined) {
      getWeather();
    }

  }, [result, city])


  useEffect(() => {
    const interval = setInterval(() => {
      getWeather();
    }, 1800000);

    return () => clearInterval(interval);
  }, []);


  const getWeather = async() => {
    await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c2e0c0e468be8e8d65ef9a5291b08b71&units=metric`)
    .then(results => {
      result = results;
      setData({
        temp: results.data.main.temp,
        wind: results.data.wind.speed
      })
    })
    .catch(() => {
      setData({
        temp: 'invalid',
        wind: 'invalid'
      })
    })
  }


  const addCitySettings = async() => {
    await setDoc(doc(db, "users", `${userID}`), {
      city: city,
      switchState: isSwitchOn || false
    }, {merge: true});

    if(data.temp != 'invalid' && data.wind != 'invalid'){
      ToastAndroid.show('Your new city is saved succesfully', ToastAndroid.LONG)
    }
  };


  const InformationWeatherComponent = () => {
    if(data.temp > 10 && data.wind < 5) {
      return <Text style={styles.textForWeather}>The weather is perfect for washing your laundry and hanging it to dry {'\u2600'} </Text>
    }
    if(data.temp == 'invalid' && data.wind == 'invalid') {
      return <Text style={styles.textForWeather}>Please check your input again, the city is not found {'\u274C'} </Text>
    }
    else {
      return <Text style={styles.textForWeather}>Unfortunately, the weather is bad for hanging laundry outside {'\u2601'} </Text>
    }
  }


  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
  }


  const triggerNotifications = async() => {
    if(isSwitchOn === true) {
      if(data.temp > 10 && data.wind < 5) {
        await scheduleNotificationAsync({
          content: {
            title: "The Organizer",
            body: "The weather is perfect for washing your laundry and hanging it to dry \u2600"
          },
          trigger: {
            seconds: 7200,
            repeats: true,
          },
        });
      }
    }
  }

  
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const now = Date.now();
  
    console.log(`Baggrundtask bliver kaldt på dette tidspunkt: ${new Date(now).toISOString()}`);
    getWeather();
  
  return BackgroundFetch.BackgroundFetchResult.NewData;
  });


  async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 30, 
      stopOnTerminate: false,
      startOnBoot: true
    }); 
  }


  async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);  
  }


  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
    setStatus(status);
    setIsRegistered(isRegistered);
  };


  const toggleFetchTask = async () => {
    if (isRegistered && isSwitchOn === false) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }
    checkStatusAsync();
  };


  return (
    <View>
      <Subheading style={styles.subheading}>Your settings</Subheading>
      <View style={styles.flexContainer}>
        <Text style={styles.weatherNotificationText}>
          Weather notifications
        </Text>
        <Switch trackColor={{ false: "#767577", true: "dodgerblue" }} thumbColor={isSwitchOn ? "blue" : "#f4f3f4"} style={styles.switch} value={isSwitchOn} onValueChange={onToggleSwitch}/>
      </View>
      <View>
        <Text style={styles.textForEnter}>
          Enter your current city: 
        </Text>
        <TextInput style={styles.textInput} placeholder="Enter city" value={city} onChangeText={text => setCity(text)}/>
      </View>
      <View>
        <Text style={styles.textForData}>
            Temperatur: {data.temp} °C         Wind: {data.wind} m/s
        </Text>
      </View>
      <InformationWeatherComponent/>
      <Button style={styles.button} mode="contained" uppercase={false} onPress={ () => {addCitySettings(); triggerNotifications(); toggleFetchTask();}}>
          <Text style={styles.buttonTextCitySwitch}>Save city and switch state</Text>
        </Button>
    </View>
  )
}


const styles = ScaledSheet.create({
  subheading: {
    fontSize: '26@s',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '16@s',
    lineHeight: 26 *2.5
  },
  weatherNotificationText: {
    fontSize: '20@s',
    marginLeft: '15@s',
    marginTop: '8@s'
  },
  textForEnter: {
    fontSize: '18@s',
    textAlign: 'center',
    marginTop: '60@s'
  },
  textForData: {
    fontSize: '16@s',
    textAlign: 'center',
    marginBottom: '20@s'
  },
  textInput: {
    margin: '10@s',
    width: width * 0.75,
    height: height * 0.05,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: '14@s'
  },
  textForWeather: {
    fontSize: '22@s',
    marginTop: '30@s',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: '10@s'
  },
  button: {
    marginTop: '34@s',
    width: width * 0.7,
    alignSelf: 'center'
  },
  switch: {
    alignSelf: 'flex-end',
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    marginRight: '15@s'
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: '10@s'
  },
  buttonTextCitySwitch: {
    fontSize: '14@s',
    color: 'white',
  }
})
