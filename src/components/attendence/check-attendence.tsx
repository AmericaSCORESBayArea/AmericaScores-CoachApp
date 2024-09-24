import { Checkbox } from '@/ui'; // Ensure this is the correct path for your Checkbox component
import React, { useState } from 'react';
import { Text, View } from 'react-native';

interface TakeAttendenceType {
  id: number;
  name: string;
}

interface TakeAttendenceProps {
  item: TakeAttendenceType;
  setAttendenceCount: React.Dispatch<React.SetStateAction<number>>; // Function to update attendance count
}

const CheckAttendence: React.FC<TakeAttendenceProps> = ({
  item,
  setAttendenceCount,
}) => {
  const [checked, setChecked] = useState<boolean>(false);

  const handleToggle = () => {
    setChecked((prevChecked) => {
      const newChecked = !prevChecked;
      setAttendenceCount((prevCount) => prevCount + (newChecked ? 1 : -1)); // Increment or decrement the count
      return newChecked;
    });
  };

  return (
    <View className="w-full rounded-sm bg-white p-4">
      <Checkbox
        checked={checked}
        onChange={handleToggle}
        label={item.name}
        accessibilityLabel={`Toggle attendance for ${item.name}`}
      />
    </View>
  );
};

export default CheckAttendence;
