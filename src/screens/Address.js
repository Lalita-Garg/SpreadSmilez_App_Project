import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {
  green,
  yellow,
  white,
  black,
} from '../assets/settings/color.json';
import {AuthContext, UserContext} from '../assets/settings/context';
import Loader from '../assets/settings/Loader';
import {Title} from 'react-native-paper';
import {FetchApi} from '../assets/settings/FetchApi';

const Address = ({navigation}) => {
  const {signOut} = useContext(AuthContext);
  const {token} = useContext(UserContext);

  const [response, setResponse] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isInternet, setIsInternet] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isEditing, setIsEditing] = useState(false);


  const [skip, setSkip] = useState(0);
  const loadData = () => {
    FetchApi('/User/Addresses', token, {})
      .then(res => {
        if (res.status == 200) {
          res.json().then(result => {
            setResponse(result);
            setTimeout(() => {
              setIsLoaded(true);
              setIsReadOnly(true);
              setIsEditing(false);
              setIsRefreshing(false);
            }, 3000);
            setSkip(10);
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
  };
  useEffect(() => {
    navigation.addListener('focus', () => {
      setIsClicked(true);
      loadData();
    });
    loadData();
  }, [isLoaded]);

  const loadMore = () => {
    FetchApi('/User/Addresses?skip=' + skip, token, {})
      .then(res => {
        if (res.status == 200) {
          res.json().then(result => {
            if (result.length != 0) {
              setResponse([...response, ...result]);
              setSkip(skip + 20);
            } else {
              setIsInternet(true);
              setIsLoaded(true);
              setIsClicked(false);
              setIsRefreshing(false);
              setIsAllLoaded(true);
            }
          });
        } else if (res.status == 403) {
          signOut();
        } else {
            setIsInternet(true);
            setIsLoaded(true);
            setIsClicked(false);
            setIsRefreshing(false);
          ToastAndroid.show('No Internet Connection.', ToastAndroid.SHORT);
        }
      })
      .catch(error => {
          setIsInternet(false);
          setIsLoaded(true);
          setIsClicked(false);
          setIsRefreshing(false);
        ToastAndroid.show('No Internet Connection.', ToastAndroid.SHORT);
      });
  };

  const DeleteAddress = id => {
    setIsClicked(true);
    FetchApi('/User/DeleteAddress?id=' + id,token, {})
      .then(res => {
        if (res.status == 200) {
          loadData();
          setTimeout(() => {
            setIsInternet(true);
            setIsLoaded(true);
            setIsClicked(false);
            setIsRefreshing(false);
          }, 3000);
        } else if (res.status == 403) {
          signOut();
        } else {
            setIsInternet(false);
            setIsLoaded(true);
            setIsClicked(false);
            setIsRefreshing(false);
          ToastAndroid.show('No Internet Connection.', ToastAndroid.SHORT);
        }
      })
      .catch(error => {      
          setIsInternet(false);
          setIsLoaded(true);
          setIsClicked(false);
          setIsRefreshing(false);
        ToastAndroid.show('No Internet Connection.', ToastAndroid.SHORT);
      });
  };

  const onRefresh = useCallback(() => {
      setIsLoaded(true);
      setIsClicked(false);
      setIsRefreshing(true);
    loadData();
  }, []);

  const Item = ({item}) => (
    <View
      style={[
        styles.innerContainer,
        {
          paddingBottom: 10,
          paddingHorizontal: 20,
          marginBottom: 10,
          elevation: 1,
          borderColor: 'gray',
        },
      ]}>
      <Title>{item.fullName}</Title>
      <Text>
        {item.area}, {item.city}, {item.state}, {item.landmark} - {item.pinCode}
      </Text>
      <Text>{item.phoneNumber}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <TouchableOpacity
          style={{padding: 10}}
          onPress={() => {
            navigation.navigate('AddAddress', {id: item.id});
          }}>
          <Icon name="pencil" color="green" size={15} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginLeft: 5, padding: 10}}
          onPress={() => DeleteAddress(item.id)}>
          <Icon name="trash" color="green" size={15} />
        </TouchableOpacity>
      </View>
    </View>
  );
  const renderItem = ({item}) => <Item item={item} />;

  return (
    <>
      {/* <WaitModal modalVisible={state.isRefreshing} />
      <WaitModal modalVisible={state.isClicked} /> */}
      {/* {!state.isLoaded ? <ItemPreloader /> : */}
      <SafeAreaView style={styles.container}>
        <Pressable
          style={{}}
          onPress={() => navigation.navigate('AddAddress')}
          style={styles.modalHeader}>
          <Icon name="plus" color={green} size={20} />
          <Text style={{marginLeft: 5, fontSize: 20, color: green}}>
            Add a new address
          </Text>
        </Pressable>
        <View style={styles.innerContainer}>
          <Text style={{color: 'gray'}}>
            {response.length > 0 ? response.length : 'No'} Saved Addresses
          </Text>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={response}
          keyExtractor={itm => itm.id}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.2}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
            />
          }
        />
      </SafeAreaView>
      {/* } */}
    </>
  );
};

export default Address;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '1%',
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
  },
  thumbnail: {
    width: 60,
    height: 60,
  },
  Athumbnail: {
    borderRadius: 500,
    backgroundColor: green,
    width: 50,
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
  checkTxt: {
    paddingVertical: 0,
    borderRadius: 2,
    color: green,
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
