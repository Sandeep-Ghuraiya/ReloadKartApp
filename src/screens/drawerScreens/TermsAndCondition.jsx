/* eslint-disable react/react-in-jsx-scope */
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Modal,
  StyleSheet,
  View,
} from 'react-native';
import WebView from 'react-native-webview';

const TermsAndCondition = () => {
  const navigation = useNavigation();

  const webRef = useRef(null);
  const timerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Show loader whenever screen comes into focus
      setLoading(true);

      // Hide loader after 5 seconds
      timerRef.current = setTimeout(() => {
        setLoading(false);
      }, 3000);

      const onBackPress = () => {
        if (canGoBack && webRef.current) {
          webRef.current.goBack();
          return true;
        }

        navigation.goBack();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => {
        backHandler.remove();

        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, [canGoBack, navigation]),
  );

  const injectedJS = `
    (function() {
      const style = document.createElement('style');
      style.innerHTML = \`
        .desktop-navbar,
        .mobile-navbar,
        .mobile-drawer,
        .voucher-breadcrumb-main,
        .footer-tnc-divider,
        .col-md-4 {
          display: none !important;
        }
        .page .site-main > .container {
          margin-top: -40px !important;
        } 
      \`;

      document.head.appendChild(style);
    })();
    true;
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        source={{uri: 'https://reloadkart.com/terms-of-service/'}}
        onNavigationStateChange={navState => {
          setCanGoBack(navState.canGoBack);
        }}
        onLoadStart={() => {
          setLoading(true);
        }}
        onLoadEnd={() => {
          webRef.current.injectJavaScript(injectedJS);
          setTimeout(() => {
            setLoading(false);
          }, 1500);
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={styles.webview}
      />

      {/* Loader Modal */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loaderContainer}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TermsAndCondition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a130f',
    paddingBottom: 50,
  },

  webview: {
    flex: 1,
    backgroundColor: '#1a130f',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(26,19,15, 0.85)',
  },

  loaderBox: {
    height: 90,
    width: 90,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a130f',
  },
});
