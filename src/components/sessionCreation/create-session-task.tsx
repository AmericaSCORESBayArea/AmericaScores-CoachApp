import { Checkbox, CheckboxIcon, colors } from '@/ui'; // Ensure this is the correct path for your Checkbox component
import React, { useState } from 'react';
import { Text, View, Dimensions } from 'react-native';

import { TakeAttendenceSVG } from '@/ui/icons/take-attendence';
import { RecordVideoSVG } from '@/ui/icons/record-video';
import { RecordPacerSVG } from '@/ui/icons/record-pacer';

interface CreateSessionTaskType {
  id: number;
  name: string;
  icon: string;
}

interface CreateSessionTaskProps {
  item: CreateSessionTaskType;
  setSessionTask: React.Dispatch<React.SetStateAction<number>>; // Function to update attendance count
}

const CreateSessionTask: React.FC<CreateSessionTaskProps> = ({
  item,
  setSessionTask,
}) => {
  const [checked, setChecked] = useState<boolean>(false);

  // Get the screen dimensions
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768; // Adjust this value based on your definition of a tablet

  // Define dynamic sizes
  const iconSize = isTablet ? 55 : 24; // Increase icon size for tablets
  const textSize = isTablet ? 'text-3xl' : 'text-sm'; // Use Tailwind classes for text size

  const handleToggle = () => {
    setChecked((prevChecked) => {
      const newChecked = !prevChecked;
      setSessionTask((prevCount) => prevCount + (newChecked ? 1 : -1)); // Increment or decrement the count
      return newChecked;
    });
  };

  return (
    <View className="w-full flex-row rounded-sm bg-white p-4">
      <Checkbox.Root
        onChange={handleToggle}
        accessibilityLabel={`Toggle attendance for ${item.name}`}
        checked={checked}
        className="flex-row items-center" // Ensure the checkbox is aligned properly
      >
        <Checkbox.Icon checked={checked} />
        {item.icon === 'TakeAttendence' && (
          <TakeAttendenceSVG height={iconSize} width={iconSize} />
        )}
        {item.icon === 'RecordVideo' && (
          <RecordVideoSVG height={iconSize} width={iconSize} />
        )}
        {item.icon === 'RecordPacer' && (
          <RecordPacerSVG height={iconSize} width={iconSize} />
        )}

        <Text className={`${textSize} ml-2`}>{item.name}</Text>
      </Checkbox.Root>
    </View>
  );
};

export default CreateSessionTask;
