import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {
  colorone,
  yellow,
  green,
  white,
  black,
} from '../assets/settings/color.json';
import {FetchApi} from '../assets/settings/FetchApi';
import {WaitLoader} from '../assets/settings/Loader';
import Toast from 'react-native-simple-toast';
import {AuthContext, WelcomeContext} from '../assets/settings/context';
import {font1} from '../assets/settings/font.json';
import Home from '../screens/Home';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
const Signin = ({navigation}) => {
  const {signIn} = useContext(AuthContext);
  const {setAfterWelcome} = useContext(WelcomeContext);
  const [isValid, setisValid] = useState(true);
  // const controller = AbortController
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const handleLogin = () => {
    setisValid(true);
    if (username === '' && password === '') {
      setisValid(false);
      return false;
    }
    setIsLoading(true);
    FetchApi('/Account/Login', null, {
      UserName: username,
      Password: password,
    })
      .then(async res => {
        if (res.status === 200) {
          res.json().then(async result => {
            await signIn(
              result.userName,
              result.roles[0],
              result.token,
              result.fullName,
              result.phoneNumber,
            );
          });
        } else if (res.status === 406) {
          setShowModal(true);
        } else {
          console.log(res.status);
          setisValid(false);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleConfirmAccount = () => {
    FetchApi('/Account/ConfirmEmailOrPhone', null, {
      UserName: username,
      Otp: otp,
    })
      .then(async res => {
        if (res.status === 200) {
          Toast.show('Account Confirmed Successfully', Toast.LONG);
          res.json().then(async result => {
            await signIn(
              result.userName,
              result.roles[0],
              result.token,
              result.fullName,    
              result.phoneNumber,
            );
          });
          setShowModal(false);
          // navigation.navigate('Home');
        } else {
          Toast.show('Something went wrong, try again later', Toast.SHORT);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {});
  };
  const handleResendOtp = () => {
    FetchApi('/Account/ResendOtp', null, {
      UserName: username,
    })
      .then(async res => {
        console.log(res.status);
        if (res.status === 200) {
          Toast.show('Otp Resent to your phone number', Toast.LONG);
        } else {
          Toast.show('Something went wrong, try again later', Toast.SHORT);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {});
  };
  return (
    <>
      <WaitLoader isLoading={isLoading} />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        <View style={styles.imageview}>
          <StatusBar backgroundColor={green} />
          <Image
            style={{height: 100, width: '100%'}}
            resizeMode="contain"
            source={require('../assets/images/logo.png')}
          />
        </View>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
          }}>
          <Text style={styles.text}>Welcome Back</Text>
          <Text style={styles.textsmall}>Sign in Here to Continue</Text>
        </View>
        <View>
          <TextInput
            style={styles.TextInput}
            keyboardType="phone-pad"
            label="Phone Number"
            placeholder="Enter Your Phone Number"
            mode="outlined"
            theme={{colors: {primary: green}}}
            defaultValue={username}
            onChangeText={val => setUsername(val)}
          />
          <View>
            <TextInput
              style={styles.TextInput}
              placeholder="Enter Your Password"
              mode="outlined"
              theme={{colors: {primary: green}}}
              label="Password"
              secureTextEntry={secureText}
              defaultValue={password}
              onChangeText={val => setPassword(val)}
            />
            <TouchableOpacity
              onPress={() => setSecureText(!secureText)}
              style={{
                padding: 10,
                position: 'absolute',
                right: 0,
                zIndex: 2,
                top: 13,
              }}>
              <FontAwesome
                name={secureText === true ? 'eye-slash' : 'eye'}
                size={22}
              />
            </TouchableOpacity>
          </View>
          {isValid == false ? (
            <View>
              <TouchableOpacity>
                <Text style={{color: 'red'}}>Invalid email or password</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <TouchableOpacity>
            <Text
              style={styles.ForgotPassword}
              onPress={() => navigation.navigate('ForgetPassword')}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={styles.Button} onPress={() => handleLogin()}>
            <Text style={styles.ButtonText}>Sign In</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingVertical: 20,
            }}>
            <Text style={styles.textsmall}>Don't Have an Account? </Text>
            <TouchableOpacity>
              <Text
                style={{color: green, fontFamily: font1}}
                onPress={() => {
                  setAfterWelcome('Signup');
                  setTimeout(() => {
                    navigation.navigate('Signup');
                  }, 0.1);
                }}>
                Sign Up Here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <TouchableOpacity>
          <View style={styles.IconButton}>
            <Image
              source={require('../assets/images/googleicon.png')}
              style={{height: 25, width: 25}}
            />
            <Text style={styles.GoogleText}>Continue With Google</Text>
          </View>
        </TouchableOpacity> */}
      </ScrollView>
      <Modal visible={showModal}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
          <View style={styles.imageview}>
            <Image
              style={{height: 100, width: '100%'}}
              resizeMode="contain"
              source={require('../assets/images/logo.png')}
            />
          </View>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
            }}>
            <Text style={[styles.text, {fontSize: 25}]}>
              Confirm Your Account
            </Text>
          </View>
          <View>
            <TextInput
              style={styles.TextInput}
              keyboardType="phone-pad"
              placeholder="Enter Otp"
              defaultValue={otp}
              theme={{colors: {primary: green}}}
              onChangeText={val => setOtp(val)}
            />
            {isValid == false ? (
              <View>
                <TouchableOpacity>
                  <Text style={styles.error}>Please enter valid otp</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <TouchableOpacity onPress={() => handleResendOtp()}>
              <Text style={styles.ForgotPassword}>Resend Otp ?</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '100%',
            }}>
            <TouchableOpacity
              style={styles.Button}
              onPress={() => handleConfirmAccount()}>
              <Text style={styles.ButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.Button}
              onPress={() => setShowModal(false)}>
              <Text style={styles.ButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
  imageview: {
    // paddingTop: 10,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 15,
  },
  text: {
    textAlign: 'center',
    padding: 10,
    fontSize: 40,
    fontWeight: 'bold',
    color: green,
  },
  textsmall: {
    fontFamily: font1,
  },
  Button: {
    elevation: 3,
    backgroundColor: green,
    borderRadius: 5,
    paddingVertical: 10,
    marginBottom: 20,
  },
  ButtonText: {
    fontSize: 18,
    color: white,
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
    padding: 2,
  },
  TextInput: {
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  IconButton: {
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  ForgotPassword: {
    textAlign: 'right',
    color: green,
    fontFamily: font1,
  },
  GoogleText: {
    color: '#838383',
    fontSize: 20,
    textAlign: 'center',
    paddingRight: 50,
  },
});

export default Signin;
