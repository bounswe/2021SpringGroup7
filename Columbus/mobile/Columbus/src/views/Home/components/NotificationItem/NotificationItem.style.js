import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  notificationItemContainer: {
    display: 'flex',
    padding: 10,
    borderWidth: 1,
    margin: 8,
    marginBottom: 0,
    borderRadius: 8,
    borderColor: '#4aa9ff',
  },
  notificationSummaryText: {
    fontSize: 18,
  },
  notificationDate: {
    fontSize: 14,
    alignSelf: 'flex-end',
  },
});
