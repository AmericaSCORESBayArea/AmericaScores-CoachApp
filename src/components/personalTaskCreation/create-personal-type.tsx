import { Checkbox, Text } from '@/ui'; // Ensure this is the correct path for your Checkbox component
import React, { useState } from 'react';
import { View } from 'react-native';
import { SoccerSVG } from '@/ui/icons/soccer';
import { HumanResourcesSVG } from '@/ui/icons/human-resources';
import { PersonalSVG } from '@/ui/icons/personal';
import typography from '@/metrics/typography';

interface CreatePersonal {
  id: number;
  name: string;
  icon: string;
}

interface CreatePersonalProps {
  item: CreatePersonal;
  setPersonalTaskType: React.Dispatch<React.SetStateAction<number>>; // Function to update attendance count
}

const CreatePersonalType: React.FC<CreatePersonalProps> = ({
  item,
  setPersonalTaskType,
}) => {
  const [checked, setChecked] = useState<boolean>(false);

  const handleToggle = () => {
    setChecked((prevChecked) => {
      const newChecked = !prevChecked;
      setPersonalTaskType((prevCount) => prevCount + (newChecked ? 1 : -1)); // Increment or decrement the count
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
        {item.icon === 'Coaching & Training' && (
          <SoccerSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
            className="ml-4"
          />
        )}
        {item.icon === 'SCORES Human Resources' && (
          <HumanResourcesSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
        )}
        {item.icon === 'Personal' && (
          <PersonalSVG
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

export default CreatePersonalType;
