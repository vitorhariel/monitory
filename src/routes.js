import React from 'react';
import {Image} from 'react-native';
import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
} from 'react-navigation';

import backIcon from './assets/back.png';

import Welcome from './screens/Auth/Welcome';
import Login from './screens/Auth/Login';
import SignUp from './screens/Auth/SignUp';
import ForgotPassword from './screens/Auth/ForgotPassword';
import Home from './screens/App/Home';

export default createAppContainer(
  createSwitchNavigator(
    {
      auth: createStackNavigator(
        {
          Welcome,
          Login,
          SignUp,
          ForgotPassword,
        },
        {
          defaultNavigationOptions: {
            headerStyle: {
              backgroundColor: 'white',
              borderBottomColor: 'transparent',
              elevation: 0,
            },
            headerLeftContainerStyle: {
              alignItems: 'center',
              marginLeft: 16,
              paddingRight: 16,
            },
            headerBackImage: <Image source={backIcon} />,
            headerBackTitle: null,
          },
        },
      ),
      app: createStackNavigator(
        {
          Home,
        },
        {
          defaultNavigationOptions: {
            header: null,
          },
        },
      ),
    },
    {
      initialRouteName: 'app',
    },
  ),
);
