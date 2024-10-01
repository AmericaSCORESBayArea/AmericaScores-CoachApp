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
import { Select } from '@/ui';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  personalTaskAddDetailTask,
  personalTaskCreation,
  sessionOptions,
} from '@/data/data-base';

import CreatePersonalAddDetail from '@/components/personalTaskCreation/create-personal-add-detail-task';
import CreatePersonalType from '@/components/personalTaskCreation/create-personal-type';
import CreatePersonalTaskSaveBtn from '@/components/buttons/personalTaskCreation/create-personal-task-save-btn';
import CreatePersonalCheckBalanceBtn from '@/components/buttons/personalTaskCreation/create-personal-check-balance';
import { ArrowDownSVG } from '@/ui/icons/arrow-down';

const CreatePersonalTask = () => {
  const navigation = useNavigation();
  const [value, setValue] = useState<string | number | undefined>();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [personalTaskType, setPersonalTaskType] = useState<number>(0);
  const [personalTaskAddDetail, setPersonalTaskAddDetail] = useState<number>(0);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#EEF0F8',
      },
      headerTitle: 'New Task',
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
        <View className=" mx-3 mt-5 items-center rounded-md border border-gray-400 p-3">
          <Text>Task Title</Text>
        </View>
        <View className="mx-3 my-2">
          <Select
            placeholder="Select a session (Optional)"
            options={sessionOptions}
            value={value}
            onSelect={(option) => setValue(option)}
          />
        </View>

        <View className="mx-3 flex-row items-center justify-between">
          <View className="my-4 w-2/5">
            <Text className="text-md text-gray-700">Due Date (Optional)</Text>
            <Pressable
              className="flex-row items-center justify-between rounded-md border border-gray-400 p-2"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className="text-black">{date.toLocaleDateString()}</Text>
              <ArrowDownSVG height={24} width={24} />
            </Pressable>
          </View>

          <View className="mx-3 my-4 w-2/5">
            <Text className="text-md text-gray-700">Time (Optional)</Text>
            <Pressable
              className="flex-row items-center justify-between rounded-md border border-gray-400 p-2"
              onPress={() => setShowTimePicker(true)}
            >
              <Text className="text-black">{time.toLocaleTimeString()}</Text>
              <ArrowDownSVG height={24} width={24} />
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
              <View className="w-4/5 rounded-lg bg-white p-4">
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                />
                <Pressable
                  onPress={() => setShowDatePicker(false)}
                  className="mt-4 rounded bg-red-500 p-2"
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
              <View className="w-4/5 rounded-lg bg-white p-4">
                <DateTimePicker
                  value={time}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                />
                <Pressable
                  onPress={() => setShowTimePicker(false)}
                  className="mt-4 rounded bg-red-500 p-2"
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
        <Text className="text-sm font-extrabold text-gray-700">TYPES</Text>
      </View>
      <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
        <FlatList
          data={personalTaskCreation}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CreatePersonalType
              item={item}
              setPersonalTaskType={setPersonalTaskType}
            />
          )}
          contentContainerStyle={{
            paddingVertical: 8,
          }}
        />
      </View>

      <View className="mx-6 my-2">
        <Text className="text-sm font-extrabold text-gray-700">
          ADD DETAILS
        </Text>
      </View>
      <View className="mx-6 flex-1 rounded-sm bg-[#EEF0F8]">
        <FlatList
          data={personalTaskAddDetailTask}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CreatePersonalAddDetail
              item={item}
              setPersonalTaskAddDetail={setPersonalTaskAddDetail}
            />
          )}
          contentContainerStyle={{
            paddingVertical: 8,
          }}
        />
      </View>

      <CreatePersonalCheckBalanceBtn
        typeItem={{ personalTaskType }}
        taskItem={{ personalTaskAddDetail }}
      />
      <CreatePersonalTaskSaveBtn
        typeItem={{ personalTaskType }}
        taskItem={{ personalTaskAddDetail }}
      />
    </ScrollView>
  );
};

export default CreatePersonalTask;
