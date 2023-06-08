import React ,{useState}from 'react'
import { View, Text ,StyleSheet,Image} from 'react-native'
import { Title,Caption } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable'
import FetchApi from '../assets/settings/FetchApi'

const Order = ({navigation}) => {

  const [orderList,setOrderList] = useState([]);

    const getOrder = () => {
        FetchApi('/Account/OrderHistory', token, {})
          .then(res => {
            if (res.status === 200) {
              res.json().then(result => {
                setOrderList(result);
              });
            }
          })
          .catch(error => {
            console.log(error);
          })
          .finally(() => {});
      };

      const Item =({item}) =>{
        <Pressable onPress={()=>navigation.navigate('OrderDetails')}>
        <View style={styles.listItem}>
             <View style={styles.imgContainer}>
                <Image source={require('../assets/images/logo.png')} style={styles.img} resizeMode={'contain'}/>
            </View>
            <View style={styles.txtContainer}>
            <Title>Deliverd on Jun 12</Title>
            <Caption>Product Name</Caption>
            </View>
            <View>
            <Icon name="chevron-right" color="gray" size={25} />
            </View>   
        </View>
        </Pressable>
      }

      const renderItem = ({item}) => <Item item={item} />;

    return (
        <Pressable onPress={()=>navigation.navigate('OrderDetails')}>
        <View style={styles.listItem}>
             <View style={styles.imgContainer}>
                <Image source={require('../assets/images/logo.png')} style={styles.img} resizeMode={'contain'}/>
            </View>
            <View style={styles.txtContainer}>
            <Title>Deliverd on Jun 12</Title>
            <Caption>Product Name</Caption>
            </View>
            <View>
            <Icon name="chevron-right" color="gray" size={25} />
            </View>   
        </View>
        </Pressable>
    )
}

export default Order

const styles = StyleSheet.create({
    container:{

    },
    listItem:{
        padding:20,
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:0.5,
        borderBottomColor:'lightgray',
        justifyContent:'space-between'
        
    },
    img:{
         height:100,
         width:70
    },
    imgContainer:{
         height:100,
         width:80,
    },
    txtContainer:{
    //   justifyContent:'center'
    }
})