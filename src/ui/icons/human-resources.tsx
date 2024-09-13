import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { G, Path } from 'react-native-svg';

import colors from '../colors';

export const HumanResourcesSVG = ({
  color = colors.neutral[500],
  ...props
}: SvgProps) => (
  <Svg
    width={props.width}
    height={props.height}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
    className="ml-4  "
  >
    <G id="akar-icons:clipboard">
      <G id="Group">
        <Path
          id="Vector"
          d="M15.5 4.08398H18C18.5304 4.08398 19.0391 4.2947 19.4142 4.66977C19.7893 5.04484 20 5.55355 20 6.08398V19.084C20 19.6144 19.7893 20.1231 19.4142 20.4982C19.0391 20.8733 18.5304 21.084 18 21.084H6C5.46957 21.084 4.96086 20.8733 4.58579 20.4982C4.21071 20.1231 4 19.6144 4 19.084V6.08398C4 5.55355 4.21071 5.04484 4.58579 4.66977C4.96086 4.2947 5.46957 4.08398 6 4.08398H8.5"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          id="Vector_2"
          d="M8.621 3.59898C8.72915 3.16631 8.97882 2.78219 9.33033 2.50769C9.68184 2.23319 10.115 2.08405 10.561 2.08398H13.438C13.884 2.08405 14.3172 2.23319 14.6687 2.50769C15.0202 2.78219 15.2698 3.16631 15.378 3.59898L16 6.08398H8L8.621 3.59898Z"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          id="Vector_3"
          d="M9 12.084H15M9 16.084H15"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
        />
      </G>
    </G>
  </Svg>
);
