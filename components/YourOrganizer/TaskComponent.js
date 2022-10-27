import { StyleSheet, View, FlatList, Animated, Dimensions, TouchableOpacity} from 'react-native'
import React, {useEffect, useState} from 'react'
import { Subheading, Divider, Text, Modal, Button, Portal, TextInput} from 'react-native-paper';
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { collection, where, query, getDocs, addDoc, deleteDoc, onSnapshot, QuerySnapshot, doc, getDoc, writeBatch, setDoc} from 'firebase/firestore';
import { db} from '../../firebase/firebase'
import firebase from 'firebase/compat/app';
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import uuid from "react-native-uuid";
import { ScaledSheet } from 'react-native-size-matters';

const {height, width} = Dimensions.get('window')

export default function TaskComponent({route}) {
  const item = route.params.item;
  const containerStyle = {backgroundColor: 'white', padding: 60, margin: 10};
  const [tasks, setTasks] = useState([]);
  const [textInput, setTextInput] = useState({name: "", description: ""});
  const [visible, setVisible] = useState(false);
  const [select, setSelect] = useState(new Date())
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  let userID = `${firebase.auth().currentUser.uid};`
  const filteredTasks = [];


  useEffect(() => {
    const getFilterTasks = async() => {
    const q = query(collection(db, 'allTasks'), where('userID', '==', userID), where('categoryID', '==', item.id))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      filteredTasks.push(doc.data())
    })
    setTasks(filteredTasks)
    }
    getFilterTasks();

  }, [item.id])


  const handleChange = (name, value) => {
    setTextInput({
      ...textInput,
      [name]: value,
    });
  };


  const showModal = () => {
    setVisible(true);
  }


  const hideModal = () => {
    setVisible(false);
  }


  const addTask = (textInput) => {
    setTasks((prevState) => {
      return [
        {userID: userID, categoryID: item.id, name: textInput.name, date: select.toLocaleDateString(), description: textInput.description, id: uuid.v1()},
        ...prevState
      ];
    })
    addToFirebase();

    hideModal();
  }


  const deleteItem = async(item) => {
    setTasks((prevState) => {
      return prevState.filter(task => task.id != item.id)
    })
    deleteFromFirebase(item)
  }


  const deleteFromFirebase = async(item) => {
    const d = query(collection(db, 'allTasks'), where('id', '==', item.id));
    const docSnap = await getDocs(d);
    docSnap.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  }


  const addToFirebase = async() => {
    await addDoc(collection(db, 'allTasks'), {
        userID: userID, 
        categoryID: item.id, 
        name: textInput.name, 
        date: select.toLocaleDateString(), 
        description: textInput.description, 
        id: uuid.v1()
      });
  }


  const itemSeperator = () => {
    return <View style={styles.seperator}/> 
  }


  const showDatePicker = () => {
    setDatePickerVisible(true)
  }


  const hideDatePicker = () => {
    setDatePickerVisible(false);
  }


  const handleConfirm = (date) => {
    setSelect(date);
    hideDatePicker();
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
      <Swipeable renderRightActions={rightSwipe}>
      <View style={styles.containerItem}>
        <View style={styles.containerNameAndDateText}>
          <Text style={styles.itemText}>Name:</Text>
          <Text style={styles.itemValue}> {item.name}</Text>
        </View>
        <View style={styles.containerNameAndDateText}>
          <Text style={styles.itemText}>Date:</Text>
          <Text style={styles.itemValue}> {item.date}</Text>
        </View>
          <Text style={styles.itemText}>Description:</Text>
          <Text style={styles.itemValue}>{item.description}</Text>
      </View>
      </Swipeable>
    )
  }


  return (
    <View>
      <Subheading style={styles.subheading}>Your {item.name} tasks:</Subheading>

      <View style={styles.viewFlatList}>
          <Divider style={styles.divider}/>
          <FlatList
          style={styles.flatList}
          keyExtractor={(item) => item.id}
          data={tasks}
          ItemSeparatorComponent = { itemSeperator }
          renderItem={ ({item}) => (
            <DataComponent {...item}/>
            )}
            />
         <Divider style={styles.bottomDivider}/>
      </View>

      <View style={styles.buttonArea}>
        <Button style={styles.buttonCategory} mode="contained" uppercase={false} onPress={showModal}>
          Add a task
        </Button>
      </View>

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <View>
          <Text style={styles.modalText}>Name your task: </Text>
          <TextInput style={styles.modalInput} placeholder="Enter task name" value={textInput.name} onChangeText={(text) => handleChange('name', text)} name="name"/>
          </View>
          <View style={styles.viewDateTask}>
          <Button style={styles.buttonDate} mode="contained" uppercase={false} onPress={showDatePicker}>
            <Text style={styles.buttonTextDateAndTask}>Select a date</Text>
          </Button>
          <DateTimePickerModal
          date={select}
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}/>
          <Text style={styles.modalText}>Date: {select.toLocaleDateString()}</Text>
          </View>
          <View>
          <Text style={styles.modalText}>Enter description:</Text>
          <TextInput multiline style={styles.modalInput}  placeholder="Enter description" value={textInput.description} onChangeText={(text) => handleChange('description', text)}  name="description"/>
          </View>
          <Button style={styles.buttonAddTask} mode="contained" uppercase={false} onPress={() => addTask(textInput)}>
            <Text style={styles.buttonTextDateAndTask}>Add</Text>
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
    paddingVertical: 22,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  itemValue: {
    fontSize: 20,
  },
  buttonCategory: {
    width: 200,
    marginTop: 10
  },
  buttonArea: {
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
  viewFlatList: {
    flex: -2,
  },
  verticleLine: {
    height: '100%',
    width: 1,
    backgroundColor: 'black'
  },
  divider: {
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
    marginBottom: 8,
  },
  modalInput: {
    marginBottom: 20,
    fontSize: '14@s'
  },
  deleteItem: {
    backgroundColor: 'red',
    fontSize: 34,
    fontWeight: 'bold',
    color: 'black',
  },
  rightAction: {
    backgroundColor: 'red',
    justifyContent: 'center',
  },
  containerNameAndDateText: {
    flexDirection: 'row'
  },
  buttonComplete: {
    flexDirection: 'row',
    alignSelf: 'center'
  },
  space: {
    width: 50,
    height: 20,
  },
  buttonAddTask: {
    marginTop: 80,
    width: width * 0.3,
    alignSelf: 'center'
  },
  viewDateTask: {
    marginTop: 20,
    marginBottom: 20
  },
  buttonTextDateAndTask: {
    fontSize: '14@s',
    color: 'white',
  },
  buttonDate: {
    width: width * 0.35,
  }
})

