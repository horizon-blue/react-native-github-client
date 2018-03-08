import { Navigation } from 'react-native-navigation';
import registerScreens from './screens';

registerScreens();

Navigation.startTabBasedApp({
  tabs: [
    {
      label: 'One',
      screen: 'profile.main', // this is a registered name for a screen
      title: 'Screen One',
    },
    {
      label: 'Two',
      screen: 'profile.main',
      title: 'Screen Two',
    },
  ],
});
