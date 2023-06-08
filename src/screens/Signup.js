import React, {useContext, useState} from 'react';
import {useValidation} from 'react-native-form-validator';
import {
  View,
  Dimensions,
  Text,
  SafeAreaView,
  FontVariant,
  Platform,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  Button,
  Link,
  Modal,
  ScrollView,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import {
  colorone,
  green,
  black,
  white,
  yellow,
} from '../assets/settings/color.json';
import {FetchApi} from '../assets/settings/FetchApi';
import Toast from 'react-native-simple-toast';
import {font1} from '../assets/settings/font.json';
import {WaitLoader} from '../assets/settings/Loader';
import {WelcomeContext} from '../assets/settings/context';
const Signup = ({navigation}) => {
  const {setAfterWelcome} = useContext(WelcomeContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setisValid] = useState(true);
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const {validate, isFieldInError, getErrorsInField, getErrorMessages} =
    useValidation({
      state: {name, email, phoneNumber, password, confirmPassword},
    });

  const handleSignup = () => {
    validate({
      name: {minlength: 3, maxlength: 12, required: true},
      email: {email: true, required: true},
      password: {password: true, required: true, minlength: 6},
      phoneNumber: {
        numbers: true,
        required: true,
        maxlength: 10,
        minlength: 10,
      },
      confirmPassword: {equalPassword: password},
    });
    if (
      !validate({
        name: {minlength: 3, maxlength: 12, required: true},
        email: {email: true, required: true},
        password: {password: true, required: true, minlength: 7},
        phoneNumber: {
          numbers: true,
          required: true,
          maxlength: 10,
          minlength: 10,
        },
        confirmPassword: {equalPassword: password},
      })
    ) {
      return false;
    }
    setIsLoading(true);
    FetchApi('/Account/Register', null, {
      FullName: name,
      Password: password,
      PhoneNumber: phoneNumber,
      Email: email,
    })
      .then(async res => {
        setUsername(phoneNumber);
        if (res.status === 200) {
          Toast.show('Register Success');
          setShowModal(true);
          // setAfterWelcome('Signin');
          // setTimeout(() => {
            // navigation.navigate('Signin');
          // }, 0.1);
        } else if (res.status === 409) {
          Toast.show('You are already registered with this number');
        } else {
          Toast.show('Something went wrong, try again later');
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
          // navigation.navigate(Home);
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
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar backgroundColor={green} />
        <View
          style={{
            alignItems: 'center',
            paddingTop: 10,
          }}>
          <Image
            style={{height: 100}}
            resizeMode="contain"
            source={require('../assets/images/logo.png')}
          />
        </View>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
          }}>
          <Text style={styles.text}>Sign Up Now</Text>
          <Text style={styles.textsmall}>New User? Register yourself</Text>
        </View>
        <View>
          <TextInput
            style={styles.TextInput}
            label="Name"
            mode="outlined"
            theme={{colors: {primary: green}}}
            defaultValue={name}
            onChangeText={val => setName(val)}
          />
          {isFieldInError('name') &&
            getErrorsInField('name').map(errorMessage => (
              <Text key={errorMessage} style={styles.errortext}>
                {errorMessage.replace('"name"', 'Name')}
              </Text>
            ))}
          <TextInput
            style={styles.TextInput}
            label="Email"
            mode="outlined"
            theme={{colors: {primary: green}}}
            defaultValue={email}
            onChangeText={val => setEmail(val)}
          />
          {isFieldInError('email') &&
            getErrorsInField('email').map(errorMessage => (
              <Text key={errorMessage} style={styles.errortext}>
                {errorMessage.replace('"email"', 'Email')}
              </Text>
            ))}
          <TextInput
            style={styles.TextInput}
            label="Phone Number"
            mode="outlined"
            theme={{colors: {primary: green}}}
            keyboardType="phone-pad"
            defaultValue={phoneNumber}
            onChangeText={val => setPhoneNumber(val)}
          />
          {isFieldInError('phoneNumber') &&
            getErrorsInField('phoneNumber').map(errorMessage => (
              <Text key={errorMessage} style={styles.errortext}>
                {errorMessage.replace('"phoneNumber"', 'Phone-Number')}
              </Text>
            ))}
          <View>
            <TextInput
              style={styles.TextInput}
              label="Password"
              mode="outlined"
              theme={{colors: {primary: green}}}
              secureTextEntry={secureText}
              defaultValue={password}
              onChangeText={val => setPassword(val)}
            />
            <TouchableOpacity
              onPress={() => setSecureText(!secureText)}
              style={styles.showPassword}>
              <FontAwesome
                name={secureText === true ? 'eye-slash' : 'eye'}
                size={22}
              />
            </TouchableOpacity>
            {isFieldInError('password') &&
              getErrorsInField('password').map(errorMessage => (
                <Text key={errorMessage} style={styles.errortext}>
                  {errorMessage.replace('"password"', 'Password')}
                </Text>
              ))}
            <TextInput
              style={styles.TextInput}
              label="Confirm Password"
              mode="outlined"
              theme={{colors: {primary: green}}}
              secureTextEntry={secureText}
              defaultValue={confirmPassword}
              onChangeText={val => setConfirmPassword(val)}
            />
          </View>
          {isFieldInError('confirmPassword') &&
            getErrorsInField('confirmPassword').map(errorMessage => (
              <Text key={errorMessage} style={styles.errortext}>
                {errorMessage}
              </Text>
            ))}
        </View>
        <View
          style={{
            width: '100%',
          }}>
          <TouchableOpacity
            onPress={() => handleSignup()}
            style={styles.Button}>
            <Text style={styles.ButtonText}>Sign up</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingVertical: 20,
            }}>
            <Text style={styles.textsmall}>Already Have an Account? </Text>
            <TouchableOpacity>
              <Text
                style={{color: green, fontFamily: font1}}
                onPress={() => {
                  setAfterWelcome('Signin');
                  setTimeout(() => {
                    navigation.navigate('Signin');
                  }, 0.1);
                }}>
                Sign In Here
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
  container: {
    flexGrow: 1,
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: white,
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
  errortext: {
    marginBottom: 10,
    color: 'red',
  },
  Button: {
    elevation: 3,
    backgroundColor: green,
    borderRadius: 5,
    paddingVertical: 10,
    marginBottom:20,
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
    // borderRadius: 5,
    marginBottom: 20,
    backgroundColor: white,
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
  GoogleText: {
    color: '#838383',
    fontSize: 20,
    textAlign: 'center',
    paddingRight: 50,
  },
  showPassword: {
    padding: 10,
    position: 'absolute',
    right: 0,
    zIndex: 2,
    top: 13,
  },
});

export default Signup;
