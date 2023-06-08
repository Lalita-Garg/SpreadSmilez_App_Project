import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Pressable} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext, TitleContext} from '../assets/settings/context';
import {
  colorone,
  yellow,
  green,
  black,
  white,
  grey,
} from '../assets/settings/color.json';
import {FetchApi} from '../assets/settings/FetchApi';
import {UserContext} from '../assets/settings/context';
import {Avatar, Title, Caption, Drawer,Text} from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/core';

const DrawerContent = props => {
  const {signOut} = useContext(AuthContext);
  const {setScreenTitle} = useContext(TitleContext);
  const {token} = useContext(UserContext);
  const [data, setData] = useState('');
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
  useEffect(() => {
    getProfile();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getProfile();
      return () => null;
    }, []),
  );

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
        <Drawer.Section>
          <Pressable
            onPress={() => {
              props.navigation.navigate('Profile');
              setScreenTitle('Profile');
            }}>
            <View style={styles.profileContainer}>
              <View style={{flexDirection: 'row'}}>
              {data.imageUrl != null ? (
            <Avatar.Image source={{uri: data.imageUrl}}/>
          ) : (
            <Avatar.Text
              backgroundColor={'gray'}
              label={data.fullName ? data.fullName.substring(0, 1) : null}
            />
          )}
                {/* <Avatar.Image source={{uri: data.imageUrl}} /> */}
                <View style={{paddingHorizontal: 15}}>
                  <Title style={styles.title}>{data.fullName} </Title>
                  <Text style={styles.title}>{data.userName}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        </Drawer.Section>

        <View style={styles.ItemsContainer}>
          <View>
            {/* <DrawerItem
              icon={({color, size}) => (
                <FontAwesome name="home" color={grey} size={size} />
              )}
              to="Home"
              label="Home"
              onPress={() => props.navigation.navigate('Home')}
            /> */}
             <DrawerItem
              icon={({color, size}) => (
                <MaterialIcons name="category" color={color} size={size} />
              )}
              to="Shop"
              label="All Categories"
              onPress={() => {
                props.navigation.navigate('Shop');
                setScreenTitle('All Categories');
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <FontAwesome name="list" size={size} color={color} />
              )}
              to="Order"
              label="My Orders"
              onPress={() => props.navigation.navigate('Order')}
            />
            <DrawerItem
              icon={({color, size}) => (
                <FontAwesome name="heart" size={size} color={color} />
              )}
              to="Wishlist"
              label="My Wishlist"
              onPress={() => props.navigation.navigate('Wishlist')}
            />
            <DrawerItem
              icon={({color, size}) => (
                <FontAwesome name="shopping-cart" size={size} color={color} />
              )}
              to="Cart"
              label="My Cart"
              onPress={() => {
                props.navigation.navigate('Cart');
                setScreenTitle('Cart');
              }}
            />
            <DrawerItem
             icon={({ color, size }) => (
              <Icon name="map-marker"
                  color={color}
                  size={size} />
          )}
              to="Address"
              label="My Addresses"
              onPress={() => {
                props.navigation.navigate('Address');
                // setScreenTitle('');
              }}
            />
           
             <DrawerItem
              icon={({color, size}) => (
                <MaterialIcons name="privacy-tip" color={color} size={size} />
              )}
              // to="Shop"
              label="Terms And Conditions"
              // onPress={() => {
              //   props.navigation.navigate('Shop');
              //   setScreenTitle('All Categories');
              // }}
            />
          </View>
          <View style={styles.bottomDrawerSection}>
            <Drawer.Section>
              <DrawerItem
                icon={({color, size}) => (
                  <FontAwesome name="sign-out" color={color} size={size} />
                )}
                label="Sign Out"
                onPress={() => {
                  signOut();
                }}
              />
            </Drawer.Section>
          </View>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingRight: 0,
    paddingBottom: 0,
    backgroundColor: yellow,
  },
  profileContainer: {
    paddingVertical: 20,
    // alignContent: 'center',
    // justifyContent: 'center',
  },
  title: {
    color: black,
  },
  ItemsContainer: {
    backgroundColor: white,
    borderTopLeftRadius: 10,
    height: Dimensions.get('screen').height - 130,
    justifyContent: 'space-between',
  },
  bottomDrawerSection: {
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
});

export default DrawerContent;
