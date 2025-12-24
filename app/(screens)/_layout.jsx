import { Stack } from 'expo-router';

const ScreensLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="addServer" options={{headerShown:false}}/>
    </Stack>
  )
}

export default ScreensLayout;