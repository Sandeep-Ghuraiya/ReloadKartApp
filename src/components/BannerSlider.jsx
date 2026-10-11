/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {Animated, Dimensions, Image, StyleSheet, View} from 'react-native';
import {ExpandingDot} from 'react-native-animated-pagination-dots';
import Carousel from 'react-native-reanimated-carousel';
import {useSelector} from 'react-redux';

const demoBannerList = [
  {id: 1, image_url: require('../assets/gamocoinImages/image1.jpg')},
  {id: 2, image_url: require('../assets/gamocoinImages/image2.jpg')},
  {id: 3, image_url: require('../assets/gamocoinImages/image3.jpg')},
];

const width = Dimensions.get('window').width;

const BannerSlider = () => {
  const {settingData} = useSelector(state => state.setting);

  const [activeIndex, setActiveIndex] = useState(0);
  const [bannerList, setBannerList] = useState([]);

  const scrollX = useRef(new Animated.Value(0)).current;

  /** ✅ Update banner list only when settingData changes */
  useEffect(() => {
    const banners = settingData?.mobile_banner_image || [];
    setBannerList(prev =>
      JSON.stringify(prev) !== JSON.stringify(banners) ? banners : prev,
    );
  }, [settingData]);

  const renderItem = useCallback(({item}) => {
    return (
      <View style={styles.sliderWrapper}>
        <Image
          source={{uri: item.image}}
          // resizeMode="contain"
          style={styles.image}
        />
      </View>
    );
  }, []);

  const dataToRender = bannerList.length > 0 ? bannerList : demoBannerList;

  return (
    <View>
      <View style={styles.container}>
        <Carousel
          loop
          width={width - 20}
          height={width / 2}
          autoPlay
          autoPlayInterval={2000}
          data={dataToRender}
          scrollAnimationDuration={1000}
          onSnapToItem={setActiveIndex}
          renderItem={renderItem}
          onProgressChange={(_, absoluteProgress) => {
            scrollX.setValue(absoluteProgress * width);
          }}
        />
      </View>

      <View style={styles.paginationContainer}>
        <ExpandingDot
          data={dataToRender}
          expandingDotWidth={30}
          currentIndex={activeIndex}
          scrollX={scrollX}
          activeDotColor="#fff"
          inActiveDotColor="#767b7a"
          inActiveDotOpacity={0.6}
          dotStyle={styles.dotsStyle}
          containerStyle={{top: 30}}
        />
      </View>
    </View>
  );
};

export default BannerSlider;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    borderRadius: 8,
    marginTop: 0,
    paddingHorizontal: 10,
  },
  sliderWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 43,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  dotsStyle: {
    width: 6,
    height: 6,
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    marginHorizontal: 2,
  },
});
