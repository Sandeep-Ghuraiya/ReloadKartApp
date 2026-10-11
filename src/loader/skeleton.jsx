/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const Skeleton = () => {
  const skeletonData = Array.from({length: 3}, (_, index) => index); // 12 items for 4 rows

  const renderItem = () => {
    return (
      <View style={styles.itemContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginBottom: 5,
          }}>
          <ShimmerPlaceholder
            style={styles.avatarStyle}
            shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
          />
          <View>
            <ShimmerPlaceholder
              style={[styles.textStyle1, {width: 150}]}
              shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
            />
            <ShimmerPlaceholder
              style={[styles.textStyle1, {width: 100}]}
              shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
            />
          </View>
        </View>
        <ShimmerPlaceholder
          style={[styles.textStyle2, {width: '85%'}]}
          shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
        />
        <ShimmerPlaceholder
          style={[styles.textStyle2, {width: '98%'}]}
          shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
        />
        <ShimmerPlaceholder
          style={[styles.textStyle2, {width: '40%'}]}
          shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
        />
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={skeletonData}
        keyExtractor={item => `skeleton-${item}`}
        renderItem={renderItem}
      />
    </>
  );
};

export default Skeleton;

const styles = StyleSheet.create({
  loaderStyle: {
    width: '100%',
    maxWidth: 480,
    height: 90,
  },
  itemContainer: {
    marginBottom: 10,
    marginTop: 20,
    marginHorizontal: 15,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: '#252F45',
    // height: 140
  },
  avatarStyle: {
    width: 35,
    height: 35,
    // borderRadius: 50,
  },
  textStyle1: {
    marginVertical: 5,
    borderRadius: 2,
    height: 8,
    // marginHorizontal: 10,
    // flex: 1,
    // width: 130
  },
  textStyle2: {
    marginVertical: 5,
    borderRadius: 2,
    height: 8,
  },
});
