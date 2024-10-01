/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Select } from '@/ui';
import DateTimePicker from '@react-native-community/datetimepicker';

import CreateSessionSaveBtn from '@/components/buttons/createSession/create-session-save-btn';
import CreateSessionTask from '@/components/sessionCreation/create-session-task';
import CreateSessionType from '@/components/sessionCreation/create-session-type';
import {
  createSessionTask,
  sessionCreation,
  teamOptions,
} from '@/data/data-base';

const CreateSession = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState<string | number | undefined>();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [sessionType, setSessionType] = useState<number>(0);
  const [sessionTask, setSessionTask] = useState<number>(0);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
      headerTitle: 'New Session',
    });
  }, [navigation]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) setTime(selectedTime);
  };

  return (
    <ScrollView className="flex-1 bg-[#EEF0F8]">
      <View className="mx-6 my-2 flex-1 rounded-md bg-white">
        <View className="mx-3 my-2">
          <Select
            label="Team"
            options={teamOptions}
            value={value}
            onSelect={(option) => setValue(option)}
          />
        </View>

        <View className="mx-3 flex-row items-center justify-between">
          <View className="my-4 w-2/5">
            <Text className="text-lg text-gray-700"> Date</Text>
            <Pressable
              className="flex-row justify-between rounded-md border border-gray-400 p-2"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-black">{date.toLocaleDateString()}</Text>
              <SimpleLineIcons name="arrow-down" size={18} color="black" />
            </Pressable>
          </View>

          <View className="mx-3 my-4 w-2/5">
            <Text className="text-lg text-gray-700"> Time</Text>
            <Pressable
              className="flex-row justify-between rounded-md border border-gray-400 p-2"
              onPress={() => setShowTimePicker(true)}
            >
              <Text className="text-black">{time.toLocaleTimeString()}</Text>
              <SimpleLineIcons name="arrow-down" size={18} color="black" />
            </Pressable>
          </View>
        </View>

        {/* Date Picker Modal */}
        {Platform.OS === 'ios' && showDatePicker && (
          <Modal
            transparent={true}
            visible={showDatePicker}
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.5)] ">
              <View className="w-4/5 rounded-lg bg-white p-6">
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                />
                <Pressable
                  onPress={() => setShowDatePicker(false)}
                  className="mt-4 rounded bg-red-500 p-3"
                >
                  <Text className="text-center text-lg text-white">Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}

        {/* Time Picker Modal */}
        {Platform.OS === 'ios' && showTimePicker && (
          <Modal
            transparent={true}
            visible={showTimePicker}
            animationType="slide"
            onRequestClose={() => setShowTimePicker(false)}
          >
            <View className="flex-1 items-center justify-center bg-black/50">
              <View className="w-4/5 rounded-lg bg-white p-6">
                <DateTimePicker
                  value={time}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                />
                <Pressable
                  onPress={() => setShowTimePicker(false)}
                  className="mt-4 rounded bg-red-500 p-3"
                >
                  <Text className="text-center text-lg text-white">Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}

        {/* Default Date and Time Pickers for Android */}
        {Platform.OS === 'android' && (
          <>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </>
        )}
      </View>

      <View className="mx-6 my-2">
        <Text className="text-sm font-semibold text-gray-700">TYPES</Text>
      </View>
      <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
        <FlatList
          data={sessionCreation}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CreateSessionType item={item} setSessionType={setSessionType} />
          )}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>

      <View className="mx-6 my-2">
        <Text className="text-sm font-semibold text-gray-700">CREATE TASK</Text>
      </View>
      <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
        <FlatList
          data={createSessionTask}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CreateSessionTask item={item} setSessionTask={setSessionTask} />
          )}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>

      <CreateSessionSaveBtn
        typeItem={{ sessionType }}
        taskItem={{ sessionTask }}
      />
    </ScrollView>
  );
};

export default CreateSession;
