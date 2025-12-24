import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from "../../components/CustomButton";
import CustomInputField from "../../components/CustomInputField";
import { icons } from '../../constants';
import MyCloudWebRTC from "../../context/WebRTC";
import { useWebRTC } from "../../context/WebRTCProvider";

const AddServer = () => {
    const [loading, setLoading] = useState(false);
    const [namingPage, setNamingPage] = useState(false);
    const [serverID, setServerID] = useState(null);
    const [serverName, setServerName]=useState(null);
    const [conPage, setConPage] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [errMsg, setErrMsg] = useState(null);
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const { setRTC } = useWebRTC();

  const handleConnection= async()=>{
    try{
        setLoading(true);
        const clientID = await AsyncStorage.getItem("clientID");
        const rtc = new MyCloudWebRTC(serverID.trim(), serverName.trim(), clientID);
        rtc.start();
        await sleep(2000);
        if(rtc.getIsConnected()){
        setRTC(rtc);
        const saved = await AsyncStorage.getItem("servers");
        const servers = saved ? JSON.parse(saved) : [];
        servers.push({ name: serverName.trim(), id: serverID.trim() });
        await AsyncStorage.setItem("servers", JSON.stringify(servers));
        rtc.close();
        setIsConnected(true);
        }
    }
    catch(e){
        Alert.alert('Error',e);
        console.error('Error',e);
    }finally{
      setLoading(false);
    }
  }

  const handleGivenID = async() =>{
      const saved = await AsyncStorage.getItem("servers");
      const servers = saved ? JSON.parse(saved) : [];
      if(servers.some(s=>s.id===serverID.trim())){
        setErrMsg("Server Already Exists");
      }
      if(!serverID){
        setErrMsg("Enter Server ID");
      }
      else{
        setErrMsg(null);
        setNamingPage(true)
      }
  }

  const handleNaming = async() =>{
      const saved = await AsyncStorage.getItem("servers");
      const servers = saved ? JSON.parse(saved) : [];
      if(servers.some(s=>s.name===serverName.trim())){
        setErrMsg("Name Already Exists");
      }
      if(!serverName){
        setErrMsg("Enter Server Name");
      }
      else{
       setConPage(true);
      setErrMsg(null);
       handleConnection();
      }
  }

  return (
    <SafeAreaView className="bg-white h-full">
        <View className="h-full items-start justify-start bg-white">
            <View className="w-full h-[8vh] flex-row items-center p-4">
                <TouchableOpacity
                onPress={()=>router.back()}
                >
                    <Image 
                        source={icons.leftArrow}
                        resizeMode='contain'
                        className="w-8 h-8"
                        tintColor="#56cfe1"
                    />
                </TouchableOpacity>
                <Text className="text-primary font-mbold text-2xl absolute left-20 right-20 text-center">Add Server</Text>
            </View>
           
            <View className="bg-gray-200 p-4 items-center justify-start h-full w-full rounded-t-3xl pt-[5vh]">
                {loading?<Text className="font-msemibold text-primary text-xl mt-[10vh]">Loading...</Text>:!namingPage?<View className="items-center justify-start h-full gap-y-5">
                <Text className="text-xl font-msemibold text-black text-center">Enter MyCloud Server ID Here</Text>
                <CustomInputField
                extraStyle="mt-4"
                value={serverID}
                handleChangeText={setServerID}
                />
                <Text className=" text-sm font-mmedium text-red-500 bg-red-200 mt-3 text-center rounded-md">{errMsg}</Text>
                <CustomButton 
                title="Next"
                icon={icons.rightArrow}
                handlePress={()=>handleGivenID()}
                iconStyle="w-6 h-6"
                extraStyle="mt-5"
                />
                <Text className="font-mmedium text-black mt-4 text-center">Go to your MyCloud Server Software and Enter the Server ID Shown there.</Text>
                </View>:!conPage?<View className="items-center justify-start h-full gap-y-5">
                <Text className="text-xl font-msemibold text-black text-center">Give Name to this Server</Text>
                <CustomInputField
                extraStyle="mt-4"
                value={serverName}
                handleChangeText={setServerName}
                />
                <Text className=" text-sm font-mmedium text-red-500 bg-red-200 mt-3 text-center rounded-md">{errMsg}</Text>
                <CustomButton 
                title="connnect"
                icon={icons.rightArrow}
                handlePress={()=>handleNaming()}
                iconStyle="w-6 h-6"
                extraStyle="mt-5"
                />
                <Text className="font-mmedium text-black mt-4 text-center">Give any name that you can easily recognise this server.</Text>
                </View>:<View className="items-center justify-start h-full gap-y-5">
                <Text className="text-xl font-msemibold text-black text-center">Connection for {serverName} - {serverID}</Text>
                {isConnected?<Text className="text-xl font-mbold text-green-600 mt-[5vh] text-center bg-green-200 p-3 rounded-md">Successfull</Text>:<Text className="text-xl font-mbold text-red-600 bg-red-200 mt-[5vh] text-center p-3 rounded-md">Failed</Text>}
                 <CustomButton 
                title="Go Back"
                icon={icons.rightArrow}
                handlePress={()=>router.replace("/home")}
                iconStyle="w-6 h-6"
                extraStyle="mt-[5vh]"
                /> 
                </View>
                }
            </View>
        </View>
         <StatusBar style='dark'/>
    </SafeAreaView>
  )
}

export default AddServer;