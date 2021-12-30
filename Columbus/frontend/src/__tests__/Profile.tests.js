import React from "react";
import ReactDOM from "react-router-dom";

import convertBirthday from '../pages/Profile/Profile.js'


test('convert 1999-01-01 to human readable January 1, 1999', () => {
  expect(convertBirthday('1999-01-01')).toBe('January 1, 1999');
});