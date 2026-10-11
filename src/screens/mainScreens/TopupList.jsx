import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

// Components
import SectionListComponent from '../../components/SectionListComponent';
import BrandSkeleton from '../../loader/brandSkeleton';

// Redux
import {useSelector} from 'react-redux';

// Hooks
import useTopupItems from '../../hooks/useTopupItems';

const TopupList = props => {
  const {brandList} = useSelector(state => state.vouchers);
  const {allTopupList} = useTopupItems();

  const [loading, setLoading] = useState(true);

  /**
   * Optimized filtering using useMemo
   * Prevents unnecessary recalculations
   */
  const filteredTopups = useMemo(() => {
    if (!brandList?.data || !allTopupList?.length) {
      return [];
    }

    return brandList.data.filter(item => {
      if (item.type !== 'topup') {
        return false;
      }

      return allTopupList.some(topupItem =>
        topupItem?.brand?.includes(item.name),
      );
    });
  }, [brandList?.data, allTopupList]);

  /**
   * Loading state handler
   */
  useEffect(() => {
    if (brandList?.data) {
      setLoading(false);
    }
  }, [brandList]);

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <BrandSkeleton />
          </View>
        ) : (
          <View>
            {filteredTopups && filteredTopups.length > 0 ? (
              <SectionListComponent
                data={filteredTopups}
                indexLetter={styles.indexLetter}
                title={'Topup'}
              />
            ) : (
              <View style={styles.noListContainer}>
                <Text style={styles.noList}>Topup not found</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default React.memo(TopupList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16182B',
  },

  mainContainer: {
    height: '90%',
    marginVertical: 15,
    marginHorizontal: 10,
    paddingLeft: 10,
    paddingRight: 5,
    paddingVertical: 10,
    borderRadius: 8,
  },

  loadingContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  gridContainer: {
    width: '30%',
    marginBottom: 15,
    alignItems: 'center',
  },

  innerContainer: {
    width: 60,
    height: 60,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
  },

  img: {
    borderRadius: 50,
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },

  titleText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
    marginTop: 5,
  },

  indexLetter: {
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    color: '#20B038',
    fontWeight: '600',
    textAlign: 'center',
  },

  noListContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  noList: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    letterSpacing: 1,
  },
});
