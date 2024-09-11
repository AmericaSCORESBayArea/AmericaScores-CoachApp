import { Checkbox, CheckboxIcon, colors } from '@/ui'; // Ensure this is the correct path for your Checkbox component
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Soccer } from '@/ui/icons/soccer';
import { Poetry } from '@/ui/icons/poety';
import { GameDay } from '@/ui/icons/game-day';

interface CreateSession {
  id: number;
  name: string;
  icon: string;
}

interface SessionProps {
  item: CreateSession;
  setSessionType: React.Dispatch<React.SetStateAction<number>>; // Function to update attendance count
}

const CreateSessionType: React.FC<SessionProps> = ({
  item,
  setSessionType,
}) => {
  const [checked, setChecked] = useState<boolean>(false);

  const handleToggle = () => {
    setChecked((prevChecked) => {
      const newChecked = !prevChecked;
      setSessionType((prevCount) => prevCount + (newChecked ? 1 : -1)); // Increment or decrement the count
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
        {item.icon === 'Soccer' && <Soccer height={24} width={24} />}
        {item.icon === 'Poetry' && <Poetry height={24} width={24} />}
        {item.icon === 'GameDay' && <GameDay height={24} width={24} />}

        <Checkbox.Label text={item.name} />
      </Checkbox.Root>
    </View>
  );
};

export default CreateSessionType;
