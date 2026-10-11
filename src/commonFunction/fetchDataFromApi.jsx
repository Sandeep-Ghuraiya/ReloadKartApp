/* eslint-disable prettier/prettier */
import {
  brandListData,
  categoryListData,
  specialVouchersDataList,
  topupDataList,
  voucherDataList,
} from '../redux/voucherReducer';

export default function fetchDataFromApi(dispatch) {
  // Brand Data
  const brandData = JSON.stringify({action: 'brands'});
  dispatch(brandListData(brandData));

  // Category Data
  const categoryData = JSON.stringify({action: 'categories'});
  dispatch(categoryListData(categoryData));

  // bestseller, special deals, new launches data
  const specialData = JSON.stringify({
    action: 'valuable_products',
  });
  dispatch(specialVouchersDataList(specialData));

  // Voucher Data
  const voucherData = JSON.stringify({
    action: 'products',
    product_id: '',
    brand_id: '',
    category_id: '',
    type: 'voucher' /*voucher,topup,gift*/,
  });
  dispatch(voucherDataList(voucherData));

  //Topup Data
  const topupData = JSON.stringify({
    action: 'products',
    product_id: '',
    brand_id: '',
    category_id: '',
    type: 'topup' /*voucher,topup,gift*/,
  });
  dispatch(topupDataList(topupData));
}
