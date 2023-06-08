import React, {useContext, useEffect, useState} from 'react';
import {Image, StyleSheet, View, FlatList, Pressable} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {UserContext, TitleContext} from '../assets/settings/context';
import {FetchApi} from '../assets/settings/FetchApi';
import {Dimensions} from 'react-native';
import {Title, Caption, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {black} from 'react-native-paper/lib/typescript/styles/colors';

const Width = Dimensions.get('window').width;
const cardHight = Dimensions.get('screen').height / 3;

const ProductList = ({navigation, route}) => {
  const {token} = useContext(UserContext);
  const {setScreenTitle} = useContext(TitleContext);
  const [data, setData] = useState([]);
  const [subcate, setSubCate] = useState([]);
  const [addWishlist, setAddWishlist] = useState([]);
  const [products, setProducts] = useState([]);

  const getProducts = () => {
    FetchApi('/User/ProductListByCategoryId?id=' + route.params.id, token, {})
      .then(res => {
        if (res.status === 200) {
          res.json().then(result => {
            setProducts(result.products);
          });
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {});
  };

  useEffect(() => {
    getProducts();
  }, []);

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
    <Pressable
      onPress={() => {
        navigation.navigate('ProductDetails', {id: item.id});
      }}>
      <View>
        <View style={styles.listItem}>
          <View>
            <Image
              source={{
                uri: item.imageUrl,
              }}
              style={{height: cardHight, width: Width / 3}}
              resizeMode="contain"
            />
          </View>
          <View style={styles.txtContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 18, textAlign: 'left'}} numberOfLines={2}>
                {item.name}
              </Text>
              {/* <View>
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
              </View> */}
            </View>
            <Caption>{item.description}</Caption>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Title style={{paddingRight: 5}}>₹{item.price}</Title>
              <Text
                style={{
                  color: 'gray',
                  paddingRight: 5,
                  textDecorationLine: 'line-through',
                }}>
                {item.mrp}
              </Text>
              <Text style={{ color: 'green'}}>
            {(((item.mrp - item.price) / item.mrp) * 100).toFixed(0)}%
            off
          </Text>
            </View>
            {item.shipping === 0 ? <Text>Free Delivery</Text> : null}
          </View>
        </View>
      </View>
    </Pressable>
  );

  const renderItem = ({item}) => <Item item={item} />;

  return (
    <View styles={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: Width,
  },
  listItem: {
    borderColor: 'lightgray',
    borderWidth: 0.5,
    height: cardHight,
    flexDirection: 'row',
    marginVertical: 5,
  },
  txtContainer: {
    padding: 10,
    width: Width - Width / 3 - 30,
  },
});

export default ProductList;
