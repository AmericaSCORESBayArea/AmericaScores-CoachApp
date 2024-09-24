import React from 'react';
import type { TextProps, TextStyle } from 'react-native';
import { StyleSheet, Text as NNText, I18nManager } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface Props extends TextProps {
  className?: string;
  tx?: any;
}

export const Text = ({
  className = '',
  style,
  tx,
  children,
  ...props
}: Props) => {
  const textStyle = React.useMemo(
    () =>
      twMerge(
        'text-base text-black  dark:text-white  font-inter font-normal',
        className
      ),
    [className]
  );

  const nStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        {
          writingDirection: 'ltr',
        },
        style,
      ]) as TextStyle,
    [style]
  );
  return (
    <NNText className={textStyle} style={nStyle} {...props}>
      {children}
    </NNText>
  );
};
