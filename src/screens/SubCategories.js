import React, {useState, useContext, useEffect} from 'react';
import {View, StyleSheet, FlatList, Image, ScrollView} from 'react-native';
import {Text, Title, Caption, Avatar} from 'react-native-paper';
import {UserContext} from '../assets/settings/context';
import {FetchApi} from '../assets/settings/FetchApi';
import * as Animatable from 'react-native-animatable';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {Dimensions} from 'react-native';

const Height = Dimensions.get('screen').height;
const Width = Dimensions.get('screen').width;

const SubCategories = ({navigation, route}) => {
  const catId = route.params.id;
  const catname = route.params.name;

  const {token} = useContext(UserContext);
  const [data, setData] = useState([]);

  const getSubCategories = () => {
    FetchApi('/User/SubCategoryList?id=' + catId, token, {})
      .then(res => {
        if (res.status === 200) {
          res.json().then(result => {
            console.log(result.subCategories);
            setData(result.subCategories);
          });
        } else {
          console.log(res.status);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {});
  };

  useEffect(() => {
    navigation.setOptions({
      title: catname,
    });
    getSubCategories();
  }, []);

  var i = 0;
  const Item = ({item}) => (
    data.indexOf(item) != 0 ? (i = i + 50) : null,
    (
      <Animatable.View animation="lightSpeedIn" delay={i} duration={600}>
        <TouchableWithoutFeedback
          onPress={() =>
            navigation.navigate('SubSubCategories', {
              id: item.id,
              name: item.name,
            })
          }>
          <View style={styles.listItems}>
            <View>
              <Image
                source={{uri: item.imageUrl}}
                style={{width: 100, height: 100}}
                resizeMode={'cover'}
              />
            </View>
            <View>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                {item.name}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Animatable.View>
    )
  );

  const renderItem = ({item}) => <Item item={item} />;

  return (
    <View style={styles.container}>
      {/* <View style={styles.titleContainer}>
        <Text style={styles.title}>{catname}</Text>
      </View> */}
   <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  titleContainer: {},
  title: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  listItems: {
    alignItems: 'center',
    borderColor: 'lightgray',
    borderWidth: 0.5,
    margin: 5,
    width: 100,
  },
});

export default SubCategories;
