/* eslint-disable react-native/no-inline-styles */
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import LaterTask from '@/components/task/later-task';
import WeekTask from '@/components/task/week-task';
import { laterTaskData, weekTaskData } from '@/data/data-base';
import { ScrollView, Text, View } from '@/ui';
import { AntDesign } from '@expo/vector-icons';
import { Dimensions, FlatList } from 'react-native';

export default function Tasks() {
  const router = useRouter();
  const { width } = Dimensions.get('window'); // Get screen width
  const isTablet = width >= 768; // Define tablet based on width

  const titleTextSize = isTablet ? 'text-2xl' : 'text-sm'; // Define the text size class for title

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
      headerTitle: '',
    });
  }, [navigation]);

  const navigationHandler = (item: string) => {
    if (item === 'create-personal-task') router.push('create-personal-task');
  };

  return (
    <>
      <ScrollView className="flex-1 bg-[#EEF0F8]">
        <View className="ml-6">
          <Text className={`my-3 font-bold text-[#737373] ${titleTextSize} `}>
            DUE THIS WEEK
          </Text>
        </View>
        <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
          <FlatList
            data={weekTaskData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <WeekTask item={item} />}
            contentContainerStyle={{
              paddingVertical: 8,
            }}
          />
        </View>
        <View className="ml-6">
          <Text className={`my-3 font-bold text-[#737373] ${titleTextSize} `}>
            LATER
          </Text>
        </View>
        <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
          <FlatList
            data={laterTaskData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <LaterTask item={item} />}
            contentContainerStyle={{
              paddingVertical: 8,
            }}
          />
        </View>
      </ScrollView>
      <AntDesign
        name="pluscircle"
        size={isTablet ? 80 : 40}
        color="#004680"
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}
        onPress={() => navigationHandler('create-session')}
      />
    </>
  );
}
