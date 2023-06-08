import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import {SliderBox} from 'react-native-image-slider-box';
import {Title} from 'react-native-paper';
import {FetchApi} from '../assets/settings/FetchApi';
import {AuthContext, UserContext} from '../assets/settings/context';
import {green, yellow} from '../assets/settings/color.json';
import {ScrollView} from 'react-native-gesture-handler';
import Loader, {WaitLoader} from '../assets/settings/Loader';

const ProductDetails = ({route,navigation}) => {
  const {token} = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState([]);
  const [isAddToCart, setIsAddToCart] = useState(true);
  const [isClicked,setIsClicked] = useState(false)

  const getProduct = () => {
    setIsLoading(true);
    FetchApi('/User/ProductById?id=' + route.params.id, token, {})
      .then(res => {
        // console.log(res.status);
        if (res.status === 200) {
          res.json().then(result => {
            setProduct(result.product);
          });
        } else {
          console.log(res);
          setIsLoading(true);
        }
      })
      .catch(error => {
        console.log(error);
        setIsLoading(true);
      })
      .finally(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 1);
      });
  };

  const addToCart = () => {
    FetchApi('/User/AddToCart?id=' + route.params.id, token, {})
      .then(res => {
        // console.log(res.status);
        if (res.status === 200) {
          ToastAndroid.show('Product Added To Cart', ToastAndroid.SHORT);
          getProduct();
        } else {
          console.log(res);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {});
  };

  const removeFromCart = id => {
    // console.log(id);
    FetchApi('/User/RemoveFromCart?id=' + id, token, {})
      .then(res => {
        // console.log(res.status);
        if (res.status == 200) {
          ToastAndroid.show('Product Removed From Cart', ToastAndroid.SHORT);
          getProduct();
        }
      })
      .catch(error => {
        ToastAndroid.show('No Internet Connection.', ToastAndroid.SHORT);
      });
  };

  const buyNow = () =>{
    {product.isInCart===true?(null):(addToCart())}
    navigation.navigate('Cart')
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <>
      <Loader isLoading={isLoading}/>
      <ScrollView>
        <View>
          {product.imageUrls != null ? (
            <SliderBox
              autoplay
              circleLoop
              resizeMode={'stretch'}
              sliderBoxHeight={400}
              images={product.imageUrls}
              onCurrentImagePressed={() => {}}
            />
          ) : null}
          <View style={{padding: 15}}>
            <Title>{product.name}</Title>
            <Text style={{color: 'gray'}}>{product.description}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Title>{product.price}</Title>
              <Text style={{paddingHorizontal: 10, color: 'green'}}>
                {(((product.mrp - product.price) / product.mrp) * 100).toFixed(
                  0,
                )}
                % off
              </Text>
              <Text
                style={{
                  color: 'gray',
                  paddingRight: 5,
                  textDecorationLine: 'line-through',
                }}>
                {product.mrp}
              </Text>
            </View>
            <Text>Free Delivery</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footerBtnContainer}>
        {product.isInCart === false ? (
          <TouchableOpacity
            onPress={() => addToCart()}
            style={styles.addToCartBtn}>
            <Text style={styles.addToCartTxt}> Add to Cart /-</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => removeFromCart(product.cartId)}
            style={styles.addToCartBtn}>
            <Text style={styles.addToCartTxt}> Remove from Cart</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.buyNowBtn} onPress={() => buyNow()}>
          <Text style={styles.buyNowTxt}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  footerBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    elevation: 3,
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
});

export default ProductDetails;
