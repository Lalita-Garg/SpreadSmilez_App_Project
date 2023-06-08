import React from 'react';
import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';
import {green} from './color.json';
const Loader = ({isLoading, isWaiting}) => {
  return (
    <Modal visible={isLoading} transparent={isWaiting}>
      <View
        style={[
          styles.container,
          !isWaiting
            ? {backgroundColor: 'white'}
            : {backgroundColor: '#b8b3b394'},
        ]}>
        <ActivityIndicator size={40} color={green}/>
      </View>
    </Modal>
  );
};

export default Loader;
export const WaitLoader = ({isLoading}) => {
  return (
    <Modal visible={isLoading} transparent>
      <View style={[styles.container, {backgroundColor: '#b8b3b394'}]}>
        <ActivityIndicator size={40} />
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
