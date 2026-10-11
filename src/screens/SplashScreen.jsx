/* eslint-disable prettier/prettier */
import React from 'react';
import Video from 'react-native-video';
import {Dimensions, StyleSheet, View} from 'react-native';

const videoSource = require('../assets/gamocoinImages/reloadkart_video.mp4');
const {width, height} = Dimensions.get('screen');

function SplashScreen() {

  return (
    <View style={styles.contentContainer}>
      <Video
        source={videoSource} // local video
        style={styles.video}
        muted={true} // 🔇 muted
        controls={false} // 🚫 no controls
        paused={false} // ▶ autoplay
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    width: '100%',
    height: height,
    backgroundColor: 'black',
  },
  video: {
    width: width,
    height: height,
  },
});

export default SplashScreen;
