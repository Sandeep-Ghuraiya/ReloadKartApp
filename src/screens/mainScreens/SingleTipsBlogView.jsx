/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-unused-vars */
import AntDesign from '@react-native-vector-icons/ant-design';
import SinglePageSkeleton from '../../loader/SinglePageSkeleton';
import {htmlToText} from 'html-to-text';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import RenderHTML from 'react-native-render-html';

const SingleTipsBlogView = ({navigation, route}) => {
  const {title, image, content, created_at} = route.params?.blogData || {};

  const [loading, setLoading] = useState(true);

  const option = {
    wordwrap: null,
  };

  const plainText = htmlToText(content, option);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const tagsStyles = {
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
    },
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

  return (
    <View style={styles.container}>
      {loading ? (
        <View>
          <SinglePageSkeleton />
        </View>
      ) : (
        <View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 50}}>
            <View style={styles.innerContainer}>
              <View style={styles.bannerContainer}>
                <Image source={{uri: image}} style={styles.img} />
              </View>
              <View style={styles.mainContainer}>
                <View style={styles.textContainer}>
                  <View style={styles.iconContainer}>
                    <AntDesign name="clock-circle" size={16} color="#fff" />
                    <Text style={styles.dateText}>{created_at}</Text>
                  </View>
                  <Text style={styles.title}>{htmlToText(title)}</Text>
                  {/* <Text style={styles.content}>{plainText}</Text> */}
                  <RenderHTML
                    contentWidth={300}
                    source={{html: content}}
                    tagsStyles={tagsStyles}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default SingleTipsBlogView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16182B',
  },
  innerContainer: {
    // paddingHorizontal: 16,
  },
  bannerContainer: {
    width: '100%',
    height: 250,
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  mainContainer: {
    paddingHorizontal: 8,
  },
  textContainer: {
    width: '100%',
    backgroundColor: '#252F45',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    paddingBottom: 18,
    position: 'relative',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    gap: 7,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 20,
  },
  content: {
    marginVertical: 15,
    color: '#fff',
    // fontSize: 20,
    fontWeight: '600',
  },
});
