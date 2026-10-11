import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

const usePopupImage = () => {
  const {settingData} = useSelector(state => state.setting);

  const [checkImage, setCheckImage] = useState(false);

  useEffect(() => {
    if (settingData?.offers_popup && settingData?.offers_popup?.length > 0) {
      setCheckImage(true);
    } else {
      setCheckImage(false);
    }
  }, [settingData]);
  return checkImage;
};

export default usePopupImage;
