/* eslint-disable radix */
/* eslint-disable @typescript-eslint/no-shadow */
import { View, Text, Pressable } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LocationSVG } from '@/ui/icons/location';
import { TimeSVG } from '@/ui/icons/time';
import { SoccerSVG } from '@/ui/icons/soccer';
import typography from '@/metrics/typography';
import type { GetAllSessions } from '@/interfaces/entities/session/sessions-entities';
import { format, parseISO } from 'date-fns';

interface SessionProps {
  item: GetAllSessions;
}

const SessionsIndex: React.FC<SessionProps> = ({ item }) => {
  const router = useRouter();

  // Fallback for missing SessionStartTime
  const sessionStartTime = item.SessionStartTime || ''; // Empty if not provided
  let formattedTime = 'No Time Available'; // Default message

  // Use date-fns to format time
  if (sessionStartTime) {
    try {
      const [hours, minutes] = sessionStartTime.split(':');
      const timeObject = new Date();
      timeObject.setHours(parseInt(hours), parseInt(minutes));
      formattedTime = format(timeObject, 'hh:mm a'); // Format as '12:00 PM'
    } catch (error) {
      console.error('Error formatting time:', error);
    }
  }

  // Format the SessionDate
  const sessionDate = item.SessionDate ? parseISO(item.SessionDate) : null;
  const formattedDate = sessionDate
    ? format(sessionDate, 'MMMM d, yyyy')
    : 'No Date Available';

  // Navigation handler
  const navigationHandler = (item: string) => {
    if (item === 'session-details') {
      router.push('session-details');
    } else if (item === 'team-season') {
      router.push('team-season');
    }
  };

  return (
    <Pressable className="my-2 w-full rounded-sm bg-white">
      {/* Title with dynamic font size */}
      <Pressable className="flex-row items-center justify-between p-4">
        <Text style={typography.style.heading}>{item.TeamSeasonName}</Text>
      </Pressable>

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
            {item.Weekday}, {formattedTime} {formattedDate}
          </Text>
        </View>

        {/* Session Topics */}
        <View className="my-1 flex-row">
          {item.SessionTopic.replace(/['"]+/g, '')
            .split(',')
            .map((topic, index) => {
              const trimmedTopic = topic.trim();

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
                    {trimmedTopic}
                  </Text>
                </View>
              );
            })}
        </View>
      </View>
    </Pressable>
  );
};

export default SessionsIndex;
