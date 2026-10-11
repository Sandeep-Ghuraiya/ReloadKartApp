/* eslint-disable prettier/prettier */
/* eslint-disable semi */
/* eslint-disable no-trailing-spaces */
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const BrandSkeleton = () => {
  const skeletonData = Array.from({length: 4}, (_, index) => index); // 12 items for 4 rows

  const renderItem = () => {
    return (
      <View style={styles.shimmerContainer}>
        <ShimmerPlaceholder
          style={styles.circle}
          shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
        />
        <ShimmerPlaceholder
          style={styles.line}
          shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
        />
      </View>
    );
  };

  return (
    <View style={{paddingHorizontal: 0}}>
      <FlatList
        data={skeletonData}
        keyExtractor={item => `skeleton-${item}`}
        renderItem={renderItem}
        numColumns={2}
        // contentContainerStyle={{columnGap:10}}
      />
    </View>
  );
};

export default BrandSkeleton;

const styles = StyleSheet.create({
  shimmerContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginBottom: 5,
  },
  line: {
    width: 110,
    height: 8,
  },
});
