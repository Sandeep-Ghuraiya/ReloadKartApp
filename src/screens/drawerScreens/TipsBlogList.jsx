/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import HomeSkeleton from '../../loader/HomeSkeleton';
import {setActiveReloader, tipsBlog} from '../../redux/settingReducer';
import Banner from '../../components/Banner';
import {htmlToText} from 'html-to-text';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';

/* ✅ STATIC styles (no re-creation) */
const TAG_STYLES = {
  h1: {
    color: '#D5CEA3',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  h2: {
    color: '#D5CEA3',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 20,
  },
  h3: {
    color: '#D5CEA3',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
  }, // Subheadings
  p: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 24,
    marginTop: 10,
  }, // Paragraph text
  img: {
    width: '100%',
    height: 250,
    marginVertical: 15,
  },
  div: {
    color: '#fff',
    alignItems: 'flex-start',
    lineHeight: 20,
    fontSize: 14,
  },
  a: {
    color: '#20B038',
  },
  strong: {
    fontWeight: '700',
  },
  hr: {
    borderWidth: 0.2,
    borderColor: '#fff',
    width: '100%',
    marginTop: 15,
  },
  em: {
    fontStyle: 'italic',
  },
  ul: {
    marginVertical: 5,
  },
};

/* ✅ Memoized Blog Item */
const BlogItem = React.memo(({item, onPress}) => {
  const source = React.useMemo(() => {
    return {html: item.content};
  }, [item.content]);

  // const previewText = React.useMemo(() => {
  //   return htmlToText(item.content).slice(0, 120);
  // }, [item.content]);

  return (
    <View style={styles.card}>
      <Banner image={item.image} />

      <Text style={styles.title}>{htmlToText(item.title)}</Text>

      <View style={styles.textWrapper}>
        <RenderHTML
          contentWidth={300}
          source={source}
          tagsStyles={TAG_STYLES}
        />
        {/* ✅ Removed RenderHTML (BIG PERFORMANCE FIX) */}
        {/* <Text style={styles.preview}>{previewText}...</Text> */}
      </View>

      <View style={styles.btnView}>
        <Text style={styles.dateText}>{item.created_at}</Text>
        <TouchableOpacity onPress={() => onPress(item)}>
          <Text style={styles.readMore}>Read More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const TipsBlogList = ({navigation, route}) => {
  const {tipsData, loading, loadMore, hasMore, page} = useSelector(
    state => state.setting,
  );

  const dispatch = useDispatch();

  /* ✅ Data handling */
  /* ✅ FIRST LOAD ONLY */
  useFocusEffect(
    useCallback(() => {
      if (tipsData.length === 0) {
        dispatch(tipsBlog({action: 'tips_blog', page: 1}));
      }
    }, [dispatch]),
  );

  /* ✅ Navigation */
  const toggleReadMore = useCallback(
    item => {
      navigation.navigate('TipsBlogView', {
        blogData: item,
      });
    },
    [navigation],
  );

  /* ✅ Pagination */
  const handleLoadMore = useCallback(() => {
    if (!loadMore && hasMore) {
      dispatch(
        tipsBlog({
          action: 'tips_blog',
          page: page + 1,
        }),
      );
    }
  }, [loadMore, hasMore, page, dispatch]);

  /* ✅ Render Item */
  const renderItem = useCallback(
    ({item}) => <BlogItem item={item} onPress={toggleReadMore} />,
    [toggleReadMore],
  );

  return (
    <View style={styles.container}>
      {loading && tipsData.length === 0 ? (
        <View>
          <HomeSkeleton />
        </View>
      ) : (
        <FlatList
          data={tipsData}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()} // ✅ FIXED
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.2}
          onEndReached={handleLoadMore}
          contentContainerStyle={{paddingBottom: 80}}
          /* ✅ PERFORMANCE BOOST */
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews
          ListFooterComponent={
            loadMore ? (
              <View style={{paddingVertical: 16}}>
                <ActivityIndicator color={'#fff'} size={25} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

/* ✅ Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16182B',
  },
  card: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 22,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#fff',
  },
  btnView: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    color: '#fff',
    backgroundColor: '#20B038',
    padding: 8,
    borderRadius: 6,
    fontWeight: '500',
  },
  readMore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#20B038',
  },
  textWrapper: {
    maxHeight: 60,
    marginTop: 10,
    overflow: 'hidden',
  },
});

export default TipsBlogList;
