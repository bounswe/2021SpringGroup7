import { screen } from '@testing-library/react';
import render from './utils/testRenderer';
import App from './App';

test('renders app', () => {
  render(<App />);
  const linkElement = screen.getAllByAltText('logo');
  expect(linkElement.length).toEqual(2);
});
