import React from 'react';
import { Pressable, Text, View, ActivityIndicator } from '@/ui'; // Import ActivityIndicator for loading state
import { useRouter } from 'expo-router';
import { ArrowForwardSVG } from '@/ui/icons/arrow-forward';
import { LocationSVG } from '@/ui/icons/location';
import { TimeSVG } from '@/ui/icons/time';
import { DoubleTakeAttendanceSVG } from '@/ui/icons/double-take-attendance';
import { SoccerSVG } from '@/ui/icons/soccer';

import typography from '@/metrics/typography';
import type { GetAllSessions } from '@/interfaces/entities/session/sessions-entities';
import { format } from 'date-fns';

interface UpComingSessionTaskProps {
  item: GetAllSessions;
}

const UpComingSession: React.FC<UpComingSessionTaskProps> = ({ item }) => {
  const router = useRouter();

  const sessionStartTime = item.SessionStartTime || ''; // Empty if not provided
  let formattedTime = 'No Time Available'; // Default message

  if (sessionStartTime) {
    // Extract hours and minutes directly if time is provided
    const [hours, minutes] = sessionStartTime.split(':');
    const timeObject = new Date();
    timeObject.setHours(parseInt(hours), parseInt(minutes));

    // Format the time using 'date-fns'
    formattedTime = format(timeObject, 'hh:mm a');
  }

  // If loading, show a loading indicator

  return (
    <Pressable className="my-2 w-full rounded-sm bg-white">
      {/* Title with dynamic font size */}
      <View className="flex-row items-center justify-between p-4">
        <Text style={typography.style.heading}>{item.TeamSeasonName}</Text>
        <ArrowForwardSVG
          height={typography.iconSizes.md}
          width={typography.iconSizes.md}
        />
      </View>

      <View className="px-4 ">
        {/* Location */}
        <View className="my-1 flex-row items-center">
          <LocationSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          <Text style={typography.style.subHeadingLarge}>Albhany School</Text>
        </View>

        {/* Time */}
        <View className="my-1 flex-row items-center">
          <TimeSVG
            height={typography.iconSizes.md}
            width={typography.iconSizes.md}
          />
          <Text style={typography.style.subHeadingLarge}>
            {item.Weekday}, {formattedTime} {item.SessionDate}
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
        <View className="my-1 flex-row">
          {item.SessionTopic.replace(/['"]+/g, '')
            .split(',')
            .map((hobby, index) => {
              const trimmedHobby = hobby.trim();

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

export default UpComingSession;
