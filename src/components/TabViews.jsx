/* eslint-disable prettier/prettier */
import FirstTabRotue from '../tabs/FirstTabRotue';
import SecondTabRoute from '../tabs/SecondTabRoute';
import ThirdTabRoute from '../tabs/ThirdTabRoute';
import * as React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';

// tab components
const renderScene = SceneMap({
  first: FirstTabRotue,
  second: SecondTabRoute,
  third: ThirdTabRoute,
});

export default function TabViews() {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Bestseller'},
    {key: 'second', title: 'Special Deals'},
    {key: 'third', title: 'New Launches'},
  ]);

  const renderTabBar = props => (
    <TabBar
      {...props}
      onTabPress={({route, preventDefault}) => {}}
      activeColor={'#20B038'}
      indicatorStyle={styles.activeIndicator}
      indicatorContainerStyle={{padding: 0}}
      labelStyle={styles.tabLabelStyle}
      style={styles.indicatorContainer}
      tabStyle={styles.tabStyle}
    />
  );

  return (
    <TabView
      navigationState={{index, routes}}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
    />
  );
}

const styles = StyleSheet.create({
  activeIndicator: {
    backgroundColor: '#20B038',
    height: 3,
  },
  indicatorContainer: {
    backgroundColor: '#252f45',
  },
  tabLabelStyle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  tabStyle: {paddingHorizontal: 0, paddingVertical: 12},
});
