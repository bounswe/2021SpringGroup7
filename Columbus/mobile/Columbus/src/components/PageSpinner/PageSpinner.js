import React from 'react';
import {Box, Spinner} from 'native-base';

import {styles} from './PageSpinner.style';

const PageSpinner = () => {
  return (
    <Box style={styles.pageContainer}>
      <Spinner />
    </Box>
  );
};

export default PageSpinner;
