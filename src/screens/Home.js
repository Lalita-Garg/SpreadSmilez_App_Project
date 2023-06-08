import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SectionList,
} from 'react-native';
import {
  AuthContext,
  TitleContext,
  UserContext,
} from '../assets/settings/context';
import {FetchApi} from '../assets/settings/FetchApi';
import {Dimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SliderBox} from 'react-native-image-slider-box';
import {Avatar} from 'react-native-paper';
import {green, yellow} from '../assets/settings/color.json';
import {Title} from 'react-native-paper';

const width = Dimensions.get('window').width / 2 - 30;

const Home = ({navigation}) => {
  const {token} = useContext(UserContext);
  const [category, setCategory] = useState([]);
  const [isAllCatLoaded, setIsAllCatLoaded] = useState(false);
  const [skipCat, setSkipCat] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(10);
  const [homeItems, setHomeItems] = useState(0);
  var [sliderImage, setSliderImage] = useState([]);
  const [latest, setLatest] = useState([]);

  const getMoreCategories = () => {
    FetchApi('/User/CategoryList?skip=' + skipCat, token, {skip: skipCat})
      .then(res => {
        if (res.status === 200) {
          res.json().then(result => {
            if (result.length > 0) {
              setSkipCat(skipCat + 10);
              setCategory([...category, ...result]);
            } else {
              setIsAllCatLoaded(true);
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {});
  };

  const getHomeItems = () => {
    FetchApi('/User/HomeItems', token, {})
      .then(res => {
        if (res.status === 200) {
          res.json().then(result => {
            // console.log(result.slides);
            setHomeItems(result);
            var array = [{Id: 0, name: 'All'}];
            array = [...array, ...result.categories];
            setCategory(array);
            setLatest(result.latest);
            if (result.slides.length != 0) {
              var array = [];
              result.slides.forEach(element => {
                array.push(element.imageUrl);
              });
              setSliderImage(array);
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {});
  };

  const getSubCategories = () => {
    FetchApi('/User/SubCategoryList?id=' + id, token, {})
      .then(res => {
        if (res.status === 200) {
          res.json().then(result => {
            // console.log(result.subCategories);
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

  const ItemLatest = ({item}) => (
    <View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ProductDetails', {id: item.id, name: item.name})
        }>
        <View key={item.id} style={styles.category}>
          <Image
            resizeMode="stretch"
            style={styles.thumbnail}
            source={{uri: item.imageUrl}}
          />
          <Text numberOfLines={2} style={styles.title}>
            {item.name}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text numberOfLines={2} style={styles.title}>
              ₹ {item.price}/-
            </Text>
            <Text
              numberOfLines={2}
              style={[
                styles.title,
                {marginLeft: 10, textDecorationLine: 'line-through'},
              ]}>
              {item.mrp}
            </Text>
          </View>
          <Text
            numberOfLines={2}
            style={[styles.title, {fontWeight: 'bold', color: 'green'}]}>
            Save ₹ {item.mrp - item.price}/-
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({item}) => <Item item={item} />;
  const renderItemLatest = ({item}) => <ItemLatest item={item} />;

  const {signOut} = useContext(AuthContext);
  const {setScreenTitle} = useContext(TitleContext);
  useEffect(() => {
    getHomeItems();
    setScreenTitle('Home');
    const unsubscribe = navigation.addListener('tabPress', e => {
      setScreenTitle('Home');
    });
    return unsubscribe;
  }, []);

  const CategoryList = () => {
    return (
      <View style={styles.container}>
        <View style={styles.categoryContainer}>
          <FlatList
            data={category}
            showsHorizontalScrollIndicator={false}
            // onEndReached={isAllCatLoaded ? null : getMoreCategories}
            // onEndReachedThreshold={0.2}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={{paddingRight: 20}}
                key={index}
                activeOpacity={0.8}
                onPress={() => {
                  setCategoryIndex(index);
                  {
                    index != 0
                      ? navigation.navigate('SubCategories', {
                          id: item.id,
                          name: item.name,
                        })
                      : navigation.navigate('Shop');
                  }
                }}>
                <View style={{alignItems: 'center'}}>
                  {index === 0 ? (
                    <Avatar.Icon
                      icon="format-list-bulleted"
                      size={40}
                      style={{backgroundColor: 'lightgray'}}
                      color={'black'}
                    />
                  ) : (
                    <Avatar.Image
                      source={{uri: item.imageUrl}}
                      size={40}
                      style={{backgroundColor: 'lightgray'}}
                    />
                  )}
                  <Text
                    style={[
                      styles.categoryText,
                      categoryIndex === index && styles.categoryTextSelected,
                    ]}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            horizontal
          />
        </View>
      </View>
    );
  };

  return (
    <>
      <CategoryList />
      <ScrollView style={{width: '100%'}}>
        <SliderBox
          autoplay
          circleLoop
          resizeMode={'stretch'}
          sliderBoxHeight={200}
          ImageComponentStyle={{width: '100%'}}
          images={sliderImage}
          onCurrentImagePressed={() => {}}
        />
        <View style={styles.container}>
          <ScrollView
            horizontal
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <SectionList
              showsHorizontalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              sections={latest}
              renderItem={({item, section}) => {
                return null;
              }}
              renderSectionHeader={({section}) =>
                section.data.length != 0 ? (
                  <>
                    <View style={styles.titleContainer}>
                      <Title style={{color: green}}>{section.title}</Title>
                    </View>
                    <View style={{alignItems: 'flex-start'}}>
                      <FlatList
                        data={section.data}
                        renderItem={renderItemLatest}
                        showsHorizontalScrollIndicator={false}
                        numColumns={3}
                      />
                    </View>
                  </>
                ) : null
              }
            />
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryText: {fontSize: 16, color: 'grey', fontWeight: 'bold'},
  categoryTextSelected: {
    color: 'green',
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderColor: 'green',
  },
  card: {
    height: 225,
    backgroundColor: 'grey',
    width,
    marginHorizontal: 2,
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
  },
  header: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchContainer: {
    height: 50,
    backgroundColor: 'grey',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    color: 'black',
  },
  sortBtn: {
    marginLeft: 10,
    height: 50,
    width: 50,
    borderRadius: 10,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  latestContainer: {
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    width: '100%',
  },
  titleContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
  },
  innerContainer: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    margin: 1,
    padding: 10,
  },
  scontainer: {
    flexGrow: 1,
    height: '100%',
  },
  scrollView: {
    flexGrow: 1,
  },
  category: {
    padding: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
  },
  Athumbnail: {
    borderRadius: 500,
    backgroundColor: green,
    width: 50,
    height: 50,
    marginTop: 7,
    marginBottom: 9,
    justifyContent: 'center',
  },
  icon: {
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    maxWidth: 100,
  },
});

export default Home;
