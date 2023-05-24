import { NativeBaseProvider, Box, Text } from 'native-base';
import React, { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { PermissionsAndroid, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native';
import { Dimensions, StyleSheet, Modal } from 'react-native';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'rn-fetch-blob';

function App() {
  const [pasteURL, setPasteURL] = useState<string>('');
  const [pdfVisible, setPdfVisible] = useState<boolean>(false);

  const downloadFile = () => {
    const { config, fs } = RNFetchBlob;
    const date = new Date();
    const fileDir = fs.dirs.DownloadDir;
    config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          fileDir +
          '/download_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          '.pdf',
        description: 'File downloaded by download manager.',
      },
    })
      .fetch('GET', pasteURL, {
        //some headers ..
      })
      .then((res) => {
        // the temp file path
        console.log('The file saved to ', res.path());
        Alert.alert('file downloaded successfully');
      });
  };

  return (
    <NativeBaseProvider>
      <Box justifyContent="center" alignItems="center" flex={1}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={pdfVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setPdfVisible(!pdfVisible);
          }}
        >
          <Box style={styles.centeredView}>
            <Box style={styles.modalView}>
              <TouchableOpacity onPress={() => setPdfVisible(!pdfVisible)}>
                <Text color="grey" right={0} marginBottom={2}>
                  Close View
                </Text>
              </TouchableOpacity>
              <Pdf
                trustAllCerts={false}
                source={{
                  uri: pasteURL,
                  cache: true,
                }}
                onLoadComplete={(numberOfPages, filePath) => {
                  console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                  console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                  console.log(error);
                }}
                onPressLink={(uri) => {
                  console.log(`Link pressed: ${uri}`);
                }}
                style={styles.pdf}
              />
            </Box>
          </Box>
        </Modal>
        <TextInput
          style={{
            height: 40,
            width: '50%',
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 20,
            paddingLeft: 20,
          }}
          placeholder="Paste your link"
          onChangeText={(text) => setPasteURL(text)}
        />
        <TouchableOpacity
          style={{
            height: 40,
            width: '50%',
            backgroundColor: '#48C9B0',
            borderColor: 'white',
            borderWidth: 1,
            borderRadius: 20,
            paddingLeft: 20,
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            if (pasteURL !== '') {
              setPdfVisible(true);
            } else {
              Alert.alert('Please paste your link');
            }
          }}
        >
          <Text color="white">View Pdf</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 40,
            width: '50%',
            backgroundColor: '#F4D03F',
            borderColor: 'white',
            borderWidth: 1,
            borderRadius: 20,
            paddingLeft: 20,
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            if (pasteURL !== '') {
              downloadFile();
            } else {
              Alert.alert('Please paste your link');
            }
          }}
        >
          <Text color="white">Download</Text>
        </TouchableOpacity>
      </Box>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 'auto',
    height: 20,
    margin: 20,
    right: 0,
    position: 'absolute',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default App;
