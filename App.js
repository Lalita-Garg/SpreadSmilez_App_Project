import React, {useState, useEffect} from 'react';

import {View, Text, StatusBar} from 'react-native';
import Signin from './src/screens/Signin';
import Welcome from './src/screens/Welcome';
import Signup from './src/screens/Signup';
import Stacknavigator from './src/navigation/AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator';

import {
  AuthContext,
  TitleContext,
  UserContext,
  WelcomeContext,
} from './src/assets/settings/context';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './src/screens/Home';
import Loader from './src/assets/settings/Loader';
import DrawerNavigation from './src/navigation/DrawerNavigation';
import {colorone, yellow, green} from './src/assets/settings/color.json';
import Order from './src/screens/Order';
import MainStackNavigation from './src/navigation/MainStackNavigation';

const Stack = createStackNavigator();
const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [welcomeScreen, setwelcomeScreen] = useState('false');
  const [afterWelcome, setAfterWelcome] = useState('Signin');
  const [screenTitle, setScreenTitle] = useState('');
  // Auth Actions using Reducer start //
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          userName: action.userName,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };
  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );
  const [appUser, setAppUser] = useState({
    token: '',
    userName: '',
    fullName: '',
    phoneNumber: '',
    userRole: '',
  });
  const authContext = React.useMemo(
    () => ({
      signIn: async (userName, userRole, token, fullName, phoneNumber) => {
        let userToken;
        userToken = null;
        try {
          userToken = token;
          setAppUser({
            ...appUser,
            userName: userName,
            userRole: userRole,
            token: token,
            fullName: fullName,
            phoneNumber: phoneNumber,
          });
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('userName', userName);
          await AsyncStorage.setItem('userRole', userRole);
          await AsyncStorage.setItem('fullName', fullName);
          await AsyncStorage.setItem('phoneNumber', phoneNumber);
        } catch (e) {
          console.log(e);
        }
        dispatch({
          type: 'LOGIN',
          id: userName,
          token: userToken,
          isLoading: false,
        });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userName');
          await AsyncStorage.removeItem('userRole');
          await AsyncStorage.removeItem('fullName');
          await AsyncStorage.removeItem('phoneNumber');
          await GetUser();
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'LOGOUT'});
      },
    }),
    [],
  );

  let userToken = null;
  let userName = null;
  let userRole = null;
  let fullName = null;
  let phoneNumber = null;
  const GetUser = async () => {
    try {
      userToken = await AsyncStorage.getItem('userToken');
      userName = await AsyncStorage.getItem('userName');
      userRole = await AsyncStorage.getItem('userRole');
      fullName = await AsyncStorage.getItem('fullName');
      phoneNumber = await AsyncStorage.getItem('phoneNumber');
      setAppUser({
        ...appUser,
        userName: userName,
        userRole: userRole,
        token: userToken,
        fullName: fullName,
        phoneNumber:
          phoneNumber != '' && phoneNumber != null
            ? phoneNumber.toString()
            : phoneNumber,
      });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    GetUser();
    setTimeout(() => {
      dispatch({
        type: 'RETRIEVE_TOKEN',
        token: userToken,
        userName: userName,
        userRole: userRole,
      });
      setIsLoaded(true);
    }, 3000);
  }, []);

  // Auth Actions using Reducer start //
  const welcomeStatus = async () => {
    var status = await AsyncStorage.getItem('welcome');
    setwelcomeScreen(status);
  };
  useEffect(() => {
    welcomeStatus();
  }, []);
  if (isLoaded != true) {
    return <Loader />;
  }
  return (
    <WelcomeContext.Provider
      value={{welcomeScreen, setwelcomeScreen, afterWelcome, setAfterWelcome}}>
      <TitleContext.Provider value={{screenTitle, setScreenTitle}}>
        <UserContext.Provider value={appUser}>
          <AuthContext.Provider value={authContext}>
            <StatusBar backgroundColor={green} />
            <NavigationContainer>
              {loginState.userToken != null ? (
                <MainStackNavigation />
              ) : (
                <AuthNavigator />
              )}
            </NavigationContainer>
          </AuthContext.Provider>
        </UserContext.Provider>
      </TitleContext.Provider>
    </WelcomeContext.Provider>
  );
};

export default App;
