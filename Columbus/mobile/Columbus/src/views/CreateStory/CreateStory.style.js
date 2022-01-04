import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  pageContainer: {
    display: 'flex',
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  image: {
    borderRadius: 8,
    width: '100%',
    height: 200,
  },
  imageButtonText: {
    fontWeight: '500',
  },
  storyArea: {
    marginTop: 8,
  },
  tagContainer: {
    paddingHorizontal: 0,
  },
  tagInput: {
    borderColor: '#4aa9ff',
    borderWidth: 1,
    borderRadius: 3,
    marginLeft: 0,
    marginRight: 0,
  },
  tag: {
    borderColor: '#4aa9ff',
    backgroundColor: '#dbf4ff',
    color: 'white',
  },
});
