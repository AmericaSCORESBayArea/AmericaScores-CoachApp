import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { LocationSVG } from '@/ui/icons/location';
import { TimeSVG } from '@/ui/icons/time';
import { DoubleTakeAttendanceSVG } from '@/ui/icons/double-take-attendance';
import { SoccerSVG } from '@/ui/icons/soccer';
import typography from '@/metrics/typography';

interface PastSeasonSessionType {
  id: number;
  title: string;
  location: string;
  time: string;
  attendence: string;
  hobby: string[];
  navigation: string;
}

interface PastSeasonSessionProps {
  item: PastSeasonSessionType;
}
const PastSeasonSession: React.FC<PastSeasonSessionProps> = ({ item }) => {
  const navigationHandler = () => {};
  return (
    <Pressable
      className="my-2 w-full rounded-sm  bg-white"
      onPress={navigationHandler}
    >
      <View className="flex-row items-center justify-between p-4">
        <Text style={typography.style.heading}>{item.title}</Text>
      </View>

      <View className="px-4">
        <View className="my-1 flex-row items-center">
          <LocationSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          <Text style={typography.style.subHeadingLarge}>{item.location}</Text>
        </View>
        <View className="my-1 flex-row items-center">
          <TimeSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          <Text style={typography.style.subHeadingLarge}>{item.time}</Text>
        </View>

        <View className="my-1 flex-row items-center">
          <DoubleTakeAttendanceSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          <Text style={typography.style.subHeadingLarge}>
            {item.attendence}
          </Text>
        </View>

        <View className="my-1 flex-row items-center">
          {item.hobby.map((hobby, index) => (
            <View
              key={index}
              className="mx-2 flex-row items-center rounded-2xl bg-slate-200 px-3"
            >
              <SoccerSVG
                height={typography.iconSizes.md}
                width={typography.iconSizes.md}
              />
              <Text style={typography.style.subHeadingLarge}>{hobby}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};

export default PastSeasonSession;
