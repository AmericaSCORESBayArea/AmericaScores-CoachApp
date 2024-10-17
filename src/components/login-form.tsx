/* eslint-disable max-lines-per-function */
/* eslint-disable react-native/no-inline-styles */
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, ImageBackground, Pressable } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';

import {
  Button,
  colors,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/ui';
import { router, usePathname } from 'expo-router';
import { useLogin } from '@/api/auth';

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

const LoginForm = () => {
  const [signInOptions, setSignInOptions] = useState<string>('');
  const [confirm, setConfirm] = useState<any>(null);
  const [code, setCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userDetails, setUserDetails] = useState<any>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetConfirmRef = useRef<BottomSheet>(null);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const loginMutation = useLogin();

  const onAuthStateChanged = useCallback(async (user: any) => {
    if (user) {
      const newPhoneNumber = user.phoneNumber.replace('+1', '');
      try {
        loginMutation.mutate({
          useridentifier: newPhoneNumber,
          serviceprovider: 'Phone',
        });
      } catch (error) {
        console.error('Error during login function call:', error);
        Alert.alert('Login Error', 'Failed to log in, please try again.');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Unsubscribe on unmount
  }, [onAuthStateChanged]);

  useEffect(() => {
    auth().settings.forceRecaptchaFlowForTesting;
  }, []);
  const signInOptionsHandler = () => {
    setSignInOptions('Phone');
    bottomSheetRef.current?.expand();
  };

  const handleClosePress = () => {
    bottomSheetRef.current?.close();
    setSignInOptions('');
  };

  // Step 1: Request Firebase to send OTP
  async function signInWithPhoneNumber() {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      const confirmation = await auth().signInWithPhoneNumber(
        `+1${phoneNumber}`
      );
      setConfirm(confirmation);
      bottomSheetRef.current?.close();
      bottomSheetConfirmRef.current?.expand();
    } catch (error) {
      Alert.alert('Error', 'Failed to send verification code');
      console.error('Error during phone sign-in:', error);
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Confirm OTP with Firebase
  async function confirmCode() {
    if (!code) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await confirm.confirm(code);
      if (userCredential && userCredential.user) {
        // console.log('user', userCredential.user);
        router.push('/');
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid code');
      console.error('Invalid code or error in code confirmation:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (pathname === '/firebaseauth/link') router.back();
  }, [pathname]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          <View className="mx-2.5 h-[12%] w-full items-center justify-center bg-white ">
            <Pressable
              className="my-1.5 flex-row  items-center  justify-between px-2 "
              onPress={() => {}}
            >
              <FontAwesome name="google" size={22} color={colors.danger[700]} />
              <Text className="ml-4 font-bold text-danger-700">
                SIGN IN WITH GOOGLE
              </Text>
            </Pressable>
            <Pressable
              className="my-1.5  flex-row justify-between "
              onPress={signInOptionsHandler}
            >
              <FontAwesome name="phone" size={22} color={colors.primary[700]} />

              <Text className="ml-8 font-bold text-primary-700">
                SIGN IN WITH PHONE
              </Text>
            </Pressable>
          </View>
        </View>

        {signInOptions === 'Phone' && (
          <BottomSheet
            ref={bottomSheetRef}
            onChange={() => {}}
            snapPoints={['90%']}
          >
            <BottomSheetView className="flex-1 ">
              <Head opacity={1} paddingHorizontal={24} />

              <View className="w-full border-b-2 border-b-gray-400" />
              <View className="h-[70%]">
                <View className="mt-2 px-6 ">
                  <Text>
                    If your phone number is register with SCORES,we will send a
                    verifcation code to that number for you to use in the next
                    step.
                  </Text>
                </View>
                <View className="mt-2 px-6">
                  <Text className="color-gray-400 ">Phone number</Text>
                  <TextInput
                    className="rounded-md border-2 border-gray-400 bg-gray-50 p-2"
                    maxLength={10}
                    keyboardType="numeric"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
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
                  onPress={handleClosePress}
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
                  onPress={signInWithPhoneNumber}
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
            </BottomSheetView>
          </BottomSheet>
        )}

        {confirm && (
          <BottomSheet
            ref={bottomSheetRef}
            onChange={() => {}}
            snapPoints={['60%']}
          >
            <BottomSheetView className="flex-1 ">
              <Head opacity={1} paddingHorizontal={24} />

              <View className="w-full border-b-2 border-b-gray-400" />
              <View className="h-[70%]">
                <View className="mt-2 px-6 ">
                  <Text>
                    Please enter the verification code sent to your phone.
                  </Text>
                </View>
                <View className="mt-2 px-6">
                  <Text className="color-gray-400 ">code</Text>
                  <TextInput
                    className="rounded-md border-2 border-gray-400 bg-gray-50 p-2"
                    maxLength={10}
                    keyboardType="numeric"
                    placeholder="Enter code"
                    value={code}
                    onChangeText={setCode}
                  />
                </View>
              </View>

              <View className="absolute bottom-12 h-[15%]  w-full">
                <View className="w-full border-b-2 border-b-gray-400" />

                <Button
                  label="Go Back"
                  loading={false}
                  variant="secondary"
                  size="default"
                  className="w-full  bg-white color-red-400  "
                  textClassName="color-gray-400 font-bold"
                  onPress={() => {
                    bottomSheetConfirmRef.current?.close();
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
                  className="mb-5 w-full bg-blue-900"
                  onPress={confirmCode}
                  icon={
                    <FontAwesome
                      name="phone"
                      size={22}
                      color={colors.black[800]}
                      className="mr-4 "
                    />
                  }
                />
              </View>
            </BottomSheetView>
          </BottomSheet>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default LoginForm;
