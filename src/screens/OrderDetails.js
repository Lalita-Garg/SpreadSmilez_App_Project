import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Title, Caption, Text} from 'react-native-paper';

const OrderDetails = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Caption>Order ID - 1234567890</Caption>
        <View style={styles.productDetails}>
          <View>
            <Title>realme Nazaro 20</Title>
            <Caption>seller:aaaaaa</Caption>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Title>Rs 14,999</Title>
              <Text style={{paddingHorizontal: 10, color: 'green'}}>
                2 offers
              </Text>
            </View>
          </View>
          <View>
            <Image
              source={{
                uri: 'https://cellularnews.com/wp-content/uploads/2020/04/realme-phones.jpg',
              }}
              style={{height: 100, width: 100}}
              resizeMode={'contain'}
            />
          </View>
        </View>
        <View style={styles.orderStatus}>
          <View>
            <Text>Orderd</Text>
            <Caption>Thu,27 oct 21</Caption>
          </View>
          <View style={{paddingTop: 10}}>
            <Text>Deliverd</Text>
            <Caption>Your Product deliverd Successfully</Caption>
          </View>
        </View>
        <View style={styles.shippingDetails}>
          <View style={styles.priceDetails}>
            <Caption>Shipping Details</Caption>
          </View>
          <View style={{paddingVertical: 10}}>
            <Title>Lalita</Title>
            <Text>H.No 14,Rishi-nagar</Text>
            <Text>Hisar, </Text>
            <Text>Haryana-125047</Text>
            <Text>Phone Number-9999966666</Text>
          </View>
        </View>
        <View style={styles.priceDetails}>
          <Caption>Price Details</Caption>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
          }}>
          <Text>Selling Price</Text>
          <Text>16000</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
          }}>
          <Text>Discount</Text>
          <Text>-2000</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
          }}>
          <Text>Shipping fee</Text>
          <Text>100</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            borderBottomColor: 'lightgray',
            borderBottomWidth: 0.5,
            borderTopColor: 'lightgray',
            borderTopWidth: 0.5,
          }}>
          <Text style={{fontWeight:'bold'}}>Total Price</Text>
          <Text style={{fontWeight:'bold'}}>14100</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: 'lightgray',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray',
    paddingVertical: 10,
  },
  orderStatus: {
    paddingVertical: 10,
  },
  shippingDetails: {
    paddingVertical: 10,
  },
  priceDetails: {
    borderBottomColor: 'lightgray',
    borderBottomWidth: 0.5,
    paddingVertical: 5,
    borderTopColor: 'lightgray',
    borderTopWidth: 0.5,
  },
});

export default OrderDetails;
