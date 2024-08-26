import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import React, { useCallback, useRef, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { ImageBackground, Pressable } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import * as z from 'zod';

import {
  Button,
  colors,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/ui';
const schema = z.object({
  name: z.string().optional(),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

export const LoginForm = ({ onSubmit = () => {} }: LoginFormProps) => {
  const { handleSubmit } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const [signInOptions, setSignInOptions] = useState<string>('');

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const signInOptionsHandler = (option: string) => {
    if (option === 'Continue') {
      handleSubmit(onSubmit);
    }
    setSignInOptions(option);
    bottomSheetRef.current?.expand();
  };
  const handleClosePress = () => {
    bottomSheetRef.current?.close();
    setSignInOptions('');
  };

  const Head = ({ opacity = 0.6, paddingHorizontal = 0 }) => {
    return (
      <View
        className={`h-[8%] w-full justify-center  bg-white`}
        style={{ opacity, paddingHorizontal }}
      >
        <Text className="font-bold opacity-100">Log in</Text>
        <Text className="font-medium opacity-100">
          America Scores Attendance App
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <FocusAwareStatusBar />

      <ImageBackground
        source={require('../../assets/LogInBackground.jpeg')}
        className="boder-2 fixed flex-1 flex-col justify-center border-b-blue-800 "
      >
        <View className=" mx-2.5 h-4/5 items-center">
          <Head paddingHorizontal={10} />
          <View className="h-4/5 w-full items-center justify-center bg-white object-contain opacity-60">
            <Image
              className="h-full w-full"
              source={require('../../assets/ASBA_Logo.jpg')}
            />
          </View>
          <View className="mx-2.5 h-[12%] w-full items-center   justify-center bg-white ">
            <Pressable
              className="my-1.5 w-3/6  flex-row justify-between "
              onPress={() => {
                signInOptionsHandler('Google');
              }}
            >
              <FontAwesome name="google" size={22} color={colors.danger[700]} />
              <Text className="font-bold text-danger-700 ">
                SIGN IN WITH GOOGLE
              </Text>
            </Pressable>
            <Pressable
              className="my-1.5 w-3/6 flex-row justify-between "
              onPress={() => {
                signInOptionsHandler('Phone');
              }}
            >
              <FontAwesome name="phone" size={22} color={colors.primary[700]} />

              <Text className="font-bold text-primary-700 ">
                SIGN IN WITH PHONE
              </Text>
            </Pressable>
          </View>
        </View>

        {signInOptions === 'Phone' && (
          <View className="absolute inset-0">
            <BottomSheet
              ref={bottomSheetRef}
              onChange={handleSheetChanges}
              snapPoints={['90%']}
            >
              <BottomSheetView className="flex-1 ">
                <Head opacity={1} paddingHorizontal={24} />

                <View className="w-full border-b-2 border-b-gray-400" />
                <View className="h-[70%]">
                  <View className="mt-2 px-6 ">
                    <Text>
                      If your phone number is register with SCORES,we will send
                      a verifcation code to that number for you to use in the
                      next step.
                    </Text>
                  </View>
                  <View className="mt-2 px-6">
                    <Text className="color-gray-400 ">Phone number</Text>
                    <TextInput
                      className="rounded-md border-2 border-gray-400 bg-gray-50 p-2"
                      maxLength={10}
                      keyboardType="numeric"
                      placeholder="64666000404 (numbers only)"
                    />
                  </View>
                </View>

                <View className='" absolute bottom-0 h-[15%]  w-full'>
                  <View className="w-full border-b-2 border-b-gray-400" />

                  <Button
                    label="Go Back"
                    loading={false}
                    variant="secondary"
                    size="default"
                    className="w-full bg-white color-red-400  "
                    textClassName="color-gray-400 font-bold"
                    onPress={() => {
                      // signInOptionsHandler('Google');
                      handleClosePress();
                    }}
                    icon={
                      <Ionicons name="chevron-back" size={24} color="black" />
                    }
                  />
                  <Button
                    label="SIGN IN WITH PHONE"
                    loading={false}
                    variant="default"
                    size="default"
                    className="w-full bg-blue-900"
                    onPress={() => {
                      signInOptionsHandler('Phone1');
                    }}
                    icon={
                      <FontAwesome
                        name="phone"
                        size={22}
                        color={colors.black[800]}
                        className="mr-4"
                      />
                    }
                  />
                </View>
                {/* </View> */}
              </BottomSheetView>
            </BottomSheet>
          </View>
        )}

        {signInOptions === 'Phone1' && (
          <View className="absolute inset-0">
            <BottomSheet
              ref={bottomSheetRef}
              onChange={handleSheetChanges}
              snapPoints={['90%']}
            >
              <BottomSheetView className="flex-1 ">
                <Head opacity={1} paddingHorizontal={24} />

                <View className="w-full border-b-2 border-b-gray-400" />
                <View className="h-[70%]">
                  <View className="mt-2 px-6 ">
                    <Text>insert the recive card</Text>
                  </View>
                  <View className="mt-2 px-6">
                    <Text className="color-gray-400 ">code</Text>
                    <TextInput
                      className="rounded-md border-2 border-gray-400 bg-gray-50 p-2"
                      maxLength={10}
                      keyboardType="numeric"
                      placeholder="64666000404 (numbers only)"
                    />
                  </View>
                </View>

                <View className='" absolute bottom-0 h-[15%]  w-full'>
                  <View className="w-full border-b-2 border-b-gray-400" />

                  <Button
                    label="Go Back"
                    loading={false}
                    variant="secondary"
                    size="default"
                    className="w-full bg-white color-red-400  "
                    textClassName="color-gray-400 font-bold"
                    onPress={() => {
                      // signInOptionsHandler('Google');
                      handleClosePress();
                    }}
                    icon={
                      <Ionicons name="chevron-back" size={24} color="black" />
                    }
                  />
                  <Button
                    label="Continue"
                    loading={false}
                    variant="default"
                    size="default"
                    className="w-full bg-blue-900 "
                    onPress={() => {
                      signInOptionsHandler('Continue');
                    }}
                    icon={
                      <FontAwesome
                        name="phone"
                        size={22}
                        color={colors.black[800]}
                        className="mr-4"
                      />
                    }
                  />
                </View>
                {/* </View> */}
              </BottomSheetView>
            </BottomSheet>
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};
