import { Stack } from "expo-router";

const OnBoardLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="userDetails" options={{headerShown:false}}/>
    </Stack>
  )
}

export default OnBoardLayout;
