import React, {useState} from 'react';
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
  ScrollView,
  Modal,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import {TextInput} from 'react-native-paper';
import {
  colorone,
  green,
  white,
  black,
  yellow,
} from '../assets/settings/color.json';
import {FetchApi} from '../assets/settings/FetchApi';
import {font1} from '../assets/settings/font.json';
import Toast from 'react-native-simple-toast';
import {WaitLoader} from '../assets/settings/Loader';

const ForgetPassword = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const {validate, isFieldInError, getErrorsInField, getErrorMessages} =
    useValidation({
      state: {phoneNumber, password, confirmNewPassword, otp},
    });

  const handleSubmit = () => {
    validate({
      phoneNumber: {
        numbers: true,
        required: true,
        maxlength: 10,
        minlength: 10,
      },
    });
    if (
      !validate({
        phoneNumber: {
          numbers: true,
          required: true,
          maxlength: 10,
          minlength: 10,
        },
      })
    ) {
      return false;
    }
    setIsLoading(true);
    FetchApi('/Account/GeneratePasswordResetToken', null, {
      UserName: phoneNumber,
    })
      .then(async res => {
        console.log(res.status);
        if (res.status === 200) {
          Toast.show('Otp Sent to your phone number', Toast.SHORT);
          setShowModal(true);
        } else {
          Toast.show('Something went wrong, try again later', Toast.SHORT);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleResendOtp = () => {
    setIsLoading(true);
    FetchApi('/Account/ResendOtp', null, {
      UserName: phoneNumber,
    })
      .then(async res => {
        if (res.status === 200) {
          Toast.show('Otp Resent to your phone number', Toast.SHORT);
        } else {
          Toast.show('Something went wrong, try again later', Toast.SHORT);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const resetAccount = () => {
    validate({
      otp: {required: true},
      password: {password: true, required: true, minlength: 7},
      confirmNewPassword: {equalPassword: password},
    });
    if (
      !validate({
        otp: {required: true},
        password: {password: true, required: true, minlength: 6},
        confirmNewPassword: {equalPassword: password},
      })
    ) {
      return false;
    }
    setIsLoading(true);
    FetchApi('/Account/ResetPassword', null, {
      UserName: phoneNumber,
      Password: password,
      Otp: otp,
    })
      .then(async res => {
        console.log(res.status);
        if (res.status === 200) {
          Toast.show('Your Password has been Reset Successfully', Toast.SHORT);
          setShowModal(false);
          navigation.navigate('Signin');
        } else {
          Toast.show('Something went wrong, try again later', Toast.SHORT);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <WaitLoader isLoading={isLoading} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            // width: '100%',
            alignItems: 'center',
            paddingTop: 20,
          }}>
          <Image
            style={{height: 100}}
            resizeMode="contain"
            source={require('../assets/images/logo.png')}
          />
        </View>
        <View>
          <Text style={styles.text}>Forgot Your Password ?</Text>
        </View>
        <View>
          <Text style={{paddingVertical: 15, fontFamily: font1}}>
            Enter Your Registered Phone-Number Here
          </Text>
          <TextInput
            //  style={styles.TextInput}
            keyboardType="phone-pad"
            mode="outlined"
            theme={{colors: {primary: green}}}
            label="Phone Number"
            defaultValue={phoneNumber}
            onChangeText={val => setPhoneNumber(val)}
          />
          {isFieldInError('phoneNumber') &&
            getErrorsInField('phoneNumber').map(errorMessage => (
              <Text key={errorMessage} style={styles.errortext}>
                {errorMessage.replace('"phoneNumber"', 'Phone-Number')}
              </Text>
            ))}
        </View>
        <View>
          <TouchableOpacity
            style={styles.Button}
            onPress={() => handleSubmit()}>
            <Text style={styles.ButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showModal}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled">
            <View
              style={{
                paddingTop: 10,
              }}>
              <Image
                style={{height: 100, width: '100%'}}
                resizeMode="contain"
                source={require('../assets/images/logo.png')}
              />
            </View>
            <View>
              <Text style={[styles.text, {fontSize: 25}]}>Reset Password</Text>
            </View>
            <View
              style={{
                width: '100%',
              }}>
              <TextInput
                style={styles.TextInput}
                keyboardType="phone-pad"
                mode="outlined"
                theme={{colors: {primary: green}}}
                label="Enter Otp"
                defaultValue={otp}
                onChangeText={val => setOtp(val)}
              />
              {isFieldInError('otp') &&
                getErrorsInField('otp').map(errorMessage => (
                  <Text key={errorMessage} style={styles.errortext}>
                    {errorMessage.replace('"otp"', 'OTP')}
                  </Text>
                ))}
              <View>
                <TextInput
                  style={styles.TextInput}
                  secureTextEntry={secureText}
                  mode="outlined"
                  mode="outlined"
                  theme={{colors: {primary: green}}}
                  label="Enter New Password"
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
                  mode="outlined"
                  secureTextEntry={secureText}
                  theme={{colors: {primary: green}}}
                  label="Confirm New Password"
                  defaultValue={confirmNewPassword}
                  onChangeText={val => setConfirmNewPassword(val)}
                />
              </View>
              {isFieldInError('confirmNewPassword') &&
                getErrorsInField('confirmNewPassword').map(errorMessage => (
                  <Text key={errorMessage} style={styles.errortext}>
                    {errorMessage}
                  </Text>
                ))}

              <TouchableOpacity onPress={() => handleResendOtp()}>
                <Text
                  style={{
                    textAlign: 'right',
                    paddingVertical: 10,
                    color: black,
                    fontFamily: font1,
                  }}>
                  Resend Otp ?
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={styles.Button}
                onPress={() => resetAccount()}>
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
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 15,
  },
  text: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    color: green,
    paddingTop: 20,
  },
  Button: {
    elevation: 3,
    backgroundColor: green,
    borderRadius: 5,
    paddingVertical: 10,
    marginVertical: 10,
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
    backgroundColor: white,
    paddingVertical: 10,
  },
  ResendOtpText: {
    textAlign: 'right',
    color: black,
    fontFamily: font1,
    paddingVertical: 20,
  },
  errortext: {
    marginBottom: 10,
    color: 'red',
  },
  showPassword: {
    padding: 10,
    position: 'absolute',
    right: 0,
    zIndex: 2,
    top: 21,
  },
});

export default ForgetPassword;
