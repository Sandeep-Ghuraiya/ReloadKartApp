import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const {width} = Dimensions.get('screen');

const HomeSkeleton = () => {
  return (
    <View style={{paddingHorizontal: 20, width: width}}>
      <View style={styles.shimmerContainer}>
        <ShimmerPlaceholder
          style={styles.square}
          shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
        />

        <ShimmerPlaceholder
          style={[styles.square, {marginTop: 30}]}
          shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
        />

        <ShimmerPlaceholder
          style={[styles.square, {marginTop: 30}]}
          shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
        />
      </View>
    </View>
  );
};

export default HomeSkeleton;

const styles = StyleSheet.create({
  shimmerContainer: {
    width: '100%',
    marginVertical: 10,
    justifyContent: 'center',
  },
  square: {
    width: '100%',
    height: 170,
    borderRadius: 8,
    marginBottom: 5,
  },
});
