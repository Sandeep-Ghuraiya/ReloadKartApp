/* eslint-disable react-native/no-inline-styles */
import {Entypo} from '@react-native-vector-icons/entypo';
import {Fontisto} from '@react-native-vector-icons/fontisto';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import LinearGradient from 'react-native-linear-gradient';
import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';

const OrderModal = ({loading}) => {
  return (
    <Modal transparent={true} animationType="fade" visible={loading}>
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['#071b2e', '#073623']}
          style={styles.gradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <View style={styles.modalView}>
            <View style={{width: '100%'}}>
              <ActivityIndicator size={'large'} color={'#fff'} />
              <Text style={styles.title}>Creating Your Order</Text>
              <Text style={styles.subTitle}>
                Please wait a moment, we are processing your payment...
              </Text>
            </View>
            <View style={{marginLeft: 10, marginVertical: 10}}>
              <View style={styles.labelContainer}>
                <View style={styles.iconBox}>
                  <Entypo name="lock" size={16} color="orange" />
                </View>
                <Text style={styles.labelText}>
                  Your payment information is secure
                </Text>
              </View>

              <View style={styles.labelContainer}>
                <View style={styles.iconBox}>
                  <Fontisto name="flash" size={16} color="orange" />
                </View>

                <Text style={styles.labelText}>
                  This usually takes 10–30 seconds
                </Text>
              </View>
              <View style={styles.labelContainer}>
                <View style={styles.iconBox}>
                  <MaterialDesignIcons
                    name="star-four-points"
                    size={15}
                    color="orange"
                  />
                </View>

                <Text style={styles.labelText}>
                  Thank you for your patience
                </Text>
              </View>
              <View style={styles.boxWrapper}>
                {/* animated border */}
                {/* <Animated.View
                  style={[
                    styles.animatedBorder,
                    { transform: [{ translateX }] },
                  ]}
                >
                  <LinearGradient
                    colors={["transparent", "#FF6F00", "transparent"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientBorder}
                  />
                </Animated.View> */}

                {/* content */}
                <View style={styles.box}>
                  <Text style={styles.boxText}>
                    After successful payment, you can check your order in the
                    order list.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default OrderModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  gradient: {
    width: '90%',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  modalView: {
    width: '100%',
  },
  title: {
    marginVertical: 10,
    fontSize: 26,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  subTitle: {
    marginBottom: 10,
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  iconBox: {
    // backgroundColor: "red",
    width: 20,
  },
  labelText: {
    marginBottom: 6,
    color: '#fff',
    fontWeight: '600',
  },

  boxWrapper: {
    marginTop: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },

  animatedBorder: {
    ...StyleSheet.absoluteFillObject,
  },

  gradientBorder: {
    width: 200,
    height: '100%',
  },

  box: {
    backgroundColor: 'rgba(255, 111, 0, 0.08)',
    padding: 15,
    borderRadius: 10,
  },

  boxText: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 18,
  },
});
