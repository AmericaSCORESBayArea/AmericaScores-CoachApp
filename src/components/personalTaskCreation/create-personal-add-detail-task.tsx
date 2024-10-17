import typography from '@/metrics/typography';
import { Checkbox, Text } from '@/ui'; // Ensure this is the correct path for your Checkbox component
import React, { useState } from 'react';
import { View } from 'react-native';

interface CreatePersonalAddDetailType {
  id: number;
  name: string;
  // icon: string;
}

interface CreatePersonalAddDetailProps {
  item: CreatePersonalAddDetailType;
  setPersonalTaskAddDetail: React.Dispatch<React.SetStateAction<number>>; // Function to update attendance count
}

const CreatePersonalAddDetail: React.FC<CreatePersonalAddDetailProps> = ({
  item,
  setPersonalTaskAddDetail,
}) => {
  const [checked, setChecked] = useState<boolean>(false);

  const handleToggle = () => {
    setChecked((prevChecked) => {
      const newChecked = !prevChecked;
      setPersonalTaskAddDetail(
        (prevCount) => prevCount + (newChecked ? 1 : -1)
      );
      return newChecked;
    });
  };

  return (
    <View className="w-full flex-row rounded-sm bg-white p-4">
      <Checkbox.Root
        onChange={handleToggle}
        accessibilityLabel={`Toggle attendance for ${item.name}`}
        checked={checked}
      >
        <Checkbox.Icon checked={checked} />
        <Text style={typography.style.heading} className="ml-2">
          {item.name}
        </Text>
      </Checkbox.Root>
    </View>
  );
};

export default CreatePersonalAddDetail;
