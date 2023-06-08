import React from 'react';
import {View, Text} from 'react-native';
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';
import DrawerNavigation from './DrawerNavigation';
import Order from '../screens/Order';
import Wishlist from '../screens/Wishlist';
import EditProfile from '../screens/EditProfile';
import Profile from '../screens/Profile';
import {green,black,white} from '../assets/settings/color.json';
import Address from '../screens/Address';
import AddAddress from '../screens/AddAddress';
import Notification from '../screens/Notification';
import OrderDetails from '../screens/OrderDetails';
import ProductDetails from '../screens/ProductDetails';
import SubCategories from '../screens/SubCategories';
import SubSubCategories from '../screens/SubSubCategories';
import Product from '../screens/Product'
import Setting from '../screens/Setting';
import ProductList from '../screens/ProductList';
import Cart from '../screens/Cart'
import Shop from '../screens/Shop';

const Stack = createStackNavigator();
export default function MainStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={DrawerNavigation}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Order" component={Order} />
      <Stack.Screen name="Wishlist" component={Wishlist} />
      <Stack.Screen name="Address" component={Address} options={{title:'My-Addresses'}} />
      <Stack.Screen name="AddAddress" component={AddAddress}  options={{title:'Add New Address'}}/>
      <Stack.Screen name="Notification" component={Notification}/>
      <Stack.Screen name="OrderDetails" component={OrderDetails}/>
      <Stack.Screen name="ProductDetails" component={ProductDetails} options={{title:''}}/>
      <Stack.Screen name="Shop" component={Shop} options={{title:'All Categories'}}/>
      <Stack.Screen name="Setting" component={Setting} options={{title:'Account Setting'}}/>
      <Stack.Screen name="Cart" component={Cart} options={{title:'My-Cart'}}/>
      <Stack.Screen name="SubCategories" component={SubCategories}
    //     options={{
    //   elevation:0,
    // }}
    />
     <Stack.Screen name="SubSubCategories" component={SubSubCategories}/>
    
      <Stack.Screen name="Product" component={Product}  options={{title: '',  headerStyle: {
      elevation:0,
    },}}/>
     <Stack.Screen name="ProductList" component={ProductList}  options={{title: '',  headerStyle: {
      elevation:0,
    },}}/>
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{title: 'Update Profile',  headerStyle: {
      backgroundColor:green,
      elevation:0
    }, headerTintColor: white}}
      />
    </Stack.Navigator>
  );
}
