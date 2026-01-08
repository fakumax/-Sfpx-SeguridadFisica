import * as React from 'react';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';

const LoadingSpinner: React.FunctionComponent = () => (
  <Spinner size={SpinnerSize.large} label="Espere por favor..." ariaLive="assertive" />
);
export default LoadingSpinner;
