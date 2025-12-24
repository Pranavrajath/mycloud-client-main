import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { icons } from "../constants/index";
import { useGlobalContext } from '../context/GlobalProvider';
import CustomButton from './CustomButton';
import CustomInputField from "./CustomInputField";
import SettingsList from "./SettingsList";

const ChangeNameModel = () => {
const [visible, setVisible] = useState(false);
const [name, setName]=useState("");
const {setUserName} = useGlobalContext();

const handleChange=async()=>{
    await AsyncStorage.setItem("user", JSON.stringify(name));
    setUserName(name);
    setName(null);
    setVisible(false);
}

  return (
    <View>
        <SettingsList
            title="Change Username"
            icon={icons.profile}
            handlePress={()=>setVisible(true)}
          />
        <Modal visible={visible} transparent animationType="slide">
            <View className="flex-1 bg-black/40 justify-center items-center">
            <View className="bg-white h-[40vh] w-[80%] p-4 rounded-md items-center">
            <View className="rounded-md w-full items-end">
                <TouchableOpacity onPress={()=>setVisible(false)}>
                <Text className="text-red-500 font-mbold text-lg">Close</Text>
                </TouchableOpacity>
            </View>
            <View className="items-center mt-[5vh] gap-y-4">
                <Text className="font-mmedium text-black text-xl">Enter Your Name</Text>
                <CustomInputField
                value={name}
                handleChangeText={setName}
                extraStyle="w-[200px]"
                />
            </View>
            <CustomButton
            title="Done"
            extraStyle="min-w-[200px] h-[40px] mt-[10px]"
            handlePress={handleChange}
            />
            </View>
            </View>
        </Modal>
    </View>
  )
}

export default ChangeNameModel;