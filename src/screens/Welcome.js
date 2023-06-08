import React, {useContext} from 'react';
import {
  View,
  Dimensions,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import {WelcomeContext} from '../assets/settings/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {font1} from '../assets/settings/font.json';
import {yellow, green, black, white} from '../assets/settings/color.json';

const width = Dimensions.get('window').width;
const Welcome = ({navigation}) => {
  const {setwelcomeScreen, setAfterWelcome} = useContext(WelcomeContext);

  async function handleWelcome() {
    setAfterWelcome('Signup');
    setwelcomeScreen('true');
    await AsyncStorage.setItem('welcome', 'true');
    navigation.navigate('Signup');
  }
  async function handleLogin() {
    setAfterWelcome('Signin');
    setwelcomeScreen('true');
    await AsyncStorage.setItem('welcome', 'true');
    navigation.navigate('Signin');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor={green} />
      <View style={styles.imageview}>
        <Image
          style={{height: '100%'}}
          source={require('../assets/images/logo.png')}
          resizeMode="contain"
        />
      </View>
      <View>
        <Text style={styles.text}>LET'S GET STARTED</Text>
        <Text style={styles.textsmall}>
          Create a New Account and get access to thousands of products
        </Text>
      </View>
      <View>
        <TouchableOpacity style={styles.Button} onPress={() => handleWelcome()}>
          <Text style={styles.ButtonText}>Create Account</Text>
        </TouchableOpacity>
        <View style={{paddingVertical: 15}}>
          <TouchableOpacity style={styles.Button} onPress={() => handleLogin()}>
            <Text style={styles.ButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: white,
  },
  imageview: {
    alignItems: 'center',
    paddingTop: 10,
    height: 150,
  },
  text: {
    textAlign: 'center',
    fontSize: 30,
    padding: 10,
    fontWeight: 'bold',
    color: black,
  },
  textsmall: {
    fontFamily: font1,
    textAlign: 'center',
  },
  Button: {
    elevation: 3,
    backgroundColor: green,
    borderRadius: 5,
    paddingVertical: 10,
    height: 50,
  },
  ButtonText: {
    fontSize: 18,
    color: white,
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});

export default Welcome;
