import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { G, Path } from 'react-native-svg';

import colors from '../colors';

export const ArrowBackwardSVG = ({
  color = colors.neutral[500],
  ...props
}: SvgProps) => (
  <Svg
    width={props.width}
    height={props.height}
    fill="none"
    viewBox="0 0 22 22"
    {...props}
  >
    <G id="icons">
      <Path
        id="Vector"
        d="M15.7068 4.37677C15.8943 4.5643 15.9996 4.81861 15.9996 5.08377C15.9996 5.34893 15.8943 5.60324 15.7068 5.79077L9.41379 12.0838L15.7068 18.3768C15.8889 18.5654 15.9897 18.818 15.9875 19.0802C15.9852 19.3424 15.88 19.5932 15.6946 19.7786C15.5092 19.964 15.2584 20.0692 14.9962 20.0714C14.734 20.0737 14.4814 19.9729 14.2928 19.7908L7.29279 12.7908C7.10532 12.6032 7 12.3489 7 12.0838C7 11.8186 7.10532 11.5643 7.29279 11.3768L14.2928 4.37677C14.4803 4.1893 14.7346 4.08398 14.9998 4.08398C15.265 4.08398 15.5193 4.1893 15.7068 4.37677Z"
        fill="#181C21"
      />
    </G>
  </Svg>
);
