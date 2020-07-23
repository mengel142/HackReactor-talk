import React, {Fragment, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import pixabaySearch from '../api/pixabaySearch';

const MetaData = ({likes, views, downloads, tags}) => {
  return (
    <View>
      <Text>{`likes: ${likes}`}</Text>
      <Text>{`views: ${views}`}</Text>
      <Text>{`downloads: ${downloads}`}</Text>
      <Text>{`tags: ${tags}`}</Text>
    </View>
  );
};
const User = ({user, userImageURL}) => (
  <View
    style={{
      flexDirection: 'row',
      width: scale(100),
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
    <Image
      source={{
        uri: userImageURL
          ? userImageURL
          : 'https://source.unsplash.com/user/erondu',
      }}
      style={{width: scale(40), height: scale(40), borderRadius: scale(20)}}
    />
    <Text>{user}</Text>
  </View>
);

const ImageRenderItem = ({item}) => (
  <View style={styles.renderItemContainer}>
    <View
      style={{
        height: '100%',
        width: '50%',
        justifyContent: 'space-between',
      }}>
      <Image
        source={{uri: item.previewURL}}
        style={{width: '100%', height: '70%'}}
      />
      <User user={item.user} userImageURL={item.userImageURL} />
    </View>
    <MetaData {...item} />
  </View>
);
const ImagesFlatlist = ({images, loadImages}) => (
  <FlatList
    data={images}
    renderItem={ImageRenderItem}
    keyExtractor={(item) => item.id}
    style={{width: '100%'}}
  />
);

const SearchSection = ({handleSearch, setQuery, query}) => (
  <Fragment>
    <TextInput
      style={styles.searchInput}
      onChangeText={(text) => setQuery(text)}
      value={query}
    />
    <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
      <Text style={styles.searchButtonText}>search</Text>
    </TouchableOpacity>
  </Fragment>
);

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [page, setPageNumber] = useState(1);
  const [images, setImages] = useState([]);
  const handleSearch = async () => {
    if (images.length) {
      setImages([]);
    }
    setPageNumber(1);
    getImages();
  };

  const getImages = async () => {
    const searchImages = await pixabaySearch(page, 10, query);
    console.log('serach images', searchImages);
    setPageNumber(page + 1);
    setImages(images.concat(searchImages));
  };

  return (
    <View style={styles.container}>
      <SearchSection
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
      />
      <ImagesFlatlist images={images} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: verticalScale(20),
  },
  searchInput: {
    width: scale(300),
    height: verticalScale(40),
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: verticalScale(10),
    borderRadius: scale(10),
    paddingHorizontal: scale(10),
  },
  searchButton: {
    backgroundColor: 'blue',
    width: scale(100),
    height: verticalScale(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: scale(10),
    marginBottom: verticalScale(10),
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  renderItemContainer: {
    width: '100%',
    height: verticalScale(200),
    marginVertical: scale(10),
    padding: scale(10),
    borderTopWidth: verticalScale(0.5),
    borderBottomWidth: verticalScale(0.5),
    borderColor: '#a7a7a7',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
export default SearchScreen;
