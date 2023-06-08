import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Button,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {green, yellow} from '../assets/settings/color.json';
import {AuthContext, UserContext} from '../assets/settings/context';
import {ScrollView} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';
import {FetchApi} from '../assets/settings/FetchApi';
import {WaitLoader} from '../assets/settings/Loader';

const AddAddress = ({navigation, route}) => {
  const {signOut} = useContext(AuthContext);
  const {token} = useContext(UserContext);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isInternet, setIsInternet] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [response, setResponse] = useState({
    Id: 0,
    FullName: '',
    PhoneNumber: '',
    State: '',
    City: '',
    Area: '',
    Landmark: '',
    PinCode: '',
    Type: false,
  });

  const loadData = () => {
    if (route.params != undefined) {
      FetchApi('/User/GetAddressById?id=' + route.params.id, token, {})
        .then(res => {
          if (res.status == 200) {
            res.json().then(result => {
              setResponse({
                ...response,
                Id: result.id,
                FullName: result.fullName,
                PhoneNumber: result.phoneNumber,
                State: result.state,
                City: result.city,
                Area: result.area,
                Landmark: result.landmark,
                PinCode: result.pinCode,
                Type: result.type,
              });
              console.log(response.PinCode.toString(), 'jhhhj');
              setTimeout(() => {
                setIsLoaded(true);
                setIsReadOnly(true);
                setIsEditing(false);
                setIsRefreshing(false);
              }, 3000);
            });
          } else if (res.status == 403) {
            signOut();
          } else {
            setIsInternet(false);
            setIsLoaded(true);
            setIsReadOnly(true);
            setIsEditing(false);
            setIsRefreshing(false);
            ToastAndroid.show('No Internet Connection.', ToastAndroid.SHORT);
          }
        })
        .catch(error => {
          setIsInternet(false);
          setIsLoaded(true);
          setIsReadOnly(true);
          setIsEditing(false);
          setIsRefreshing(false);
          ToastAndroid.show('No Internet Connection.', ToastAndroid.SHORT);
        });
    } else {
      setIsInternet(true);
      setIsLoaded(true);
      setIsReadOnly(true);
      setIsEditing(false);
      setIsRefreshing(false);
    }
  };
  function SaveAddress() {
    if (
      response.FullName != '' &&
      response.PhoneNumber != '' &&
      response.State != '' &&
      response.City != '' &&
      response.Area != '' &&
      response.Landmark != '' &&
      response.PinCode != ''
    ) {
      setIsClicked(true);
      FetchApi('/User/CreateAddress', token, {
        FullName: response.FullName,
        PhoneNumber: response.PhoneNumber,
        State: response.State,
        City: response.City,
        Area: response.Area,
        Landmark: response.Landmark,
        PinCode: response.PinCode,
        Type: response.Type,
      })
        .then(res => {
          if (res.status == 200) {
            setIsLoaded(true), setIsClicked(false);
            setIsRefreshing(false);
            navigation.navigate('Address');
          } else {
            setIsClicked(false);
            ToastAndroid.show('Something went wrong, try again');
          }
        })
        .catch(error => {
          setIsInternet(false);
          setIsClicked(false);
          ToastAndroid.show('No Internet Connection', ToastAndroid.SHORT);
        });
    } else {
      ToastAndroid.show('Please fill all details', ToastAndroid.LONG);
    }
  }

  function UpdateAddress() {
    if (
      response.FullName != '' &&
      response.PhoneNumber != '' &&
      response.State != '' &&
      response.City != '' &&
      response.Area != '' &&
      response.Landmark != '' &&
      response.PinCode != ''
    ) {
      setIsClicked(true);
      FetchApi('/User/UpdateAddress', token, {
        Id: parseInt(response.Id),
        FullName: response.FullName,
        PhoneNumber: response.PhoneNumber,
        State: response.State,
        City: response.City,
        Area: response.Area,
        Landmark: response.Landmark,
        PinCode: parseInt(response.PinCode),
        Type: response.Type,
      })
        .then(res => {
          if (res.status == 200) {
            setIsLoaded(true);
            setIsRefreshing(false);
            setIsClicked(false);
            navigation.navigate('Address');
          } else {
            setIsClicked(false);
            ToastAndroid.show('Something went wrong, try again');
          }
        })
        .catch(error => {
          console.log(error);
          setIsInternet(false);
          setIsClicked(false);
          ToastAndroid.show('No Internet Connection', ToastAndroid.SHORT);
        });
    } else {
      ToastAndroid.show('Please fill all details', ToastAndroid.LONG);
    }
  }
  useEffect(() => {
    loadData();
  }, [isLoaded]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setIsLoaded(true);
    setIsClicked(false);
    loadData();
  }, []);

  return (
    <>
      {/* <WaitModal modalVisible={state.isClicked} /> */}
      {!isLoaded ? (
        <WaitLoader />
      ) : (
        <SafeAreaView style={styles.container}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.innerContainer}>
              <Text style={{color: 'gray', marginBottom: 5}}>
                Full Name(Required)*
              </Text>
              <TextInput
                onChangeText={val => setResponse({...response, FullName: val})}
                value={response.FullName}
                style={styles.inputTxt}
                placeholder="Full Name(Required)*"
              />
              <Text style={{color: 'gray', marginBottom: 5}}>
                Phone Number(Required)*
              </Text>
              <TextInput
                onChangeText={val =>
                  setResponse({...response, PhoneNumber: val})
                }
                value={response.PhoneNumber}
                keyboardType="numeric"
                style={styles.inputTxt}
                placeholder="Phone Number(Required)*"
              />
              <Text style={{color: 'gray', marginBottom: 5}}>
                State(Required)*
              </Text>
              <TextInput
                onChangeText={val => setResponse({...response, State: val})}
                value={response.State}
                style={styles.inputTxt}
                placeholder="State(Required)*"
              />
              <Text style={{color: 'gray', marginBottom: 5}}>
                City(Required)*
              </Text>
              <TextInput
                onChangeText={val => setResponse({...response, City: val})}
                value={response.City}
                style={styles.inputTxt}
                placeholder="City(Required)*"
              />
              <Text style={{color: 'gray', marginBottom: 5}}>
                Area/Sub City/Colony(Required)*
              </Text>
              <TextInput
                onChangeText={val => setResponse({...response, Area: val})}
                value={response.Area}
                style={styles.inputTxt}
                placeholder="Area/Sub City/Colony(Required)*"
              />
              <Text style={{color: 'gray', marginBottom: 5}}>
                Land Mark(Required)*
              </Text>
              <TextInput
                onChangeText={val => setResponse({...response, Landmark: val})}
                value={response.Landmark}
                style={styles.inputTxt}
                placeholder="Land Mark(Required)*"
              />
              <Text style={{color: 'gray', marginBottom: 5}}>
                Pin Code(Required)*
              </Text>
              <TextInput
                onChangeText={val => setResponse({...response, PinCode: val})}
                value={response.PinCode.toString()}
                keyboardType="numeric"
                style={styles.inputTxt}
                placeholder="Pin Code(Required)*"
              />
              <Text style={{color: 'gray', marginBottom: 5}}>
                Type of Address(Required)*
              </Text>
              <RadioButton.Group
                onValueChange={newValue =>
                  setResponse({...response, Type: newValue})
                }
                value={response.Type}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <RadioButton value={true} color={'gray'}/>
                    <Text>Home</Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <RadioButton value={false} color={'gray'}/>
                    <Text>Work</Text>
                  </View>
                </View>
              </RadioButton.Group>
              <View style={{marginTop: 20}}>
                {response.Id != 0 || response.Id != '' ? (
                  <Button
                    title="Update Address"
                    color={green}
                    onPress={() => UpdateAddress()}
                  />
                ) : (
                  <Button
                    title="Save Address"
                    color={green}
                    onPress={() => SaveAddress()}
                  />
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default AddAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  latestContainer: {
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    width: '100%',
  },
  titleContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
  },
  innerContainer: {
    flexGrow: 1,
    padding: 10,
  },
  scontainer: {
    flexGrow: 1,
    height: '100%',
  },
  scrollView: {
    flexGrow: 1,
  },
  category: {
    padding: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
  },
  Athumbnail: {
    borderRadius: 500,
    backgroundColor: 'green',
    width: 50,
    height: 50,
    marginTop: 7,
    marginBottom: 9,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    color: 'white',
    paddingTop: 10,
    paddingBottom: 10,
  },
  // icon: {
  //   alignSelf: 'center',
  // },
  title: {
    textAlign: 'center',
    maxWidth: 100,
  },

  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  inputTxt: {
    width: '100%',
    paddingVertical: 13,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 2,
    color: 'gray',
  },
  checkBtn: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 2,
    borderColor: green,
    borderWidth: 1,
  },
  checkBtnTxt: {
    textAlign: 'center',
    color: green,
  },
  modalViewContainer: {
    backgroundColor: '#0a0a0a8f',
    flex: 1,
  },
  modalView: {
    width: '100%',
    height: '100%',
    top: '50%',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderColor: 'white',
    elevation: 1,
    alignItems: 'center',
    width: '100%',
  },
});
