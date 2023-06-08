import React, {useContext} from 'react';
import {View, Text, Button, Image} from 'react-native';
import {AuthContext} from '../assets/settings/context';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Profile from '../screens/Profile';
import Wishlist from '../screens/Wishlist';
import Cart from '../screens/Cart';
import Shop from '../screens/Shop';
import {
  colorone,
  white,
  black,
  green,
  yellow,
  grey,
} from '../assets/settings/color.json';
import Home from '../screens/Home';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Notification from '../screens/Notification';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Tab = createMaterialBottomTabNavigator();

const TabNavigation = ({navigation}) => {
  const {signOut} = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={{tabBarColor: 'transparent'}}
      activeColor={black}
      inactiveColor={grey}
      initialRouteName={'Home'}
      labeled={false}
      barStyle={{
        justifyContent: 'flex-end',
        paddingVertical: 3,
        height: 70,
        elevation: 0,
        backgroundColor: 'transparent',
      }}>
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Account',
          // tabBarIcon: ({color}) => (
          //   <Icon name="account" color={color} size={26} />
          // ),
          tabBarIcon: () => (
            <Image
              name="Profile"
              source={require('../assets/images/tabBarAccountIcon.png')}
              style={{height: 40, width: 40}}
              resizeMode={'contain'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Shop"
        component={Shop}
        options={{
          tabBarLabel: 'Categories',
          // tabBarIcon: ({color}) => (
          //   <MaterialIcons name="category" color={color} size={26} />
          // ),
          tabBarIcon: () => (
            <Image
              name="Shop"
              source={require('../assets/images/tabBarSearchIcon.png')}
              style={{height: 30, width: 30}}
              resizeMode={'contain'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarColor: 'transparent',
          // tabBarIcon: ({color}) => <Icon name="home" color={color} size={26} />,
          tabBarIcon: () => (
            <Image
              name="home"
              source={require('../assets/images/tabBarHomeIcon.png')}
              style={{height: 40, width: 40}}
              resizeMode={'contain'}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Wishlist"
        component={Wishlist}
        options={{
          tabBarLabel: 'Wishlist',
          // tabBarIcon: ({color}) => (
          //   <FontAwesome name="heart" color={color} size={24} />
          // ),
          tabBarIcon: () => (
            <Image
              name="Wishlist"
              source={require('../assets/images/tabBarWishlistIcon.png')}
              style={{height: 30, width: 30}}
              resizeMode={'contain'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          tabBarLabel: 'Notifications',
          tabBarColor: white,
          tabBarBadge:2,
          tabBarIcon: ({color}) => (
            <FontAwesome name="bell" color={'black'} size={26} />
          ),
          // tabBarIcon: () => (
          //   <Image
          //     name="Notifications"
          //     source={require('../assets/images/tabBarNotificationIcon.png')}
          //     style={{height: 40, width: 40}}
          //     resizeMode={'contain'}
          //   />
          // ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
