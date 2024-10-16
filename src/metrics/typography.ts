import { Dimensions, type TextStyle, type ViewStyle } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

// Define font types
const type = {
  light: 'SpaceGrotesk-light',
  regular: 'SpaceGrotesk-Regular',
  medium: 'SpaceGrotesk-Medium',
  semiBold: 'SpaceGrotesk-SemiBold',
  bold: 'SpaceGrotesk-Bold',
};

// Define sizes according to Tailwind CSS
const sizes = {
  textXS: wp(2.5), // 2.5% of screen width
  textS: wp(2.7), // 2.7% of screen width
  textM: wp(2.9), // 2.9% of screen width
  textBase: wp(3.1), // 3.1% of screen width
  textLarge: wp(3.3), // 3.3% of screen width
  textXL: wp(3.5), // 3.5% of screen width
  text2XL: wp(3.7), // 3.7% of screen width
  text3XL: wp(3.9), // 3.9% of screen width
  text4XL: wp(4.1), // 4.1% of screen width
  text5XL: wp(4.3), // 4.3% of screen width
  text6XL: wp(4.5), // 4.5% of screen width
  text7XL: wp(4.7), // 4.7% of screen width
  text8XL: wp(4.9), // 4.9% of screen width
  text9XL: wp(5.1), // 5.1% of screen width
  text10XL: wp(5.3), // 5.3% of screen width
  text11XL: wp(5.5), // 5.5% of screen width
  text12XL: wp(6.0), // 6.0% of screen width
  text13XL: wp(6.5), // 6.5% of screen width
  text14XL: wp(7.0), // 7.0% of screen width
};

// Define padding sizes
const paddingSizes = {
  xxs: wp(0.5),
  xs: wp(1), // Extra small (1%)
  sm: wp(2), // Small (2%)
  md: wp(3), // Medium (3%)
  lg: wp(4), // Large (4%)
  xl: wp(5), // Extra large (5%)
  xxl: wp(6), // Double extra large (6%)
};

// Define icon sizes
const iconSizes = {
  xs: wp(2), // Extra small (2%)
  sm: wp(4), // Small (4%)
  md: wp(6), // Medium (6%)
  lg: wp(8), // Large (8%)
  xl: wp(10), // Extra large (10%)
  xxl: wp(12), // Double extra large (12%)
};

// Define styles
interface Styles {
  root: ViewStyle;
  description: TextStyle;
  label: TextStyle;
  input: TextStyle;
  heading: TextStyle;
  subHeading: TextStyle;
  subHeadingLarge: TextStyle;
  largeHeading: TextStyle;
  XXLHeading: TextStyle;
  iconSizeXS: ViewStyle;
  iconSizeSM: ViewStyle;
  iconSizeMD: ViewStyle;
  iconSizeLG: ViewStyle;
  iconSizeXL: ViewStyle;
  iconSizeXXL: ViewStyle;
}

const style: Styles = {
  root: { flex: 1 },
  description: {
    fontFamily: type.light,
    fontSize: sizes.textXS,
    lineHeight: sizes.textS,
  },
  label: {
    fontFamily: type.semiBold,
    fontSize: sizes.textS,
    lineHeight: sizes.textBase,
  },
  input: {
    fontFamily: type.regular,
    fontSize: sizes.textBase,
    lineHeight: sizes.textLarge,
  },
  heading: {
    fontFamily: type.bold,
    fontSize: sizes.text2XL,
    lineHeight: sizes.textXL,
  },
  subHeading: {
    fontFamily: type.light,
    fontSize: sizes.textS,
    lineHeight: sizes.textBase,
  },
  subHeadingLarge: {
    fontFamily: type.bold,
    fontSize: sizes.textLarge,
    lineHeight: sizes.textLarge,
  },
  largeHeading: {
    fontFamily: type.bold,
    fontSize: sizes.text3XL,
    lineHeight: sizes.text3XL,
  },
  XXLHeading: {
    fontFamily: type.bold,
    fontSize: sizes.text8XL,
    lineHeight: sizes.text8XL,
  },
  // Define icon sizes as styles
  iconSizeXS: {
    width: iconSizes.xs,
    height: iconSizes.xs,
  },
  iconSizeSM: {
    width: iconSizes.sm,
    height: iconSizes.sm,
  },
  iconSizeMD: {
    width: iconSizes.md,
    height: iconSizes.md,
  },
  iconSizeLG: {
    width: iconSizes.lg,
    height: iconSizes.lg,
  },
  iconSizeXL: {
    width: iconSizes.xl,
    height: iconSizes.xl,
  },
  iconSizeXXL: {
    width: iconSizes.xxl,
    height: iconSizes.xxl,
  },
};

export default {
  type,
  sizes,
  paddingSizes,
  iconSizes,
  style,
};
