import React from 'react';
import {Image, View, Text, Pressable,StyleSheet} from 'react-native';

const ProductItem = () => {

  return (
    <Pressable  style={styles.root}>
      <Image style={styles.image} source={require('../assets/images/ecommerce.png')} />
      <View style={styles.rightContainer}>
        <Text style={styles.title} numberOfLines={3}>
          Product Name Comes Here
        </Text>

        <Text style={styles.price}>
         Rs 0000 
            <Text style={styles.oldPrice}>  Rs 0000 </Text>
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
    root: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: '#d1d1d1',
      borderRadius: 10,
      backgroundColor: '#fff',
      marginVertical: 5,
    },
    image: {
      flex: 2,
      height: 150,
      resizeMode: 'contain',
    },
    rightContainer: {
      padding: 10,
      flex: 3,
    },
    title: {
      fontSize: 18,
    },
    price: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    oldPrice: {
      fontSize: 12,
      fontWeight: 'normal',
      textDecorationLine: 'line-through',
    },
    ratingsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 5,
    },
    star: {
      margin: 2,
    },
  });

export default ProductItem;