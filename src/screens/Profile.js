import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import {Avatar, Title, Caption} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import {yellow} from '../assets/settings/color.json';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {FetchApi} from '../assets/settings/FetchApi';
import {UserContext, TitleContext} from '../assets/settings/context';
import {useFocusEffect} from '@react-navigation/core';
import { black, yellow100 } from 'react-native-paper/lib/typescript/styles/colors';
import { color } from 'react-native-reanimated';
const width = Dimensions.get('screen').width;
const Profile = ({navigation}) => {
  const {token} = useContext(UserContext);
  const {setScreenTitle} = useContext(TitleContext);
  const [data, setData] = useState([]);
  const [showModel, setShowModel] = useState(false);

  const getProfile = () => {
    FetchApi('/Account/GetProfileSettings', token, {})
      .then(res => {
        if (res.status === 200) {
          res.json().then(result => {
            setData(result);
          });
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {});
  };
  useFocusEffect(
    React.useCallback(() => {
      getProfile();
      return () => null;
    }, []),
  );
  useEffect(() => {
    getProfile();
    setScreenTitle('Profile');
    const unsubscribe = navigation.addListener('tabPress', e => {
      setScreenTitle('Account Details');
    });
    return unsubscribe;
  }, []);
  return (
    <ScrollView contentContainerStyle={Styles.container} showsVerticalScrollIndicator={false}>
      <View style={Styles.profileView}>
        <View style={Styles.imgContainer}>
          {data.imageUrl != null ? (
            <Avatar.Image source={{uri: data.imageUrl}} size={100} />
          ) : (
            <Avatar.Text
              backgroundColor={yellow}
              label={data.fullName ? data.fullName.substring(0, 1) : null}
              size={100}
            />
          )}
        </View>
        <View style={{flexDirection: 'row', marginBottom: 10}}>
          <View style={Styles.userinfoContainer}>
            <Title>{data.fullName}</Title>
            <Text style={{color:'gray'}}>{data.userName}</Text>
          </View>
          <View style={Styles.profileicon}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}>
              <Text>
                <Icon name="account-edit" color={'black'} size={30} />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={Styles.horizontalBar}>
        <TouchableOpacity onPress={()=>navigation.navigate('Order')}>
          <View style={Styles.tabs}>
            <Text>
              <FontAwesome name="list" size={13}  />
            </Text>
            <Text style={Styles.tabsText}>Orders</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Notification')}>
          <View style={Styles.tabs}>
            <Text>
              <FontAwesome name="bell-o" size={15} />
            </Text>
            <Text style={Styles.tabsText}>Notifications</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Setting')}>
          <View style={[Styles.tabs, {borderRightWidth: 0}]}>
            <Text>
              <Icon name="account-settings-outline" size={15} />
            </Text>
            <Text style={Styles.tabsText}>Setting</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={()=>navigation.navigate('Wishlist')}>
        <View style={Styles.listitems}>
          <Text>Wishlist</Text>
          <Icon name="chevron-right" color="gray" size={20} />
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Cart')}>
        <View style={Styles.listitems}>
          <Text>Cart</Text>
          <Text>
            <Icon name="chevron-right" color="gray" size={20} />
          </Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Address')}>
        <View style={Styles.listitems}>
          <Text> Address</Text>
          <Text>
            <Icon name="chevron-right" color="gray" size={20} />
          </Text>
        </View>
        </TouchableOpacity>
        <View style={Styles.listitems}>
          <Text>Payment-Method</Text>
          <Icon name="chevron-right" color="gray" size={20} />
        </View>
      </View>
      <Modal visible={showModel}>
        <View>
          <Text>Modal view</Text>
          <Button
            title={'Back'}
            onPress={() => {
              setShowModel(false);
            }}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Profile;

const Styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    width: width,
  },
  profileView: {
    borderBottomWidth: 1,
  },
  imgContainer: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  userinfoContainer: {
    justifyContent: 'center',
  },
  profileicon: {
    alignContent: 'flex-end',
    marginLeft: 'auto',
    justifyContent: 'flex-end',
  },
  tabs: {
    flexDirection: 'row',
    borderRightWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  horizontalBar: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    // width:width,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabsText: {
    paddingHorizontal: 10,
  },
  listitems: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
