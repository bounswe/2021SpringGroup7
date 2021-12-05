import React from 'react';
import {QueryClientProvider} from 'react-query';

import queryClient from '../../configs/reactQuery';
import {AuthProvider} from '../AuthContext';

function AppProviders({children}) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}

export default AppProviders;
