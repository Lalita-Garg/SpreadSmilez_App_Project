import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {Caption} from 'react-native-paper';
import {UserContext, TitleContext} from '../assets/settings/context';
import {FetchApi} from '../assets/settings/FetchApi';
import Loader,{ WaitLoader } from '../assets/settings/Loader';
const Width = Dimensions.get('screen').width;

const Shop = ({navigation}) => {
  const {token} = useContext(UserContext);
  const {setScreenTitle} = useContext(TitleContext);
  const [data, setData] = useState([]);
  const [isLoading,setIsLoading] = useState(true)

  const getCategories = () => {
    FetchApi('/User/CategoryList', token, {})
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
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setScreenTitle('All Categories');
    getCategories();
    const unsubscribe = navigation.addListener('tabPress', e => {
      setScreenTitle('All Categories');
    });
    return unsubscribe;
  }, []);

  const Item = ({item}) => (
    <TouchableOpacity onPress={() => navigation.navigate('SubCategories', {id: item.id,name:item.name})}>
      <View style={styles.root}>
        <View style={styles.listItem}>
          <View style={styles.txtContainer}>
            <Text style={styles.text}>{item.name}</Text>
            <Text numberOfLines={2} style={{color: 'gray', textAlign: 'left'}}>
              HeadPhones ,Smart Watches Speaker and more
            </Text>
          </View>
          <View>
            <Image
              source={{uri: item.imageUrl}}
              resizeMode="cover"
              style={styles.image}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => <Item item={item} />;

  return (
    <>
    <Loader isLoading={isLoading} />
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{fontSize: 35, fontWeight: 'bold'}}>All Categories</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:Width,
  },
  header: {
    padding: 10,
  },
  root: {
    padding: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'lightgray',
    borderRadius:4,
  },
  txtContainer: {
    width: Width/2,
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    height: 120,
    width: Width/3,
  },
  text: {
    fontSize: 20,
    paddingBottom: 10,
    fontWeight: '700',
  },
});

export default Shop;
