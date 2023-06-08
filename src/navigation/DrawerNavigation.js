import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Image, Button} from 'react-native';
import { StatusBar } from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import DrawerContent from '../screens/DrawerContent';
import TabNavigation from './TabNavigation';
import {green} from '../assets/settings/color.json';
import Cart from '../screens/Cart';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import {TitleContext} from '../assets/settings/context';
import {useNavigation} from '@react-navigation/core';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {FetchApi} from '../assets/settings/FetchApi';
import {AuthContext, UserContext} from '../assets/settings/context';

const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {
  const {token} = useContext(UserContext);
  const navigation = useNavigation();
  const {screenTitle, setScreenTitle} = useContext(TitleContext);
  const [isCartEmpty, setIsCartEmpty] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);
  const loadData = () => {
    FetchApi('/User/CartList', token, {})
      .then(res => {
        if (res.status === 200) {
          res.json().then(result => {
            if (result.cart.length != 0) {
              setCartItemCount(result.cart.length);
              setIsCartEmpty(false);
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={({navigation}) => ({
        headerTitleAlign: 'center',
        headerLeft: () => (
          <TouchableWithoutFeedback
            onPress={() => navigation.openDrawer()}
            style={{marginLeft: 4}}>
            <Image
              source={require('../assets/images/drawerIcon.png')}
              style={{height: 35, width: 35}}
              resizeMode={'contain'}
            />
          </TouchableWithoutFeedback>
        ),
      })}>
      <Drawer.Screen
        name="TabNavigation"
        component={TabNavigation}
        options={{
          headerTitle: () => (
            <Image
              source={require('../assets/images/logo2.png')}
              style={{height: 30, width: 200}}
            />
          ),
          headerRight: () => (
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.navigate('Cart');
                setScreenTitle('Cart');
              }}
              style={{paddingRight: 10}}>
              <Image
                source={
                  isCartEmpty
                    ? require('../assets/images/cartLogo.png')
                    : require('../assets/images/fullCartLogo.png')
                }
                style={{height: 33, width: 33}}
                resizeMode={'contain'}
              />
              {cartItemCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    right: 3,
                    padding: 2,
                    top: -5,
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      margin: 'auto',
                    }}>
                    {cartItemCount}
                  </Text>
                </View>
              )}
            </TouchableWithoutFeedback>
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
('');
