import { Checkbox, CheckboxIcon, colors } from '@/ui'; // Ensure this is the correct path for your Checkbox component
import React, { useState } from 'react';
import { Text, View } from 'react-native';

import { TakeAttendenceSVG } from '@/ui/icons/take-attendence';
import { RecordVideoSVG } from '@/ui/icons/record-video';
import { RecordPacerSVG } from '@/ui/icons/record-pacer';
import typography from '@/metrics/typography';

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
          <TakeAttendenceSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
        )}
        {item.icon === 'RecordVideo' && (
          <RecordVideoSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
        )}
        {item.icon === 'RecordPacer' && (
          <RecordPacerSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
        )}

        <Text style={typography.style.heading} className="ml-2">
          {item.name}
        </Text>
      </Checkbox.Root>
    </View>
  );
};

export default CreateSessionTask;
