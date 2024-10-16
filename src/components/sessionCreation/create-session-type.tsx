import { Checkbox, Text } from '@/ui'; // Ensure this is the correct path for your Checkbox component
import React, { useState } from 'react';
import { View } from 'react-native';

import { SoccerSVG } from '@/ui/icons/soccer';
import { PoetrySVG } from '@/ui/icons/poety';
import { GameDaySVG } from '@/ui/icons/game-day';
import typography from '@/metrics/typography';

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
        className="flex-row items-center" // Ensure the checkbox is aligned properly
      >
        <Checkbox.Icon checked={checked} />
        {item.icon === 'Soccer' && (
          <SoccerSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
            className="ml-4"
          />
        )}
        {item.icon === 'Poetry' && (
          <PoetrySVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
        )}
        {item.icon === 'GameDay' && (
          <GameDaySVG
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

export default CreateSessionType;
