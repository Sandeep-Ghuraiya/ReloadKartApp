/* eslint-disable prettier/prettier */
import {htmlToText} from 'html-to-text';
import React, {useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {incrementCount} from '../redux/counterReducer';
import {useDispatch} from 'react-redux';
import usePopupImage from '../hooks/usePopupImage';

const {width} = Dimensions.get('screen');

const DynamicTextShow = ({content}) => {
  const dispatch = useDispatch();
  const checkImage = usePopupImage();
  const [expanded, setExpanded] = useState(false);
  const [lines, setLines] = useState(0);

  const animatedHeight = useRef(new Animated.Value(60)).current;

  const toggleExpand = () => {
    dispatch(incrementCount(checkImage));
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const options = {
    wordwrap: null,
  };

  const plainText = htmlToText(content, options);

  return (
    <View style={styles.descriptionContainer}>
      {/* Animated Wrapper */}
      <Text
        style={styles.text}
        onTextLayout={event => {
          setLines(event.nativeEvent.lines.length);
        }}
        numberOfLines={expanded ? undefined : 3}>
        {plainText}
      </Text>

      {/* Read more / Read less Button */}
      {lines > 2 && (
        <TouchableOpacity onPress={toggleExpand} style={styles.readMoreWrapper}>
          <Text style={styles.readMoreBtn}>
            {expanded ? 'Read less' : 'Read more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DynamicTextShow;

const styles = StyleSheet.create({
  descriptionContainer: {
    flex: 1,
  },
  paraContent: {
    overflow: 'hidden',
    position: 'relative',
    lineHeight: 22,
  },
  text: {
    width: '100%',
    color: '#fff',
    lineHeight: 18,
    // backgroundColor: 'red',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  readMoreWrapper: {
    marginTop: 6,
    alignItems: 'flex-end',
  },

  readMoreBtn: {
    fontSize: 16,
    fontWeight: '500',
    color: '#20B038',
    textDecorationLine: 'underline',
  },
});
