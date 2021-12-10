import React from 'react';
import {render} from '@testing-library/react-native';
import {NativeBaseProvider} from 'native-base';
import {QueryClientProvider} from 'react-query';
import queryClient from '../configs/reactQuery';

const TestWrapper = ({children}) => {
  console.log('children: ', children);
  return (
    <NativeBaseProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NativeBaseProvider>
  );
};

const customRender = (ui, options) => {
  return render(ui, {wrapper: TestWrapper, ...options});
};

// re-export everything
export * from '@testing-library/react-native';

// override render method
export {customRender as render};
