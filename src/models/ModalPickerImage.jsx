/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
// ModalPicker.js
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';

import {
  View,
  Modal,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

let componentIndex = 0;

const {height, width} = Dimensions.get('window');
const PADDING = 8;
const BORDER_RADIUS = 5;
const FONT_SIZE = 16;
const HIGHLIGHT_COLOR = 'rgba(0,118,255,0.9)';
const OPTION_CONTAINER_HEIGHT = 400;

const ModalPickerImage = forwardRef(
  (
    {
      data = [],
      onChange = () => {},
      initValue = 'Select me!',
      cancelText = 'Cancel',
      style = {},
      optionStyle = {},
      optionTextStyle = {},
      sectionStyle = {},
      sectionTextStyle = {},
      cancelStyle = {},
      cancelTextStyle = {},
      overlayStyle = {},
      children,
      visible,
      closeOnSelect,
    },
    ref,
  ) => {
    const [selected, setSelected] = useState(initValue);
    const [pickerData, setPickerData] = useState(data);

    useEffect(() => {
      setSelected(initValue);
    }, [initValue]);

    useEffect(() => {
      setPickerData(data);
    }, [data]);

    const handleChange = item => {
      onChange(item);
      setSelected(item.label);
      closeOnSelect();
    };

    const renderSection = section => {
      return (
        <View key={section.key} style={[styles.sectionStyle, sectionStyle]}>
          <Text style={[styles.sectionTextStyle, sectionTextStyle]}>
            {section.label}
          </Text>
        </View>
      );
    };

    const renderOption = option => {
      return (
        <TouchableOpacity
          key={option.key}
          activeOpacity={0.7}
          onPress={() => handleChange(option)}>
          <View
            style={[
              styles.optionStyle,
              optionStyle,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
            ]}>
            <View style={{flex: 0.15}}>
              <Image
                source={option.image}
                resizeMode="stretch"
                style={{width: 30, height: 16}}
              />
            </View>

            <View style={{flex: 0.7, alignItems: 'center'}}>
              <Text
                style={[
                  styles.optionTextStyle,
                  optionTextStyle,
                  {
                    color: '#434343',
                    fontSize: 14,
                  },
                ]}>
                {option.label}
              </Text>
            </View>

            <View style={{flex: 0.15, alignItems: 'flex-end'}}>
              <Text
                style={[
                  styles.optionTextStyle,
                  optionTextStyle,
                  {
                    color: 'grey',
                    fontSize: 12,
                  },
                ]}>
                {option.dialCode}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };

    const renderOptionList = () => {
      const options = pickerData.map(item => {
        if (item.section) {
          return renderSection(item);
        }

        return renderOption(item);
      });

      return (
        <View
          style={[styles.overlayStyle, overlayStyle]}
          key={`modalPicker${componentIndex++}`}>
          <View style={styles.optionContainer}>
            <ScrollView keyboardShouldPersistTaps="always">
              <View style={{paddingHorizontal: 10}}>{options}</View>
            </ScrollView>
          </View>

          <View style={styles.cancelContainer}>
            <TouchableOpacity onPress={closeOnSelect}>
              <View style={[styles.cancelStyle, cancelStyle]}>
                <Text style={[styles.cancelTextStyle, cancelTextStyle]}>
                  {cancelText}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    };

    return (
      <View style={style}>
        <Modal
          transparent
          visible={visible}
          onRequestClose={closeOnSelect}
          animationType="slide">
          {renderOptionList()}
        </Modal>
      </View>
    );
  },
);

export default ModalPickerImage;

const styles = StyleSheet.create({
  overlayStyle: {
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  optionContainer: {
    borderRadius: BORDER_RADIUS,
    width: width * 0.8,
    height: OPTION_CONTAINER_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.8)',
    left: width * 0.1,
    top: (height - OPTION_CONTAINER_HEIGHT) / 2,
  },
  cancelContainer: {
    left: width * 0.1,
    top: (height - OPTION_CONTAINER_HEIGHT) / 2 + 10,
  },
  selectStyle: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    borderRadius: BORDER_RADIUS,
  },
  selectTextStyle: {textAlign: 'center', color: '#333', fontSize: FONT_SIZE},
  cancelStyle: {
    borderRadius: BORDER_RADIUS,
    width: width * 0.8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: PADDING,
  },
  cancelTextStyle: {textAlign: 'center', color: '#333', fontSize: FONT_SIZE},
  optionStyle: {
    padding: PADDING,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionTextStyle: {
    textAlign: 'center',
    fontSize: FONT_SIZE,
    color: HIGHLIGHT_COLOR,
  },
  sectionStyle: {
    padding: PADDING * 2,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  sectionTextStyle: {textAlign: 'center', fontSize: FONT_SIZE},
});
