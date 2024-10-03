import { Checkbox } from '@/ui'; // Ensure this is the correct path for your Checkbox component
import React, { useState } from 'react';
import { View } from 'react-native';
import { SoccerSVG } from '@/ui/icons/soccer';
import { PoetrySVG } from '@/ui/icons/poety';
import { GameDaySVG } from '@/ui/icons/game-day';

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
        {item.icon === 'Soccer' && (
          <SoccerSVG height={24} width={24} className="ml-4" />
        )}
        {item.icon === 'Poetry' && <PoetrySVG height={24} width={24} />}
        {item.icon === 'GameDay' && <GameDaySVG height={24} width={24} />}

        <Checkbox.Label text={item.name} />
      </Checkbox.Root>
    </View>
  );
};

export default CreateSessionType;
