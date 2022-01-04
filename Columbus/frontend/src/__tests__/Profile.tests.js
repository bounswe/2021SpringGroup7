import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Profile, convertBirthday} from '../pages/Profile/Profile.js'


test('convert birthday date to human readable format', () => {
  expect(convertBirthday('1999-01-01')).toBe('January 1, 1999');
});

