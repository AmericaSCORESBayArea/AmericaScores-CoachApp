import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { G, Path } from 'react-native-svg';

import colors from '../colors';

export const FillRecordPacerSVG = ({
  color = colors.neutral[500],
  ...props
}: SvgProps) => (
  <Svg
    width={props.width}
    height={props.height}
    fill="none"
    viewBox="0 -1 18 18"
    {...props}
  >
    <G id="icons">
      <Path
        id="Vector"
        d="M7.4798 3.05069C7.4425 2.9063 7.3548 2.78001 7.23253 2.69463C7.11027 2.60924 6.96151 2.57038 6.81311 2.58507C6.66471 2.59976 6.52645 2.66703 6.4233 2.77473C6.32015 2.88243 6.25891 3.02346 6.25063 3.17236C4.73397 3.66819 3.79147 4.43652 3.23064 5.32986C2.64064 6.26819 2.52314 7.26652 2.50314 8.03486L2.50147 8.11236L2.07897 8.63986C1.91718 8.84204 1.79903 9.07555 1.73196 9.32565C1.66489 9.57576 1.65035 9.83705 1.68926 10.0931C1.72817 10.3491 1.81968 10.5942 1.95804 10.8131C2.09639 11.032 2.27858 11.2199 2.49314 11.3649L10.049 16.474C11.1174 17.1965 12.3776 17.5825 13.6673 17.5824H15.5073C15.9113 17.5824 16.3107 17.4958 16.6784 17.3284C17.0461 17.1611 17.3737 16.9168 17.639 16.6121C17.9044 16.3075 18.1013 15.9494 18.2166 15.5622C18.3319 15.175 18.3628 14.7675 18.3073 14.3674C18.109 12.984 16.9131 12.0257 15.8473 11.5115C15.5015 11.3449 15.2156 11.1282 15.0256 10.8482L12.8731 7.14486C13.0226 7.10302 13.1511 7.00709 13.2337 6.87572C13.3163 6.74435 13.3471 6.58695 13.3201 6.43414C13.2931 6.28133 13.2101 6.14404 13.0875 6.04898C12.9648 5.95392 12.8112 5.90789 12.6565 5.91985C12.3809 5.94097 12.1076 5.94597 11.8365 5.93485C9.8698 5.85319 8.19897 4.93486 7.60813 3.44569C7.55719 3.31682 7.51433 3.18489 7.4798 3.05069ZM5.3273 4.96736L6.6498 7.25485C6.73184 7.39706 6.78506 7.55404 6.80643 7.71681C6.82779 7.87959 6.81688 8.04498 6.77432 8.20354C6.73176 8.3621 6.65838 8.51073 6.55837 8.64092C6.45837 8.77112 6.33369 8.88035 6.19147 8.96236L5.87064 9.14736L3.77064 7.73069C3.81397 7.14985 3.94314 6.54652 4.2898 5.99402C4.51147 5.64069 4.83814 5.28569 5.32897 4.96736M7.03063 9.92902L9.35813 8.58486C9.50034 8.50282 9.65732 8.4496 9.82009 8.42823C9.98287 8.40687 10.1483 8.41778 10.3068 8.46034C10.4654 8.5029 10.614 8.57628 10.7442 8.67628C10.8744 8.77629 10.9836 8.90097 11.0656 9.04319L11.5023 9.79902C11.5843 9.94123 11.6376 10.0982 11.6589 10.261C11.6803 10.4238 11.6694 10.5891 11.6268 10.7477C11.5843 10.9063 11.5109 11.0549 11.4109 11.1851C11.3109 11.3153 11.1862 11.4245 11.044 11.5065L10.1415 12.0282L7.03063 9.92902ZM13.6423 15.0815H17.0523C16.9778 15.4356 16.7838 15.7532 16.5027 15.9809C16.2217 16.2087 15.8707 16.3328 15.509 16.3324H13.669C12.6291 16.3325 11.613 16.0214 10.7515 15.439L3.1948 10.329C3.12326 10.2807 3.06251 10.2181 3.01636 10.1452C2.97022 10.0722 2.93969 9.99049 2.92669 9.90515C2.91369 9.81982 2.91852 9.73271 2.94085 9.64933C2.96319 9.56595 3.00255 9.4881 3.05647 9.42069L3.4023 8.98902L11.429 14.404C12.0828 14.8453 12.8535 15.0813 13.6423 15.0815Z"
        fill="#5B5E65"
      />
    </G>
  </Svg>
);
