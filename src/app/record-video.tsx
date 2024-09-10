/* eslint-disable react/no-unstable-nested-components */

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';

import { FocusAwareStatusBar, SafeAreaView } from '@/ui';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const RecordVideo = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
      headerTitle: 'Record Video',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} className="ml-4">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <View className="h-full ">
      <FocusAwareStatusBar />
      <Text>RecordVideo</Text>
    </View>
  );
};

export default RecordVideo;
