import { Checkbox } from '@/ui'; // Ensure this is the correct path for your Checkbox component
import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';

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

  // Get the screen dimensions
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768; // Adjust this value based on your definition of a tablet

  // Define dynamic sizes
  const iconSize = isTablet ? 55 : 24; // Increase icon size for tablets
  const textSize = isTablet ? 'text-3xl' : 'text-sm'; // Use Tailwind classes for text size

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
          <SoccerSVG height={iconSize} width={iconSize} className="ml-4" />
        )}
        {item.icon === 'Poetry' && (
          <PoetrySVG height={iconSize} width={iconSize} />
        )}
        {item.icon === 'GameDay' && (
          <GameDaySVG height={iconSize} width={iconSize} />
        )}
        <Checkbox.Label text={item.name} className={`${textSize} ml-2`} />
        {/* Apply dynamic text size using Tailwind */}
      </Checkbox.Root>
    </View>
  );
};

export default CreateSessionType;
