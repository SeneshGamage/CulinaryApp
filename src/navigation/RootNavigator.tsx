import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import CookModeScreen from '../screens/CookModeScreen';
import ChatScreen from '../screens/ChatScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BecomeChefScreen from '../screens/BecomeChefScreen';
import ChefApplicationStatusScreen from '../screens/ChefApplicationStatusScreen';
import ChefDashboardScreen from '../screens/ChefDashboardScreen';
import UploadRecipeScreen from '../screens/UploadRecipeScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.inkSoft,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="RecipeDetail"
          component={RecipeDetailScreen}
          options={{ headerShown: true, title: '' }}
        />
        <Stack.Screen name="CookMode" component={CookModeScreen} />
        <Stack.Screen
          name="BecomeChef"
          component={BecomeChefScreen}
          options={{ headerShown: true, title: 'Become a Chef' }}
        />
        <Stack.Screen
          name="ChefApplicationStatus"
          component={ChefApplicationStatusScreen}
          options={{ headerShown: true, title: 'Chef Application' }}
        />
        <Stack.Screen
          name="ChefDashboard"
          component={ChefDashboardScreen}
          options={{ headerShown: true, title: 'My Kitchen' }}
        />
        <Stack.Screen
          name="UploadRecipe"
          component={UploadRecipeScreen}
          options={{ headerShown: true, title: 'New Recipe' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
