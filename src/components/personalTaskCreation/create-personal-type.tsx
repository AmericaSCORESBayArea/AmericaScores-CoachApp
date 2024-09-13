import { Checkbox, CheckboxIcon, colors } from '@/ui'; // Ensure this is the correct path for your Checkbox component
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SoccerSVG } from '@/ui/icons/soccer';
import { PoetrySVG } from '@/ui/icons/poety';
import { GameDaySVG } from '@/ui/icons/game-day';
import { HumanResourcesSVG } from '@/ui/icons/human-resources';
import { PersonalSVG } from '@/ui/icons/personal';

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
          <SoccerSVG height={24} width={24} />
        )}
        {item.icon === 'SCORES Human Resources' && (
          <HumanResourcesSVG height={24} width={24} />
        )}
        {item.icon === 'Personal' && <PersonalSVG height={24} width={24} />}

        <Checkbox.Label text={item.name} />
      </Checkbox.Root>
    </View>
  );
};

export default CreatePersonalType;
