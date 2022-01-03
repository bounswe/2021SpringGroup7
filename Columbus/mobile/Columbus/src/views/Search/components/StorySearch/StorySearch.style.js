import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    alignItems: 'center',
    borderWidth: 2,
    marginVertical: 8,
    borderRadius: 10,
    borderColor: '#3077DE',
  },
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
    marginBottom: 8,
  },
  image: {
    borderRadius: 8,
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
    marginTop: 5,
    height:50,
    padding:5
  },
  tag: {
    borderColor: '#4aa9ff',
    backgroundColor: '#dbf4ff',
    color: 'white',
    
  },
  tagText:{
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  }
});


