/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

const useVoucherItems = () => {
  const {voucherList} = useSelector(state => state.vouchers);

  const [allVoucherList, setAllVoucherList] = useState([]);

  const sortAlphabetically = list => {
    return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
  };

  useEffect(() => {
    const getVoucherItems = async () => {
      try {
        if (voucherList?.data && voucherList?.data?.length > 0) {
          setAllVoucherList(sortAlphabetically([...voucherList.data]));
        } else {
          const value = await AsyncStorage.getItem('voucher_items');
          const array_list = JSON.parse(value);
          if (array_list && array_list.length > 0) {
            setAllVoucherList(sortAlphabetically([...array_list]));
          }
        }
      } catch (e) {
        console.log(e);
      }
    };

    getVoucherItems();
  }, [voucherList]);

  return {allVoucherList};
};

export default useVoucherItems;
