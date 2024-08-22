import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button, ControlledInput, Text, View } from '@/ui';
import { Image } from 'expo-image';
import { SafeAreaView } from 'moti';
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

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
  return (
    // <View className="flex-1 justify-center p-4s">
    //   <Text testID="form-title" className="pb-6 text-center text-2xl">
    //     Sign In
    //   </Text>

    //   <ControlledInput
    //     testID="name"
    //     control={control}
    //     name="name"
    //     label="Name"
    //   />

    //   <ControlledInput
    //     testID="email-input"
    //     control={control}
    //     name="email"
    //     label="Email"
    //   />
    //   <ControlledInput
    //     testID="password-input"
    //     control={control}
    //     name="password"
    //     label="Password"
    //     placeholder="***"
    //     secureTextEntry={true}
    //   />
    //   <Button
    //     testID="login-button"
    //     label="Login"
    //     onPress={handleSubmit(onSubmit)}
    //   />
    // </View>
    ////////////////////////////////////////////////////////////////////////////////////////////////
    // <View style={styles.container}>
    // <SafeAreaView style={{ flex: 1 }}>
    <ImageBackground
      source={require('../../assets/LogInBackground.jpeg')}
      style={styles.backgroundImageContainer}
    >
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Log in</Text>
          <Text>America Scores Attendence App</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require('../../assets/ASBA_Logo.jpg')}
            contentFit="contain"
            // transition={1000}
          />
        </View>
        <View style={styles.signInContainer}>
          <Text>Login with Google</Text>
          <Text>Login with Phone Number</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImageContainer: {
    flex: 1,
    flexDirection: 'column',

    justifyContent: 'center',
  },
  container: {
    height: '80%',
    // borderColor: 'brown',
    // borderWidth: 3,
    alignItems: 'center',

    marginHorizontal: 10,
  },
  textContainer: {
    width: '100%',
    height: '8%',
    justifyContent: 'center',

    paddingLeft: 10,
    opacity: 0.6,

    backgroundColor: 'white',
  },
  title: {
    fontWeight: 'bold',
  },

  image: {
    flex: 1,
    width: '100%',
  },
  signInContainer: {
    height: '10%',
    width: '100%',

    // borderColor: 'blue',
    // borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 10,
  },
  imageContainer: {
    height: '82%',

    width: '100%',
    opacity: 0.6,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
