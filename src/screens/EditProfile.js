import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  Modal,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  Avatar,
  Title,
  Caption,
  TextInput,
  RadioButton,
} from 'react-native-paper';
import {
  colorone,
  yellow,
  black,
  green,
  white,
} from '../assets/settings/color.json';
import {FetchApi, FetchFormApi} from '../assets/settings/FetchApi';
import {UserContext} from '../assets/settings/context';
import * as ImagePicker from 'react-native-image-picker';
import RadioGroup from 'react-native-radio-buttons-group';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Toast from 'react-native-simple-toast';

const EditProfile = () => {
  const {token} = useContext(UserContext);
  const [data, setData] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [image, setImage] = useState(null);
  const [imageSource, setImageSource] = useState([]);
  const [radioButtons, setRadioButtons] = useState(radioButtons);
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);


  const getProfile = () => {
    FetchApi('/Account/GetProfileSettings', token, {})
      .then(res => {
        if (res.status === 200) {
          res.json().then(result => {
            setData(result);
            setImage(result.imageUrl);
            setGender(result.gender);
          });
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {});
  };

  useEffect(() => {
    getProfile();
  }, []);

  const updateProfile = () => {
    var formData = new FormData();
    formData.append('FullName', name != '' ? name : data.fullName);
    formData.append('Email', email != '' ? email : data.email);
    formData.append('Address', address != '' ? address : data.address);
    // formData.append('DOB', dob);
    formData.append('Gender', gender);
    if (imageSource.length != 0) {
      formData.append('Image', {
        name: imageSource.fileName,
        uri: imageSource.uri,
        type: imageSource.type,
      });
    }
    FetchFormApi('/Account/UpdateProfileSettings', token, formData)
      .then(async res => {
        console.log(res.status);
        if (res.status === 200) {
          getProfile();
          res.json().then(result => {
            // console.log(result);
          });
          Toast.show('Updated Successfully');
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {});
  };

  const ChangePassword = () =>{
    setShowModal(false)
    FetchApi('/Account/ChangePassword', token, {
      OldPassword: oldPassword,
      NewPassword: newPassword,
    })
      .then(async res => {
        console.log(res.status);
        if (res.status === 200) {
          Toast.show('Your Password has Changed Successfully', Toast.SHORT);
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
        // setIsLoading(false);
      });
  };
  

  function selectImage() {
    var options = {
      title: 'Choose Image',
      mediaType: 'photo',
      quality: 0.5,
      storageOptions: {
        skipbackup: true,
      },
    };
    ImagePicker.launchImageLibrary({options}, res => {
      if (res.didCancel) {
        Alert.alert('You did not choose any image');
      } else if (res.errorMessage) {
        console.log(res.errorMessage);
      } else {
        setImageSource(res.assets[0]);
        setImage(res.assets[0].uri);
      }
    });
  }

  function onPressRadioButton(val) {
    val.forEach(item => {
      if (item.selected === true) {
        setGender(item.value);
        // console.log(item.value);
      }
    });
  }

  return (
    <ScrollView style={Styles.container} keyboardShouldPersistTaps="true">
      <StatusBar backgroundColor={green} />
      <View>
        <View style={Styles.profileView}>
          <TouchableOpacity onPress={() => selectImage()}>
            <View>
              {image === null ? (
                <Avatar.Icon
                  size={80}
                  icon="camera"
                  backgroundColor={white}
                  color={green}
                />
              ) : (
                <View>
                  <Avatar.Image source={{uri: image}} size={80} />
                  <Avatar.Icon
                    icon="camera"
                    style={[
                      {position: 'absolute'},
                      image.length > 0 ? {right: -25, bottom: -20} : null,
                    ]}
                    backgroundColor={'transparent'}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View style={Styles.infoContainer}>
          <View>
            <TextInput
              label={data.fullName}
              placeholder="Fullname"
              value={name}
              onChangeText={val => setName(val)}
              style={{
                backgroundColor: 'white',
                marginVertical: 10,
              }}
              theme={{colors: {primary: green}}}
            />
          </View>
          <TextInput
            label={data.email}
            placeholder="Email"
            value={email}
            onChangeText={email => setEmail(email)}
            style={{
              backgroundColor: 'white',
              marginVertical: 10,
            }}
            theme={{colors: {primary: green}}}
          />
          <TouchableOpacity
            // onPress={() => setSecureText(!secureText)}
            style={{
              padding: 10,
              position: 'absolute',
              right: 0,
              zIndex: 2,
              top: 205,
            }}>
            <Text style={{color: green, textAlign: 'center', fontSize: 16}}>
              Update
            </Text>
          </TouchableOpacity>
          <TextInput
            label={data.phoneNumber}
            editable={false}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={phoneNumber => setPhoneNumber(phoneNumber)}
            style={{
              backgroundColor: 'white',
              marginVertical: 10,
            }}
            theme={{colors: {primary: green}}}
          />

          {/* <TextInput
            label={data.dob}
            placeholder="Date of Birth"
            value={dob}
            onChangeText={dob => setDob(dob)}
            style={{
              backgroundColor: 'white',
              marginVertical: 10,
            }}
            theme={{colors: {primary: green}}}
          /> */}
          <TextInput
            label={data.address}
            placeholder="Address"
            value={address}
            onChangeText={address => setAddress(address)}
            style={{
              backgroundColor: 'white',
              marginVertical: 10,
            }}
            theme={{colors: {primary: green}}}
          />
          <View
            style={{
              marginVertical: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{paddingRight: 10, color: 'gray', fontSize: 16}}>
              Select Gender
            </Text>
            <RadioGroup
              radioButtons={[
                {
                  id: '1',
                  label: <Text style={{color: 'gray'}}>{'Male'}</Text>,
                  value: 'Male',
                  color: green,
                },
                {
                  id: '2',
                  label: <Text style={{color: 'gray'}}>{'Female'}</Text>,
                  value: 'Female',
                  color: green,
                },
              ]}
              onPress={val => onPressRadioButton(val)}
              layout="row"
            />
          </View>

          <TouchableOpacity onPress={() => setShowModal(true)}>
            <View style={Styles.btn}>
              <Text style={Styles.btnTxt}>Change Password</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={Styles.Button}
            onPress={() => {
              updateProfile();
            }}>
            <Text style={Styles.ButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={showModal}>
        <ScrollView contentContainerStyle={Styles.modalContainer}>
          <View>
            <View>
              <Text style={Styles.modalText}>Change Password</Text>
            </View>
            <TextInput
              style={Styles.TextInput}
              secureTextEntry={secureText}
              mode="outlined"
              mode="outlined"
              theme={{colors: {primary: green}}}
              label="Enter Old Password"
              onChangeText={val => setOldPassword(val)}
            />
            <TouchableOpacity
                  onPress={() => setSecureText(!secureText)}
                  style={[Styles.showPassword,{top:75}]}>
                  <FontAwesome
                    name={secureText === true ? 'eye-slash' : 'eye'}
                    size={18}
                  />
                </TouchableOpacity>
            <TextInput
              style={Styles.TextInput}
              secureTextEntry={secureText}
              mode="outlined"
              mode="outlined"
              theme={{colors: {primary: green}}}
              label="Enter New Password"
              onChangeText={val => setNewPassword(val)}
            />
            <TouchableOpacity
                  onPress={() => setSecureText(!secureText)}
                  style={Styles.showPassword}>
                  <FontAwesome
                    name={secureText === true ? 'eye-slash' : 'eye'}
                    size={18}
                  />
                </TouchableOpacity>
            <TextInput
              style={Styles.TextInput}
              mode="outlined"
              secureTextEntry={secureText}
              theme={{colors: {primary: green}}}
              label="Confirm New Password"
              defaultValue={confirmPassword}
              onChangeText={val => setConfirmPassword(val)}
            />
            <TouchableOpacity
                  onPress={() => setSecureText(!secureText)}
                  style={[Styles.showPassword,{top:162}]}>
                  <FontAwesome
                    name={secureText === true ? 'eye-slash' : 'eye'}
                    size={18}
                  />
                </TouchableOpacity>

<TouchableOpacity
                style={Styles.Button}
                onPress={() =>ChangePassword()}>
                <Text style={Styles.ButtonText}>Save</Text>
              </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </ScrollView>
  );
};

const Styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: white,
  },
  profileView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 3,
    backgroundColor: green,
    paddingVertical: 20,
  },
  infoContainer: {
    padding: 15,
  },
  Button: {
    elevation: 3,
    backgroundColor: green,
    borderRadius: 5,
    paddingVertical: 12,
  },
  ButtonText: {
    fontSize: 18,
    color: white,
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  btn: {
    borderColor: green,
    borderWidth: 1,
    alignItems: 'center',
    marginVertical: 15,
  },
  btnTxt: {
    fontSize: 20,
    lineHeight: 40,
    color: green,
  },
  modalContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
  },
  TextInput: {
    borderRadius: 5,
    backgroundColor: white,
    paddingVertical: 10,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 25,
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
  showPassword: {
    padding: 10,
    position: 'absolute',
    right: 0,
    zIndex: 2,
    top: 245,
  },
});

export default EditProfile;
