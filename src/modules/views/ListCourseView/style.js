import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    borderBottomColor: '#d4d2d2',
    borderBottomWidth: 1,
  },

  header_text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },

  button: {
    width: 100,
    height: 50,
    justifyContent: 'center',
  },

  icon: {
    color: 'black',
    marginLeft: 20,
  },
  textView: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    marginRight: 100,
    alignItems: 'center',
  },
  courses_container: {},
});
