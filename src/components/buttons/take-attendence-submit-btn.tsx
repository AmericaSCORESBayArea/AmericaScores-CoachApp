import { Pressable, Text, View } from 'react-native';
import React from 'react';

interface AttendenceSubmitType {
  attendenceCount: number;
}

interface AttendenceSubmitProps {
  item: AttendenceSubmitType;
}

const TakeAttendenceSubmitBtn: React.FC<AttendenceSubmitProps> = ({ item }) => {
  return (
    <View>
      {item.attendenceCount > 0 ? (
        <Pressable className="mx-6 mb-2 w-[90%] items-center justify-center rounded-md bg-primary-700 py-3">
          <Text className="text-white">Submit</Text>
        </Pressable>
      ) : (
        <Pressable className="mx-6 mb-2 w-[90%] items-center justify-center rounded-md py-3">
          <Text className="text-black">Submit</Text>
        </Pressable>
      )}
    </View>
  );
};

export default TakeAttendenceSubmitBtn;
