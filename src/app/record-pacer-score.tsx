/* eslint-disable react/no-unstable-nested-components */
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { FocusAwareStatusBar } from '@/ui';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const RecordPacerScore = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
      headerTitle: 'Record Pacer Score',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} className="ml-4">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <View className="flex-1 bg-[#EEF0F8]">
      <FocusAwareStatusBar />
      <Text>RecordPacerScore</Text>
    </View>
  );
};

export default RecordPacerScore;
