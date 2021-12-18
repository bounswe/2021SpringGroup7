import { ThemeProvider } from '@material-ui/core';
import { render as reactrenderer } from '@testing-library/react';
import {Router} from 'react-router-dom'
import { createTheme } from '@material-ui/core';
import LocationChooser from '../components/GoogleMaps/GoogleMaps'

jest.mock('@material-ui/styles', () => ({
  ...jest.requireActual('@material-ui/styles'),
  makeStyles: cb => () => cb({
     spacing: () => 0
  }),
}))

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    // add your noops here
    useParams: jest.fn(),
    useHistory: jest.fn(),
  };
})


jest.mock('../components/GoogleMaps/GoogleMaps', () => {
  return function DummyMap(props) {
    props.setLatitude(1);
    props.setLongitude(1);
    return (
      <div data-testid="map">
          latitude
      </div>
    );
  };
})


const TestWrapper = ({children}) => {
    const theme = createTheme({
      palette: {
        divider: ""
      }
    });
    return (
        <ThemeProvider theme={theme}>     
            {children}
        </ThemeProvider>
    );
};



export default function render(ui, options) {
    return reactrenderer(ui, {wrapper: TestWrapper, ...options});
  };
  