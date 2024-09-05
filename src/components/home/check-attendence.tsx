import React from 'react';
import { Text, View } from 'react-native';

interface TakeAttendenceType {
  id: number;
  name: string;
}

interface TakeAttendenceProps {
  item: TakeAttendenceType;
}

const CheckAttendence: React.FC<TakeAttendenceProps> = ({ item }) => {
  return (
    <View className="w-full rounded-sm  bg-white p-4">
      {/* <Check /> */}
      {/* <Checkbox  /> */}
      <Text>{item.name}</Text>
    </View>
  );
};

export default CheckAttendence;
