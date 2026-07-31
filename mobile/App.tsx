import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { HomeScreen } from './src/screens/HomeScreen';
import { ChampionshipDetailsScreen } from './src/screens/ChampionshipDetailsScreen';

export type RootStackParamList = {
  Home: undefined;
  ChampionshipDetails: { id: string, name: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Custom Dark Theme matching our web dashboard
const ProLeagueTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#09090b', // zinc-950
    card: '#18181b', // zinc-900
    text: '#fafafa', // zinc-50
    border: '#27272a', // zinc-800
    primary: '#10b981', // emerald-500
  },
};

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer theme={ProLeagueTheme}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#09090b',
            },
            headerTintColor: '#fafafa',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'ProLeague Mobile' }} 
          />
          <Stack.Screen 
            name="ChampionshipDetails" 
            component={ChampionshipDetailsScreen} 
            options={({ route }) => ({ title: route.params.name })} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
