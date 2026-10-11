/* eslint-disable prettier/prettier */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

const useSpecialItems = () => {
  const {specialVouchersList} = useSelector(state => state.vouchers);

  const [allBestsellerList, setAllBestsellerList] = useState([]);
  const [allSpecialDealsList, setAllSpecialDealsList] = useState([]);
  const [allNewLaunchesList, setAllNewLaunchesList] = useState([]);

  useEffect(() => {
    const getVoucherItems = async () => {
      try {
        if (specialVouchersList?.data) {
          const bestseller = specialVouchersList.data.bestseller;
          const specialDeals = specialVouchersList.data.special_deals;
          const newLaunches = specialVouchersList.data.new_launches;

          if (bestseller && bestseller.length > 0) {
            setAllBestsellerList(bestseller);
          }
          if (specialDeals && specialDeals.length > 0) {
            setAllSpecialDealsList(specialDeals);
          }
          if (newLaunches && newLaunches.length > 0) {
            setAllNewLaunchesList(newLaunches);
          }
        } else {
          const value = await AsyncStorage.getItem('special_items');

          const array_list = JSON.parse(value);

          const bestseller = array_list.bestseller;

          const specialDeals = array_list.special_deals;
          const newLaunches = array_list.new_launches;

          if (bestseller && bestseller.length > 0) {
            setAllBestsellerList(bestseller);
          }
          if (specialDeals && specialDeals.length > 0) {
            setAllSpecialDealsList(specialDeals);
          }
          if (newLaunches && newLaunches.length > 0) {
            setAllNewLaunchesList(newLaunches);
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        // setLoading(false);
      }
    };

    getVoucherItems();
  }, [specialVouchersList]); 

  return {allBestsellerList, allSpecialDealsList, allNewLaunchesList};
};

export default useSpecialItems;
