import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { G, Path } from 'react-native-svg';

import colors from '../colors';

export const DotsVerticalSVG = ({
  color = colors.neutral[500],
  ...props
}: SvgProps) => (
  <Svg
    width={props.width}
    height={props.height}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <G id="icons">
      <Path
        id="Vector"
        d="M12 7.83398C11.7702 7.83398 11.5426 7.78872 11.3303 7.70077C11.118 7.61283 10.9251 7.48392 10.7626 7.32142C10.6001 7.15892 10.4712 6.966 10.3832 6.75368C10.2953 6.54136 10.25 6.3138 10.25 6.08398C10.25 5.85417 10.2953 5.62661 10.3832 5.41429C10.4712 5.20197 10.6001 5.00905 10.7626 4.84655C10.9251 4.68405 11.118 4.55514 11.3303 4.4672C11.5426 4.37925 11.7702 4.33398 12 4.33398C12.4641 4.33398 12.9092 4.51836 13.2374 4.84655C13.5656 5.17474 13.75 5.61986 13.75 6.08398C13.75 6.54811 13.5656 6.99323 13.2374 7.32142C12.9092 7.64961 12.4641 7.83398 12 7.83398ZM12 13.834C11.5359 13.834 11.0908 13.6496 10.7626 13.3214C10.4344 12.9932 10.25 12.5481 10.25 12.084C10.25 11.6199 10.4344 11.1747 10.7626 10.8465C11.0908 10.5184 11.5359 10.334 12 10.334C12.4641 10.334 12.9092 10.5184 13.2374 10.8465C13.5656 11.1747 13.75 11.6199 13.75 12.084C13.75 12.5481 13.5656 12.9932 13.2374 13.3214C12.9092 13.6496 12.4641 13.834 12 13.834ZM10.25 18.084C10.25 18.5481 10.4344 18.9932 10.7626 19.3214C11.0908 19.6496 11.5359 19.834 12 19.834C12.4641 19.834 12.9092 19.6496 13.2374 19.3214C13.5656 18.9932 13.75 18.5481 13.75 18.084C13.75 17.6199 13.5656 17.1747 13.2374 16.8465C12.9092 16.5184 12.4641 16.334 12 16.334C11.5359 16.334 11.0908 16.5184 10.7626 16.8465C10.4344 17.1747 10.25 17.6199 10.25 18.084Z"
        fill="#5B5E65"
      />
    </G>
  </Svg>
);
