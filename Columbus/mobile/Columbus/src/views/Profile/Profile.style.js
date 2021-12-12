import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  headerContainer: {
    display: 'flex',
    flex: 2,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    flex: 1,
    padding: 16,
  },
  avatarName: {
    padding: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  headerRightSideContainer: {
    flex: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBoxContainer: {
    width: '100%',
    paddingHorizontal: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  mainInfoContainer: {
    width: '100%',
    display: 'flex',
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  biographyContainer: {
    display: 'flex',
    flex: 1,
    paddingHorizontal: 8,
  },
  editContainer: {
    display: 'flex',
    flex: 1,
    paddingHorizontal: 8,
  },
  contentContainer: {
    display: 'flex',
    flex: 6,
    paddingHorizontal: 16,
  },
});
