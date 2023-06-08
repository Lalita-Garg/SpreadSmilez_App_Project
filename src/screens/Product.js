import React, {useContext, useEffect, useState} from 'react';
import {Image, StyleSheet, View, FlatList, Pressable} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {UserContext, TitleContext} from '../assets/settings/context';
import {FetchApi} from '../assets/settings/FetchApi';
import {Dimensions} from 'react-native';
import {Title, Caption, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {black} from 'react-native-paper/lib/typescript/styles/colors';

const cardWidth = Dimensions.get('window').width / 2;
const cardHight = Dimensions.get('screen').height / 2.5;

const Notification = ({navigation}) => {
  const {token} = useContext(UserContext);
  const {setScreenTitle} = useContext(TitleContext);
  const [data, setData] = useState([]);
  const [subcate, setSubCate] = useState([]);
  const [addWishlist, setAddWishlist] = useState([]);

  const DATA = [
    {
      id: '1',
      title: 'product 1',
      Description: 'Lorem ipsum dolor sit',
      Price: 30,
      Discount: 50,
      OldPrice: 60,
    },
    {
      id: '2',
      title: 'Product2',
      Description: 'Lorem ipsum dolor sit amet',
      Price: 30,
      Discount: 50,
      OldPrice: 60,
    },
    {
      id: '3',
      title: 'Product 3',
      Description: 'Lorem ipsum dolor sit amet',
      Price: 30,
      Discount: 50,
      OldPrice: 60,
    },
    {
      id: '4',
      title: 'Product 3',
      Description: 'Lorem ipsum dolor sit amet',
      Price: 30,
      Discount: 50,
      OldPrice: 60,
    },
    {
      id: '5',
      title: 'Product 3',
      Description: 'Lorem ipsum dolor sit amet',
      Price: 30,
      Discount: 50,
      OldPrice: 60,
    },
    {
      id: '6',
      title: 'Product 3',
      Description: 'Lorem ipsum dolor sit amet',
      Price: 30,
      Discount: 50,
      OldPrice: 60,
    },
    {
      id: '7',
      title: 'Product 3',
      Description: 'Lorem ipsum dolor sit amet',
      Price: 30,
      Discount: 50,
      OldPrice: 60,
    },
    {
      id: '8',
      title: 'Product 3',
      Description: 'Lorem ipsum dolor sit amet',
      Price: 30,
      Discount: 50,
      OldPrice: 60,
    },
  ];

  const AddToWishlist = id => {
    setAddWishlist([...addWishlist, id]);
  };

  const removeToWishlist = id => {
    var a = [];
    var i = addWishlist.indexOf(id);
    addWishlist.map((item, index) => {
      if (index != i) {
        a.push(item);
      }
    });
    setAddWishlist(a);
  };

  const Item = ({item}) => (
    <Pressable onPress={()=>{navigation.navigate('ProductDetails')}}>
    <View>
      <View style={styles.listItem}>
        <View>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            }}
            style={{height: cardHight / 2}}
            resizeMode="cover"
          />
        </View>
        <View style={styles.txtContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 18}}>{item.title}</Text>
            {addWishlist.indexOf(item.id) != -1 ? (
              <Pressable
                onPress={() => removeToWishlist(item.id)}
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="heart" size={18} color={'red'} />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => AddToWishlist(item.id)}
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="heart-o" size={18} />
              </Pressable>
            )}
          </View>
          <Caption>{item.Description}</Caption>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: 'gray',
                paddingRight: 5,
                textDecorationLine: 'line-through',
              }}>
              {item.OldPrice}
            </Text>
            <Text style={{paddingRight: 5}}>Rs{item.Price}</Text>
            <Text style={{color: 'green'}}>{item.Discount}%Off</Text>
          </View>
          <View>
              {/* <Text>Add To Wishlist</Text> */}
          </View>
        </View>
      </View>
    </View>
    </Pressable>
  );

  const renderItem = ({item}) => <Item item={item} />;

  return (
    <View styles={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns="2"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  listItem: {
    borderColor: 'lightgray',
    borderWidth: 0.5,
    height: cardHight,
    width: cardWidth,
    // backgroundColor:'lightgray's,
  },
  txtContainer: {
    padding: 10,
  },
});

export default Notification;
