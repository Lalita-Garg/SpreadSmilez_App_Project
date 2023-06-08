import React, {useContext, useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Welcome from '../screens/Welcome';
import Signin from '../screens/Signin';
import Signup from '../screens/Signup';
import ForgetPassword from '../screens/ForgetPassword';
import {WelcomeContext} from '../assets/settings/context';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  const {welcomeScreen, afterWelcome} = useContext(WelcomeContext);
  return (
    <Stack.Navigator
      initialRouteName={welcomeScreen != 'true' ? 'welcome' : afterWelcome}
      screenOptions={{headerShown: false}}>
      {welcomeScreen != 'true' ? (
        <Stack.Screen name="Welcome" component={Welcome} />
      ) : (
        <>
          {afterWelcome === 'Signin' ? (
            <Stack.Screen name="Signin" component={Signin} />
          ) : (
            <Stack.Screen name="Signup" component={Signup} />
          )}
          <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        </>
      )}
    </Stack.Navigator>
  );
}
