import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { G, Path } from 'react-native-svg';

import colors from '../colors';

export const PersonalSVG = ({
  color = colors.neutral[500],
  ...props
}: SvgProps) => (
  <Svg
    width={props.width}
    height={props.height}
    fill="none"
    viewBox="0 -1 24 24"
    {...props}
    className="ml-4  "
  >
    <G id="mdi:heart">
      <Path
        id="Vector"
        d="M12 21.434L10.55 20.114C5.4 15.444 2 12.354 2 8.58398C2 5.49398 4.42 3.08398 7.5 3.08398C9.24 3.08398 10.91 3.89398 12 5.16398C13.09 3.89398 14.76 3.08398 16.5 3.08398C19.58 3.08398 22 5.49398 22 8.58398C22 12.354 18.6 15.444 13.45 20.114L12 21.434Z"
        fill="black"
      />
    </G>
  </Svg>
);
