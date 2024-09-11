import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { G, Path } from 'react-native-svg';

import colors from '../colors';

export const GameDay = ({
  color = colors.neutral[500],
  ...props
}: SvgProps) => (
  <Svg
    width={props.width}
    height={props.height}
    fill="none"
    viewBox="0 -1 18 18"
    {...props}
    className="ml-4  "
  >
    <G id="icons">
      <Path
        id="Vector"
        d="M3.16714 14.0656H14.8329C15.9426 14.0656 16.5 13.5135 16.5 12.4196V5.48023C16.5 4.38631 15.9426 3.83398 14.8329 3.83398H3.16714C2.06277 3.83372 1.5 4.38068 1.5 5.48023V12.4199C1.5 13.5138 2.06277 14.0656 3.16714 14.0656ZM3.18321 13.2111C2.65232 13.2111 2.355 12.9245 2.355 12.3722V11.6024H3.84696C4.63259 11.6024 5.09464 11.1403 5.09464 10.3544V7.54006C5.09464 6.75416 4.63259 6.29238 3.84696 6.29238H2.355V5.52229C2.355 4.97532 2.65232 4.68872 3.18321 4.68872H8.55643V6.478C7.3725 6.66925 6.48054 7.69407 6.48054 8.94711C6.48054 10.2001 7.3725 11.225 8.55643 11.4216V13.2109L3.18321 13.2111ZM11.4876 8.94738C11.4769 7.6997 10.601 6.69068 9.4117 6.48363V4.68898H14.8168C15.3423 4.68898 15.645 4.97559 15.645 5.52256V6.29238H14.153C13.3671 6.29238 12.9054 6.75443 12.9054 7.54032V10.3544C12.9054 11.1403 13.3671 11.6021 14.153 11.6021H15.645V12.3722C15.645 12.9243 15.3423 13.2111 14.8168 13.2111H9.41143V11.4213C10.6061 11.2193 11.5034 10.1999 11.4876 8.94684M14.1688 10.7468C13.9088 10.7468 13.7601 10.5982 13.7601 10.3381V7.55586C13.7601 7.29577 13.9088 7.14711 14.1688 7.14711H15.645V10.7471L14.1688 10.7468ZM3.83116 7.14711C4.09152 7.14711 4.24018 7.29577 4.24018 7.55586V10.3384C4.24018 10.5982 4.09152 10.7471 3.83116 10.7471H2.35527V7.14711H3.83116ZM7.25063 8.94175C7.24942 8.5569 7.37756 8.18281 7.61445 7.87951C7.85135 7.57621 8.18328 7.36129 8.55696 7.26925V10.625C7.81366 10.4337 7.25063 9.74907 7.25063 8.94175ZM10.718 8.94175C10.7073 9.74881 10.155 10.4337 9.4117 10.625V7.27461C10.1604 7.46559 10.7231 8.13979 10.718 8.94175Z"
        fill="#181C21"
      />
    </G>
  </Svg>
);
