import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import React, { useCallback, useRef, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Button, ImageBackground, Pressable, StatusBar } from 'react-native';
import * as z from 'zod';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { colors, FocusAwareStatusBar, SafeAreaView, Text, View } from '@/ui';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
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
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const [signInOptions, setSignInOptions] = useState<string>('');

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const signInOptionsHandler = (option: string) => {
    console.log('options : ', option);
    setSignInOptions(option);
    bottomSheetRef.current?.expand();
  };
  const handleClosePress = () => {
    bottomSheetRef.current?.close();
    setSignInOptions('');
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FocusAwareStatusBar />

      {signInOptions === '' && (
        <ImageBackground
          source={require('../../assets/LogInBackground.jpeg')}
          className="flex-1 flex-col fixed justify-center border-b-blue-800 boder-2 "
        >
          <View className=" h-4/5 items-center mx-2.5">
            <View
              // style={styles.textContainer}
              className="h-[8%] w-full justify-center pl-2.5 opacity-60 bg-white z-50"
            >
              <Text className="font-bold opacity-100 ">Log in</Text>
              <Text className="font-medium opacity-100">
                America Scores Attendence App
              </Text>
            </View>
            <View className="h-[80%] w-full opacity-60 bg-white items-center justify-center object-contain">
              <Image
                className="h-full w-full"
                source={require('../../assets/ASBA_Logo.jpg')}

                // transition={1000}
              />
            </View>
            <View className="h-[12%] w-full items-center justify-center   bg-white mx-2.5 ">
              <Pressable
                className="flex-row w-3/6  justify-between my-1.5 "
                onPress={() => {
                  signInOptionsHandler('Google');
                }}
              >
                <FontAwesome
                  name="google"
                  size={22}
                  color={colors.danger[700]}
                />
                <Text className="text-danger-700 font-bold ">
                  SIGN IN WITH GOOGLE
                </Text>
              </Pressable>
              <View className="flex-row w-3/6 justify-between my-1.5 ">
                <FontAwesome
                  name="phone"
                  size={22}
                  color={colors.primary[700]}
                />

                <Text className="text-primary-700 font-bold ">
                  SIGN IN WITH PHONE
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      )}
      {signInOptions === 'Google' && (
        <ImageBackground
          source={require('../../assets/LogInBackground.jpeg')}
          className="flex-1 flex-col fixed justify-center border-b-blue-800 boder-2 "
        >
          <View className="flex-1 p-6 ">
            {/* <Button title="Close Sheet" onPress={handleClosePress} /> */}
            <BottomSheet
              ref={bottomSheetRef}
              onChange={handleSheetChanges}
              snapPoints={['90%']}
            >
              <FontAwesome
                name="close"
                size={24}
                color="black"
                className="self-end mr-1"
                onPress={handleClosePress}
              />
              <BottomSheetView className="flex-1  items-center">
                <Text>Awesome 🎉</Text>
              </BottomSheetView>
            </BottomSheet>
          </View>
        </ImageBackground>
      )}
    </SafeAreaView>
  );
};
