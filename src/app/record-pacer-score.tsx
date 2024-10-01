/* eslint-disable react/no-unstable-nested-components */
import { Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { FocusAwareStatusBar } from '@/ui';
import { useNavigation } from 'expo-router';
import { ArrowBackwardSVG } from '@/ui/icons/arrow-backward';

const RecordPacerScore = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
      headerTitle: 'Record Pacer Score',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} className="mx-4">
          <ArrowBackwardSVG height={24} width={24} />
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
