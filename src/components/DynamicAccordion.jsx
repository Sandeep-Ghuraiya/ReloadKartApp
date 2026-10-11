/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import DynamicTextShow from './DynamicTextShow';

const AccordionItem = ({title, content, isOpen, onPress}) => {
  const {width} = useWindowDimensions();

  return (
    <View style={styles.paraWrapper}>
      <View style={styles.accordionWrapper}>
        <Text style={styles.paraTitle}>{title}</Text>
      </View>
      <DynamicTextShow content={content} />
    </View>
  );
};

const DynamicAccordion = ({voucherData}) => {
  const sections = [
    {title: 'Description', key: 'description'},
    {title: 'Disclaimer', key: 'disclaimer'},
    {title: 'Terms', key: 'terms'},
    {title: 'How to Redeem', key: 'redemption_instructions'},
  ];

  const [openSection, setOpenSection] = useState(
    sections.find(section => voucherData[section.key])?.key || null,
  );

  const accordionToggle = key => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenSection(openSection === key ? null : key);
  };

  return (
    <View style={styles.container}>
      {sections.map(({title, key}) =>
        voucherData[key] ? (
          <AccordionItem
            key={key}
            title={title}
            content={voucherData[key]}
            isOpen={openSection === key}
            onPress={() => accordionToggle(key)}
          />
        ) : null,
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // height: 300,
    width: '100%',
    paddingBottom: 20,
  },
  paraWrapper: {
    width: '100%',
    backgroundColor: '#252F45',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginBottom: 10,
  },
  accordionWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  paraTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  para: {
    marginTop: 5,
    fontSize: 13,
    color: '#fff',
    lineHeight: 20,
  },
});

export default DynamicAccordion;
