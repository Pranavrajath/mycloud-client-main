import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import CustomInputField from '../../components/CustomInputField'
import { icons } from '../../constants/index'
import { useGlobalContext } from '../../context/GlobalProvider'

const UserDetails = () => {
  const [name, setName]=useState("");
  const {setUserName} = useGlobalContext();

  const handleSubmit =async()=>{
    if (!name) {
      Alert.alert("Please enter your name")
      return
    }
    try{
        const randomClientID = (Math.floor(Math.random() * 900000) + 100000).toString();
        console.log(randomClientID);
        await AsyncStorage.setItem("user", JSON.stringify(name));
        await AsyncStorage.setItem("clientID",randomClientID);
        setUserName(name);
        router.replace("/home");
    }
    catch(e){
        Alert.alert('Error Saving user');
        console.error('Error Saving user',e);
    }
  }
  return (
    <SafeAreaView>
        <View className="h-full items-center justify-start pt-[20vh] gap-y-4">
            <Text className="text-xl font-mbold text-black">Enter Your Name</Text>
            <CustomInputField
              value={name}
              handleChangeText={setName}
            />
              <CustomButton
                title="Continue"
                icon={icons.rightArrow}
                extraStyle="mt-[10vh]"
                iconStyle="w-7 h-7"
                handlePress={handleSubmit}
              />
        </View>
    </SafeAreaView>
  )
}

export default UserDetails;