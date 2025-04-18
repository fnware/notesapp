import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="home"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="note"
          options={{
            headerTitle: 'Note',
            headerBackTitle: 'Back',
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
          }}
        />
      </Stack>
    </>
  );
}
