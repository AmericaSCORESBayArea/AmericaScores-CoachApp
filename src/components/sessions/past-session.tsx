import React from 'react';
import { Pressable, Text, View } from '@/ui';
import { useRouter } from 'expo-router';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';
import { LocationSVG } from '@/ui/icons/location';
import { TimeSVG } from '@/ui/icons/time';
import { DoubleTakeAttendanceSVG } from '@/ui/icons/double-take-attendance';
import { SoccerSVG } from '@/ui/icons/soccer';

import typography from '@/metrics/typography';
import type { GetAllSessions } from '@/interfaces/entities/session/sessions-entities';
import { format } from 'date-fns';
interface PastSessionTaskProps {
  item: GetAllSessions;
}

const PastSession: React.FC<PastSessionTaskProps> = ({ item }) => {
  const router = useRouter();

  // const navigationHandler = () => {
  //   router.push(item.navigation);
  // };
  const sessionStartTime = item.SessionStartTime
    ? item.SessionStartTime
    : '14:00:00.000Z'; // Fallback for testing

  // Create a valid Date object using a fixed date
  const dateString = `1970-01-01T${sessionStartTime}`; // Combine with a date
  const dateObject = new Date(dateString);
  return (
    <Pressable
      className="my-2 w-full rounded-sm bg-white"
      // onPress={navigationHandler}
    >
      {/* Title with dynamic font size */}
      <View className="flex-row items-center justify-between p-4">
        <Text style={typography.style.heading}>{item.TeamSeasonName}</Text>
        <ArrowForwardSVG
          height={typography.iconSizes.md}
          width={typography.iconSizes.md}
        />
      </View>

      <View className="px-4">
        {/* Location */}
        <View className="my-1 flex-row items-center">
          <LocationSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          {/* <Text style={typography.style.subHeadingLarge}>{item.location}</Text> */}
          <Text style={typography.style.subHeadingLarge}>Albhany School</Text>
        </View>

        {/* Time */}
        <View className="my-1 flex-row items-center">
          <TimeSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          <Text style={typography.style.subHeadingLarge}>
            {item.Weekday}, {format(dateObject, 'hh:mm a')}
          </Text>
        </View>

        {/* Attendance */}
        <View className="my-1 flex-row items-center">
          <DoubleTakeAttendanceSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          <Text style={typography.style.subHeadingLarge}>
            {parseInt(item.StudentsPresent, 10)}/24
          </Text>
        </View>

        {/* Hobbies */}
        <View className="my-1 flex-row items-center">
          {item.SessionTopic.replace(/['"]+/g, '') // Remove quotes from the string
            .split(',') // Split the string into an array
            .map((hobby, index) => {
              const trimmedHobby = hobby.trim(); // Trim any whitespace

              return (
                <View
                  key={index}
                  className="mx-2 flex-row items-center rounded-2xl bg-slate-200 px-3"
                >
                  <SoccerSVG
                    height={typography.iconSizes.md}
                    width={typography.iconSizes.md}
                  />
                  <Text style={typography.style.subHeadingLarge}>
                    {trimmedHobby}
                  </Text>
                </View>
              );
            })}
        </View>
      </View>
    </Pressable>
  );
};

export default PastSession;
