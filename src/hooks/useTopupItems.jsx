/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

const useTopupItems = () => {
  const {topupList} = useSelector(state => state.vouchers);

  const [allTopupList, setAllTopupList] = useState([]);

  const sortAlphabetically = list => {
    return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  };

  useEffect(() => {
    const getTopupItems = async () => {
      try {
        if (topupList?.data && topupList?.data?.length > 0) {
          setAllTopupList(sortAlphabetically([...topupList?.data]));
        } else {
          const value = await AsyncStorage.getItem('topup_items');
          const array_list = JSON.parse(value);
          if (array_list && array_list.length > 0) {
            setAllTopupList(sortAlphabetically([...array_list]));
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        //setLoading(false);
      }
    };

    getTopupItems();
  }, [topupList]);

  return {allTopupList};
};

export default useTopupItems;
