/* eslint-disable react-native/no-inline-styles */
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const SinglePageSkeleton = () => {
  return (
    <View style={{paddingHorizontal: 20}}>
      <View style={styles.shimmerContainer}>
        <ShimmerPlaceholder
          // visible={true}
          style={styles.square}
          shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
        />
        <ShimmerPlaceholder
          style={[styles.line, {width: '80%'}]}
          shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
        />
        <ShimmerPlaceholder
          style={[styles.line, {width: '60%'}]}
          shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
        />
        <ShimmerPlaceholder
          style={[styles.line, {width: '30%'}]}
          shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
        />
        <View style={[styles.squareBox]}>
          <ShimmerPlaceholder
            style={[styles.line, {width: '80%'}]}
            shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
          />
          <ShimmerPlaceholder
            style={[styles.line, {width: '60%'}]}
            shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
          />
          <ShimmerPlaceholder
            style={[styles.line, {width: '30%'}]}
            shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
          />
          <ShimmerPlaceholder
            style={[styles.line, {width: '15%'}]}
            shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
          />
        </View>

        <View style={[styles.squareBox]}>
          <ShimmerPlaceholder
            style={[styles.line, {width: '80%'}]}
            shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
          />
          <ShimmerPlaceholder
            style={[styles.line, {width: '60%'}]}
            shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
          />
          <ShimmerPlaceholder
            style={[styles.line, {width: '30%'}]}
            shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
          />
          <ShimmerPlaceholder
            style={[styles.line, {width: '15%'}]}
            shimmerColors={['#3a425c', '#4a5672', '#3a425c']}
          />
        </View>
      </View>
    </View>
  );
};

export default SinglePageSkeleton;

const styles = StyleSheet.create({
  shimmerContainer: {
    width: '100%',
    marginVertical: 10,
    justifyContent: 'center',
    // alignItems:'center'
  },
  square: {
    width: '100%',
    height: 130,
    borderRadius: 8,
    marginBottom: 5,
  },
  line: {
    width: '80%',
    marginTop: 20,
    height: 12,
  },
  squareBox: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 5,
    backgroundColor: '#252F45',
    marginTop: 30,
    paddingHorizontal: 15,
  },
});
