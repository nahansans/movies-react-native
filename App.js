import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import Beranda from './src/screens/Beranda'
import DetailMovie from './src/screens/DetailMovie'

const Stack = createStackNavigator()

export default class App extends Component {
  state = {  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions = {{
            headerShown: false,
            ...TransitionPresets.FadeFromBottomAndroid
          }}
        >
          <Stack.Screen
            name = 'Beranda'
            component = {Beranda}
          />
          
          <Stack.Screen
            name = 'DetailMovie'
            component = {DetailMovie}
            options = {{
              ...TransitionPresets.SlideFromRightIOS
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}