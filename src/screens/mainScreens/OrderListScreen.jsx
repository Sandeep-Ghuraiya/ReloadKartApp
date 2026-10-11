/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
//Redux
import {useDispatch, useSelector} from 'react-redux';
import {incrementCount} from '../../redux/counterReducer';
//Components
import InternetConnection from '../../components/InternetConnection';
//Hooks
import useInternetCheck from '../../hooks/useInternetCheck';
//Models
import PopupImages from '../../models/PopupImages';
import usePopupImage from '../../hooks/usePopupImage';

const width = Dimensions.get('screen').width - 190;

const OrderListScreen = props => {
  const {navigation, route} = props;
  const {getOrderData} = useSelector(state => state.orders);
  const dispatch = useDispatch();
  const flatListRef = React.useRef(null);
  const checkImage = usePopupImage();

  const internetValue = useInternetCheck();

  const [numItem, setNumItem] = useState(10);
  const [allOrderList, setAllOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConnection, setShowConnection] = useState(false);
  const [moreLoad, setMoreLoad] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (internetValue) {
        setShowConnection(false);
      } else {
        setShowConnection(true);
      }
    }, [internetValue]),
  );

  useEffect(() => {
    if (getOrderData?.data?.length) {
      setLoading(false);
      setAllOrderList(getOrderData?.data);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }, [getOrderData]);

  // Updated date formatting to dynamically extract and format date
  function formatDateTime(dateString) {
    if (!dateString) return {month: '', day: '', year: ''};
    // Split the input into date and time parts
    const [datePart, timePart] = dateString.split(' ');

    // Create a Date object from the date part
    const date = new Date(datePart);

    // Get the month (abbreviated)
    const month = date.toLocaleString('en-US', {month: 'short'});

    // Get the day (with padding for single digits)
    const day = date.getDate().toString().padStart(2, '0');

    // Get the year
    const year = date.getFullYear();

    // Return the formatted string (date in Mon DD, YYYY format and time as is)
    return {month, day, year};
  }

  const handleLoadMore = () => {
    if (!moreLoad && allOrderList.length > numItem) {
      setMoreLoad(true);
      setTimeout(() => {
        setNumItem(prev => prev + 10); // Load 10 more items
        setMoreLoad(false);
      }, 1000); // Optional delay to simulate loading
    }
  };

  const handleOrder = item => {
    dispatch(incrementCount(checkImage));
    navigation.navigate('SingleOrderView', {item: JSON.stringify(item)});
  };

  const renderItem = ({item, index}) => {
    const {month, day, year} = item.order_date
      ? formatDateTime(item.order_date)
      : {month: '', day: '', year: ''};

    return (
      <TouchableOpacity
        onPress={() => handleOrder(item)}
        key={item.order_id}
        style={styles.orderListContainer}>
        <View style={styles.imgContainer}>
          <Image
            source={{uri: item.products.image}}
            style={styles.img}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.textStyles, {width: width}]}>
            {item?.products && item.products.title}
          </Text>
          <Text style={styles.textStyles}>
            {item?.products &&
              `${item.products.currency_symbol}${
                parseFloat(item.products.payment_processing_fees) > 0
                  ? parseFloat(item.products.sale_price) +
                    parseFloat(item.products.payment_processing_fees)
                  : parseFloat(item.products.sale_price)
              }`}
          </Text>
        </View>
        {item.order_date && (
          <View style={styles.calenderContainer}>
            <View style={styles.month}>
              <Text style={styles.monthText}>
                {month} {year}
              </Text>
            </View>
            <View style={styles.date}>
              <Text style={styles.dateText}>{day}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <PopupImages />
      {internetValue ? (
        loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={'large'} color={'#fff'} />
          </View>
        ) : (
          <>
            <View>
              <Text style={styles.heading}>My Orders</Text>

              {allOrderList && allOrderList.length > 0 ? (
                // allOrderList.map((item) => {

                // })
                <FlatList
                  ref={flatListRef}
                  data={allOrderList.slice(0, numItem)}
                  showsVerticalScrollIndicator={false}
                  onEndReached={handleLoadMore}
                  onEndReachedThreshold={0.2}
                  renderItem={renderItem}
                  keyExtractor={item => item.order_id.toString()}
                  ListFooterComponent={
                    moreLoad ? (
                      <View style={{paddingVertical: 16}}>
                        <ActivityIndicator color={'#fff'} size={25} />
                      </View>
                    ) : null
                  }
                  contentContainerStyle={{paddingBottom: 0}}
                />
              ) : (
                <View>
                  <Text style={styles.availableText}>No orders available</Text>
                </View>
              )}
            </View>
          </>
        )
      ) : (
        <InternetConnection
          visible={showConnection}
          onClose={() => showConnection(false)}
        />
      )}
    </View>
  );
};

export default OrderListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16182B',
    paddingHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    marginBottom: 15,
    marginTop: 10,
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  orderListContainer: {
    backgroundColor: '#252F45',
    marginBottom: 15,
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  textContainer: {
    marginLeft: 10,
  },
  textStyles: {
    flexWrap: 'wrap',
    color: '#fff',
    fontWeight: '600',
  },
  calenderContainer: {
    marginLeft: 10,
    // backgroundColor:'red',
    width: 60,
    height: 60,
  },
  month: {
    backgroundColor: '#20B038',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    // paddingHorizontal: 10,
    paddingVertical: 5,
  },
  monthText: {
    textTransform: 'uppercase',
    fontWeight: '600',
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
  },
  date: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    paddingVertical: 5,
  },
  dateText: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
  },
  availableText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
  },
});
