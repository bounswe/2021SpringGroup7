import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  pageContainer: {
    display: 'flex',
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  imageButtonText: {
    fontWeight: '500',
  },
  inputRowContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '30%',
  },
  biographyArea: {
    marginTop: 8,
  },
  saveButtonText: {
    fontWeight: '500',
    color: 'white',
  },
});
