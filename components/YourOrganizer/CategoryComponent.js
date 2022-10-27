import { StyleSheet, View, FlatList, Alert, Animated, Dimensions, TouchableOpacity} from 'react-native'
import React, { useState, useEffect} from 'react'
import { db, } from '../../firebase/firebase'
import { doc, setDoc, onSnapshot} from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import { Button, Divider, Subheading, Text, Modal, Portal, TextInput } from 'react-native-paper';
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { useNavigation } from '@react-navigation/native';
import { ScaledSheet } from 'react-native-size-matters';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);

const {height, width} = Dimensions.get('window')

export default function CategoryComponent() {
  const containerStyle = {backgroundColor: 'white', padding: 100, margin: 10};
  const [textInput, setTextInput] = useState('');
  const [visible, setVisible] = useState(false);
  const [categories, setCategories] = useState([])
  const navigation = useNavigation();
  const [dataFetch, setDataFetch] = useState(false);
  let userID = firebase.auth().currentUser.uid;


  useEffect(
    () => 
      onSnapshot(doc(db, "users", `${userID}`), (doc) => {
          setCategories(doc.data().categories)
          setDataFetch(true)
      }),
    []
  );


  useEffect(() => {
    addToFirebase();
  }, [categories])


  const showModal = () => {
    setVisible(true);
  }
  

  const hideModal = () => {
    setVisible(false);
  }


  const categoryNavigate = (item) => {
    navigation.navigate("Your Organizer tasks", {item});
  }


  const addCategory = (textInput) => {
    setCategories((prevState) => {
      return [
        {name: textInput, id: Math.floor(Math.random() * 10000) + 1 },
        ...prevState
      ];
    })
    hideModal();
  }


  const addToFirebase = async() => {
    if(dataFetch) {
      await setDoc(doc(db, "users", `${userID}`), {
        categories: categories
      }, {merge: true});
    }
  };

  
  const deleteItem = (item) => {
    setCategories((prevState) => {
      return prevState.filter(category => category.id != item.id)
    })
  }


  const itemSeperator = () => {
    return <View style={styles.seperator}/>
  }


  const DataComponent = (item) => {
    const rightSwipe = (progress, dragX) => {
      const scale = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp'
      });

      return(
        <TouchableOpacity activeOpacity={0.8} onPress={() => deleteItem(item)}>
          <View style={styles.rightAction}>
            <Animated.Text style={[styles.deleteItem, {transform: [{scale}]}]}>Delete</Animated.Text>
          </View>
        </TouchableOpacity>
      )
    }

    return (
    <TouchableOpacity onPress={() => categoryNavigate(item)}>
      <Swipeable renderRightActions={rightSwipe}>
        <View style={styles.containerItem}>
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
      </Swipeable>
    </TouchableOpacity>
    )
  }


  return (
    <View style={styles.container}>
      <Subheading style={styles.subheading}>Your categories</Subheading>

        <View style={styles.containerFlatList}>
          <Divider style={styles.topDivider}/>
          <FlatList
          style={styles.flatList}
          keyExtractor={(item) => item.id}
          data={categories}
          ItemSeparatorComponent = { itemSeperator }
          renderItem={ ({item}) => (
            <DataComponent {...item}/>
            )}
            />
         <Divider style={styles.bottomDivider}/>
        </View>

      <View style={styles.containerButton}>
        <Button style={styles.buttonCategory} mode="contained" uppercase={false} onPress={showModal}>
          Add a category
        </Button>
      </View>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Text style={styles.modalText}>Name your category: </Text>
          <TextInput style={styles.modalInput} placeholder="Enter category name" value={textInput} onChangeText={val => setTextInput(val)}/>
          <Button style={styles.buttonAddCategory} mode="contained" uppercase={false} onPress={() => addCategory(textInput)}>
            <Text style={styles.buttonTextCategory}>Add</Text>
          </Button>
        </Modal>
      </Portal>
    </View>
  )
}


const styles = ScaledSheet.create({
    subheading: {
      fontSize: 26,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 25
    },
    seperator: {
      height: 1,
      width: '100%',
      backgroundColor: 'black',
      borderBottomWidth: 2
    },
    containerItem: {
      flex: 1,
      flexDirection: 'row',
      paddingVertical: 22,
      justifyContent: 'center',
      alignItems: 'center'
    },
    itemName: {
      fontSize: 20,
    },
    buttonCategory: {
      width: 200,
      marginTop: 25
    },
    containerButton: {
      height: 120,
      alignItems: 'center',
      marginTop: 'auto',
      width: '100%'
    },
    flatList: {
      backgroundColor: 'gainsboro',
      marginTop: 40,
      flexGrow: 0,
    },
    container: {
      backgroundColor: 'white'
    },
    containerFlatList: {
      flex: -2,
    },
    verticleLine: {
      height: '100%',
      width: 1,
      backgroundColor: 'black'
    },
    topDivider: {
      borderBottomWidth: 2,
      marginTop: 40,
      marginBottom: -40
    },
    bottomDivider: {
      borderBottomWidth: 2
    },
    modalText: {
      fontSize: '18@s',
      fontWeight: 'bold',
      marginBottom: 15
    },
    modalInput: {
      marginBottom: 15,
      fontSize: '14@s'
    },
    deleteItem: {
      backgroundColor: 'red',
      fontSize: 18,
      fontWeight: 'bold',
      width: 100,
      height: 80,
      color: 'black',
      textAlign: 'center',
      textAlignVertical: 'center'
    },
    rightAction: {
      backgroundColor: 'red',
      justifyContent: 'center',
    }, 
    buttonAddCategory: {
      width: width * 0.3,
      alignSelf: 'center'
    },
    buttonTextCategory: {
      fontSize: '14@s',
      color: 'white'
    }
})

