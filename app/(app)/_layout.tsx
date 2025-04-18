import React from 'react';
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
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
  );
} 