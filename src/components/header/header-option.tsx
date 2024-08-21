import { Link } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

import { Text } from '@/ui';

const CreateNewPostLink = () => {
  return (
    <Link href="/feed/add-post" asChild>
      <Pressable>
        <Text className="px-3 text-primary-300">Create</Text>
      </Pressable>
    </Link>
  );
};

export default CreateNewPostLink;
