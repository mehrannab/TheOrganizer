import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginComponent from './components/Login/LoginComponent';
import CategoryComponent from './components/YourOrganizer/CategoryComponent';
import CreateUserComponent from './components/CreateUser/CreateUserComponent';
import InformationComponent from './components/Information/InformationComponent';
import ForgotPasswordComponent from './components/ForgotPassword/ForgotPasswordComponent';
import SettingsComponent from './components/Settings/SettingsComponent';
import CustomDrawer from './CustomDrawer';
import TaskComponent from './components/YourOrganizer/TaskComponent';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';



export default function App() {
  const Stack = createStackNavigator();
  const Drawer = createDrawerNavigator();


  function DrawerNavigation() {
    return (
        <Drawer.Navigator useLegacyImplementation={true} drawerContent={props => <CustomDrawer {...props}/>} screenOptions={{headerTitleAlign: 'center', drawerActiveBackgroundColor: 'lightskyblue',
          drawerActiveTintColor: 'darkblue', headerStyle: {backgroundColor: 'dodgerblue' }, headerTintColor: 'white', headerTitleStyle: {fontWeight: 'bold'},
          drawerLabelStyle: {fontSize: 15, marginLeft: 25, fontWeight: 'bold'}}}>

          <Drawer.Screen name="Your Organizer" component={CategoryComponent} options={{
            drawerIcon: ({color}) => (
              <Ionicons name="home-outline" size={22} color={color}/>
            )}}/>  

          <Drawer.Screen name="User information" component={InformationComponent} options={{
            drawerIcon: ({color}) => (
              <Ionicons name="information" size={22} color={color}/>
            )}}/>

          <Drawer.Screen name="Settings" component={SettingsComponent} options={{
            drawerIcon: ({color}) => (
              <Ionicons name="settings" size={22} color={color}/>
            )}}/>

          <Drawer.Screen name="Your Organizer tasks" component={TaskComponent} options={{drawerItemStyle: {height: 0}}}/>
        </Drawer.Navigator>
    )
  }


  const theme = {
    ...DefaultTheme,
    roundness: 10,
    colors: {
      ...DefaultTheme.colors,
      primary: 'royalblue',
      accent: 'yellow',
      background: 'white',
      surface: 'white',
      text: 'dodgerblue',
      disabled: 'dodgerblue'
    },
  };  


  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        < Stack.Navigator theme={theme}>
          <Stack.Screen options={{headerShown: false }} name="Login" component={LoginComponent}/>
          <Stack.Screen options={{headerShown: false }} name="SignUp" component={CreateUserComponent}/>
          <Stack.Screen options={{headerShown: false }} name="ForgotPassword" component={ForgotPasswordComponent}/>
          <Stack.Screen options={{headerShown: false }} name="Category" component={DrawerNavigation}/>
        </Stack.Navigator> 
      </NavigationContainer>
    </PaperProvider>
  );
}
