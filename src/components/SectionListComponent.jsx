/* eslint-disable react-native/no-inline-styles */
/* eslint-disable curly */
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BrandItemGrid from './BrandItemGrid';

/* 🔹 Constants */
const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const ITEMS_PER_ROW = 3;
const ROW_HEIGHT = 130; // must match grid row height
const SECTION_HEADER_HEIGHT = 35; // must match header height

/* 🔹 Chunk items into rows */
const chunkArray = (data = [], size = ITEMS_PER_ROW) => {
  const result = [];
  for (let i = 0; i < data.length; i += size) {
    result.push(data.slice(i, i + size));
  }
  return result;
};

/* 🔹 Calculate exact offset */
const getSectionOffset = (sections, sectionIndex) => {
  let offset = 0;

  for (let i = 0; i < sectionIndex; i++) {
    offset += SECTION_HEADER_HEIGHT; // header
    offset += sections[i].data.length * ROW_HEIGHT; // rows
  }

  return offset;
};

const SectionListComponent = ({
  indexLetter,
  data,
  title,
  alpha_height = false,
}) => {
  const listRef = useRef(null);
  const hasAutoScrolled = useRef(false);

  const [sections, setSections] = useState([]);
  const [activeLetter, setActiveLetter] = useState(null);

  /* 🔹 Build sections */
  useEffect(() => {
    const grouped = {};

    data?.forEach(item => {
      if (!item?.name) return;
      const letter = item.name.charAt(0).toUpperCase();
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(item);
    });

    const builtSections = Object.keys(grouped)
      .sort()
      .map(letter => ({
        title: letter,
        data: chunkArray(grouped[letter]),
      }));

    setSections(builtSections);
    hasAutoScrolled.current = false;
  }, [data]);

  /* 🔹 Available letters */
  const availableLetters = useMemo(
    () => new Set(sections.map(s => s.title)),
    [sections],
  );

  /* 🔹 Auto scroll to first section */
  useEffect(() => {
    if (!sections.length || hasAutoScrolled.current) return;

    hasAutoScrolled.current = true;
    setActiveLetter(sections[0].title);

    listRef.current?.getScrollResponder()?.scrollTo({y: 0, animated: true});
  }, [sections]);

  /* 🔹 Alphabet click */
  const scrollToLetter = letter => {
    if (!availableLetters.has(letter)) return;

    const sectionIndex = sections.findIndex(sec => sec.title === letter);
    if (sectionIndex === -1) return;

    setActiveLetter(letter);

    const offset = getSectionOffset(sections, sectionIndex);

    listRef.current
      ?.getScrollResponder()
      ?.scrollTo({y: offset, animated: true});
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Section List */}
      <View style={styles.sectionContainer}>
        <SectionList
          ref={listRef}
          sections={sections}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({section}) => (
            <View style={[styles.sectionHeader]}>
              <Text style={styles.sectionHeaderText}>{section.title}</Text>
            </View>
          )}
          renderItem={({item: row}) => (
            <View style={styles.row}>
              {row.map((brand, index) => (
                <BrandItemGrid
                  key={index}
                  item={brand}
                  index={index}
                  title={title}
                />
              ))}
            </View>
          )}
        />
      </View>

      {/* 🔹 Alphabet Index */}
      <View
        style={[styles.indexContainer, alpha_height ? {height: '90%'} : null]}>
        {ALPHABETS.map(letter => {
          const disabled = !availableLetters.has(letter);

          return (
            <TouchableOpacity
              key={letter}
              disabled={disabled}
              onPress={() => scrollToLetter(letter)}>
              <Text
                style={[
                  indexLetter,
                  disabled && styles.indexLetterDisabled,
                  letter === activeLetter && styles.activeLetterStyle,
                ]}>
                {letter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default SectionListComponent;

/* 🔹 Styles */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionContainer: {
    width: '88%',
  },
  sectionHeader: {
    height: SECTION_HEADER_HEIGHT,
    marginTop: 10,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#252f45',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  row: {
    paddingTop: 15,
    flexDirection: 'row',
    width: '100%',
    height: ROW_HEIGHT,
  },
  indexContainer: {
    justifyContent: 'center',
    //backgroundColor: '#252f45',
    borderRadius: 20,
    paddingHorizontal: 4,
  },
  indexLetterDisabled: {
    color: '#666',
    opacity: 0.4,
  },
  activeLetterStyle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
});
