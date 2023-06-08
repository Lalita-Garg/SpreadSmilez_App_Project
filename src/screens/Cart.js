import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  ToastAndroid,
  Dimensions,
  Button,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {green, yellow, black} from '../assets/settings/color.json';
import {AuthContext, UserContext} from '../assets/settings/context';
import {Title} from 'react-native-paper';
import {RadioButton} from 'react-native-paper';
import {FetchApi} from '../assets/settings/FetchApi';
import RazorpayCheckout from 'react-native-razorpay';
import * as Animatable from 'react-native-animatable';
import Loader, {WaitLoader} from '../assets/settings/Loader';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const Address = ({navigation}) => {
  const {signOut} = useContext(AuthContext);
  const {token} = useContext(UserContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [isInternet, setIsInternet] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [response, setResponse] = useState([]);
  const [checkModalVisible, setCheckModalVisible] = useState(false);
  const [skip, setSkip] = useState(0);
  const [deliverTo, setDeliverTo] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const mdTop = 300;
  const [modalTop, setModalTop] = useState(mdTop);
  Keyboard.addListener('keyboardDidShow', function () {
    setModalTop(100);
  });
  Keyboard.addListener('keyboardDidHide', function () {
    setModalTop(mdTop);
  });
  const loadData = () => {
    FetchApi('/User/CartList', token, {})
      .then(res => {
        if (res.status === 200) {
          res.json().then(result => {
            setResponse(result.cart);
            setAddresses(result.address);
            setSubTotal(result.subTotal);
            setDiscount(result.discount);
            setTotal(result.total);
          });
        } else if (res.status == 403) {
          signOut();
        } else {
          setIsInternet(false);
          setIsLoaded(false);
          setIsReadOnly(true);
          setIsEditing(false);
          setIsRefreshing(false);

          ToastAndroid.show('No Internet Connection.', ToastAndroid.SHORT);
        }
      })
      .catch(error => {
        console.log(error);
        setIsInternet(false);
        setIsLoaded(true);
        setIsReadOnly(true);
        setIsEditing(false);
        setIsRefreshing(false);
        ToastAndroid.show('No Internet Connection.', ToastAndroid.SHORT);
      })
      .finally(() => {
        setIsLoaded(true);
        setIsReadOnly(true);
        setIsEditing(false);
        setIsRefreshing(false);
        setSkip(10);
        setIsLoading(false)
      });
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      setIsClicked(true);
      loadData();
    });
    loadData();
  }, []);

  const loadMore = () => {
    FetchApi('/User/CartList?skip=' + skip, token, {})
      .then(res => {
        if (res.status == 200) {
          res.json().then(result => {
            if (result.cart.length != 0) {
              setResponse([...response, ...result.cart]);
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
        setIsRefreshing(false),
          ToastAndroid.show('No Internet Connection.', ToastAndroid.SHORT);
      })
      .finally(() => setIsLoaded(true));
  };

  const addQuantity = id => {
    FetchApi('/User/AddQuantity?id=' + id, token, {})
      .then(res => {
        console.log(res.status);
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
        } else if (res.status == 404) {
          setIsInternet(false);
          setIsLoaded(true);
          setIsClicked(false);
          setIsRefreshing(false);
        } else {
          setIsInternet(false);
          setIsLoaded(true);
          setIsClicked(false);
          setIsRefreshing(false),
            ToastAndroid.show('No Internet Connection.', ToastAndroid.SHORT);
        }
      })
      .catch(error => {
        setIsInternet(false);
        setIsLoaded(true);
        setIsClicked(false);
        setIsRefreshing(false),
          ToastAndroid.show('No Internet Connection.', ToastAndroid.SHORT);
      });
  };

  const removeQuantity = id => {
    FetchApi('/User/RemoveQuantity?id=' + id, token, {})
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
  const removeFromCart = id => {
    console.log(id);
    FetchApi('/User/RemoveFromCart?id=' + id, token, {})
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
  function CheckAvailibility() {
    response.forEach(item => {
      console.log('here');
      CheckAvalaibilityByPinCode(item.productId);
      console.log(isAvailable);
      if (isAvailable === false) {
        // stop();
      }
    });
  }
  const [pincode, setPincode] = useState('');
  const CheckAvalaibilityByPinCode = id => {
    console.log(id);
    if (pincode != 0) {
      setIsClicked(true);
      FetchApi(
        '/User/CheckAvalaibilityByPinCode?id=' + id + '&pinCode=' + pincode,
        token,
        {},
      )
        .then(res => {
          if (res.status == 200) {
            setCheckModalVisible(false);
            res.json().then(result => {
              console.log("here",result.isAvailable);
              setIsAvailable(result.isAvailable);
            });
            setTimeout(() => {
              setIsInternet(true);
              setIsLoaded(true);
              setIsClicked(false);
              setIsRefreshing(false);
              setIsAllLoaded(false);
            }, 1);
          } else if (res.status == 403) {
            signOut();
          } else {
            setIsInternet(false);
            setIsLoaded(true);
            setIsClicked(false);
            setIsRefreshing(false);
            setIsAllLoaded(false);
            ToastAndroid.show('No Internet Connection.', ToastAndroid.SHORT);
          }
        })
        .catch(error => {
          setIsInternet(true);
          setIsLoaded(true);
          setIsClicked(false);
          setIsRefreshing(false);
          setIsAllLoaded(true);

          ToastAndroid.show('No Internet Connection.', ToastAndroid.SHORT);
        });
    } else {
      ToastAndroid.show('Please enter pincode.', ToastAndroid.SHORT);
    }
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setIsLoaded(true);
    setIsClicked(false);

    loadData();
  }, []);

  const Item = ({item}) => (
    <View style={[styles.itemContainer]}>
      <View
        style={[
          styles.innerContainer,
          {flexDirection: 'row', justifyContent: 'space-between'},
        ]}>
        <View style={{}}>
          <Title style={{width: 250}}>{item.products.name}</Title>
          <View
            style={{flexDirection: 'row', paddingTop: 8, alignItems: 'center'}}>
            <Text>₹ {item.products.price} </Text>
            <Text style={{textDecorationLine: 'line-through', color: 'gray'}}>
              ₹ {item.products.mrp}
            </Text>
            <Text style={{color: 'green'}}>
              {' '}
              {(
                ((item.products.mrp - item.products.price) /
                  item.products.mrp) *
                100
              ).toFixed(0)}{' '}
              % off
            </Text>
          </View>
          <Text style={{width: 200, paddingTop: 8}}>
            Description: {item.products.description}
          </Text>
        </View>
        <View>
          <Image
            resizeMode="stretch"
            style={{width: 80, height: 80}}
            source={{uri: item.products.imageUrl}}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              disabled={item.min}
              onPress={() => removeQuantity(item.id)}
              style={{padding: 10}}>
              {item.min == false ? (
                <Icon name="minus" color="red" />
              ) : (
                <Icon color="gray" name="minus" />
              )}
            </TouchableOpacity>
            <Text>Qty {item.quantity}</Text>
            <TouchableOpacity
              disabled={item.max}
              onPress={() => addQuantity(item.id)}
              style={{padding: 10}}>
              {item.max == false ? (
                <Icon name="plus" color="green" />
              ) : (
                <Icon color="gray" name="plus" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          borderTopColor: 'gray',
          borderTopWidth: 1,
        }}>
        <View
          onPress={() => navigation.navigate('Home')}
          style={styles.addToCartBtn}>
          {/* <Text style={styles.addToCartTxt}>Add More</Text> */}
        </View>
        <TouchableOpacity
          onPress={() => removeFromCart(item.id)}
          style={styles.buyNowBtn}>
          <Text style={styles.buyNowTxt}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  const renderItem = ({item}) => <Item item={item} />;

  const AddressItem = ({item}) => (
    <TouchableOpacity
      key={item.id}
      style={{marginLeft: 5, padding: 10}}
      onPress={() => {
        SetAddress(item.id), setAddressId(item.id);
      }}>
      <RadioButton.Group
        onValueChange={newValue => setAddressId(newValue)}
        value={addressId}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <RadioButton value={item.id} />
          <View
            style={[
              styles.innerContainer,
              {
                paddingBottom: 10,
                marginBottom: 10,
                elevation: 1,
                borderColor: 'gray',
              },
            ]}>
            <Title>{item.fullName}</Title>
            <Text style={{width: width - 80}}>
              {item.area}, {item.city}, {item}, {item.landmark} - {item.pinCode}
            </Text>
            <Text>{item.phoneNumber}</Text>
          </View>
        </View>
      </RadioButton.Group>
    </TouchableOpacity>
  );
  const renderAddressItem = ({item}) => <AddressItem item={item} />;

  function CheckOut() {
    setIsClicked(true);
    FetchApi('/Payment/InitiatePayment', token, {})
      .then(res => {
        if (res.status == 200) {
          setIsClicked(true);
          res
            .json()
            .then(result => {
              var options = {
                description: 'Paying to Quick App',
                image: 'https://quickapptechnologies.in/favicon.ico',
                currency: result.currency,
                key: result.razorpayKey,
                amount: result.amount,
                name: 'Quick App Technologies',
                order_id: result.orderId, //Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
                prefill: {
                  email: result.email,
                  contact: result.contactNumber,
                  name: result.name,
                },
                theme: {color: green},
              };
              RazorpayCheckout.open(options).then(data => {
                // handle success
                console.log(data);
                FetchApi(
                  '/Payment/Complete?paymentId=' +
                    data.razorpay_payment_id +
                    '&orderId=' +
                    data.razorpay_order_id,
                  token,
                  {},
                )
                  .then(res => {
                    console.log(res.status)
                    if (res.status == 200) {
                      Alert.alert('Payment Success');
                    } else if (res.status == 403) {
                      Alert.alert('Please login before booking');
                      signOut();
                    } else if (res.status == 401) {
                      res.json().then(result => {
                        console.log(result);
                      });
                      setIsClicked(false);
                      Alert.alert('Payment Failed');
                    } else {
                      setIsClicked(false);
                      ToastAndroid.show(
                        'Something went wrong',
                        ToastAndroid.SHORT,
                      );
                    }
                  })
                  .catch(error => {
                    setIsInternet(false);
                  });
              });
            })
            .catch(error => {
              console.log(error);
              // handle failure
              setIsClicked(false);
              Alert.alert('Payment Request Cancelled');
            });
        } else if (res.status == 403) {
          Alert.alert('Please login before booking');
          signOut();
        } else {
          res.json().then(result => {
            console.log(result);
          });
          ToastAndroid.show(
            'Something went wrong, try again',
            ToastAndroid.SHORT,
          );
          setIsClicked(false);
        }
      })
      .catch(error => {
        setIsInternet(false);
        setIsClicked(false);
      });
  }

  return (
    <>
    {/* <Loader modalVisible={isLoading} /> */}
      <SafeAreaView style={styles.container}>
      
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={response}
          keyExtractor={itm => itm.id}
          renderItem={renderItem}
          onEndReached={loadMore}
          onEndReachedThreshold={0.2}
          ListHeaderComponent={() => (
            <View style={styles.checkContainer}>
              {deliverTo != null ? (
                <>
                  <Text
                    numberOfLines={2}
                    style={[styles.checkTxt, {width: 250}]}>
                    Deliver To: {deliverTo.fullName}, {deliverTo.area},{' '}
                    {deliverTo.city}... {deliverTo.pinCode}
                  </Text>
                  <TouchableWithoutFeedback
                    onPress={() => setCheckModalVisible(true)}>
                    <View style={styles.checkBtn}>
                      <Text style={styles.checkBtnTxt}>Change</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </>
              ) : (
                <>
                  
                  <Text style={styles.checkTxt}>
                    Find a seller that delivers to you
                  </Text>
                  <TouchableWithoutFeedback
                    onPress={() => setCheckModalVisible(true)}>
                    <View style={styles.checkBtn}>
                      <Text style={styles.checkBtnTxt}>Enter Pincode</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </>
              )}
            </View>
          )}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                height: height / 2,
                alignItems: 'center',
                // alignContent:'center'
              }}>
              <Image
                source={require('../assets/images/emptyCart.png')}
                style={{height: 150}}
                resizeMode={'contain'}
              />
              <Title>Your cart is empty !</Title>
              <Button
                title="Shop Now"
                color={green}
                onPress={() => navigation.navigate('Home')}
              />
            </View>
          )}
          ListFooterComponent={() =>
            response.length != 0 ? (
              <>
                <View style={{padding: 5}}>
                  <Title>Price Details</Title>
                  <View style={[styles.table, {marginBottom: 50}]}>
                    <View style={styles.trfirst}>
                      <Text style={styles.td}>Price ({response.length})</Text>
                      <Text style={styles.tdRight}>₹ {subTotal}</Text>
                    </View>
                    <View style={styles.tr}>
                      <Text style={styles.td}>Discount</Text>
                      <Text style={[styles.tdRight, {color: 'green'}]}>
                        - ₹ {discount}
                      </Text>
                    </View>
                    <View style={styles.tr}>
                      <Text style={styles.td}>Delivery Charge</Text>
                      <Text style={styles.tdRight}>{}</Text>
                    </View>
                    <View style={styles.tr}>
                      <Text style={[styles.td, {fontWeight: 'bold'}]}>
                        Total Amount
                      </Text>
                      <Text style={[styles.tdRight, {fontWeight: 'bold'}]}>
                        ₹ {total}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
        <View style={styles.footerBtnContainer}>
          <View
            onPress={() => navigation.navigate('Cart')}
            style={styles.addToCartBtn}>
            <Text style={styles.addToCartTxt}>₹ {total} /-</Text>
          </View>
          <TouchableOpacity style={styles.buyNowBtn} onPress={() => CheckOut()}>
            <Text style={styles.buyNowTxt}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <Modal animationType="slide" transparent visible={checkModalVisible}>
      
        <Pressable
          onPress={() => setCheckModalVisible(false)}
          style={styles.modalViewContainer}>
          <Pressable style={[styles.modalHeight, {top: modalTop}]}>
            <Animatable.View animation="fadeInUp" easing="ease-in" duration={5}>
              <View style={styles.modalView}>
                <View style={styles.modalHeader}>
                  <Text style={{fontSize: 20}}>Select Delivery Address</Text>
                  <Pressable
                    style={{}}
                    onPress={() => setCheckModalVisible(!checkModalVisible)}>
                    <Icons name="close" size={25} />
                  </Pressable>
                </View>
                <Pressable
          style={{}}
          onPress={() => navigation.navigate('AddAddress')}
          style={styles.modalHeader}>
          <Icon name="plus" color={green} size={20} />
          <Text style={{marginLeft: 5, fontSize: 20, color: green}}>
            Add a new address
          </Text>
        </Pressable>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  data={addresses}
                  keyExtractor={itm => itm.id}
                  renderItem={renderAddressItem}
                  // onEndReached={loadMoreAddress}
                  // onEndReachedThreshold={0.2}
                />
                <View style={{width: width, marginTop: 20}}>
                  {deliverTo == null ? (
                    <Text
                      style={{
                        color: 'red',
                        textAlign: 'center',
                        marginBottom: 30,
                      }}>
                      No Address
                    </Text>
                  ) : null}
                  <View
                    style={[
                      styles.checkContainer,
                      {
                        justifyContent: 'center',
                        paddingHorizontal: 10,
                        marginTop: 5,
                        alignItems: 'center',
                      },
                    ]}>
                    <TextInput
                      value={pincode}
                      keyboardType="numeric"
                      style={[
                        styles.checkTxt,
                        {
                          borderColor: 'gray',
                          borderWidth: 1,
                          paddingHorizontal: 5,
                          width: '40%',
                        },
                      ]}
                      onChangeText={val => setPincode(val)}
                      placeholder="Pin Code"
                    />
                    <TouchableWithoutFeedback
                      onPress={() => {
                        CheckAvailibility();
                      }}>
                      <View style={[styles.checkBtn, {padding: 5}]}>
                        <Text style={styles.checkBtnTxt}>Submit</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </View>
            </Animatable.View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default Address;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  itemContainer: {
    padding: 10,
    paddingBottom: 0,
    paddingHorizontal: 0,
    marginBottom: 10,
    elevation: 2,
    borderBottomColor: 'gray',
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
    color: black,
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

  footerBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    elevation: 5,
  },
  addToCartBtn: {
    padding: 10,
    alignItems: 'center',
    width: '50%',
  },
  addToCartTxt: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  buyNowBtn: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: green,
    width: '50%',
  },
  buyNowTxt: {
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
  },

  table: {
    marginTop: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 3,
  },
  trfirst: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: 'gray',
    borderTopWidth: 1,
  },
  td: {
    padding: 5,
  },
  tdRight: {
    padding: 5,
  },

  modalViewContainer: {
    backgroundColor: '#0a0a0a8f',
    flex: 1,
  },
  modalHeight: {
    height: height - 300,
    backgroundColor: 'white',
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    padding: 10,
    elevation: 0.8,
    borderColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
});
