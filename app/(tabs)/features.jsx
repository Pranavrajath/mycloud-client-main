import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FileSystemModel from '../../components/FileSystemModel';
import ServerPicker from '../../components/ServerPicker';
import UploadFileModel from "../../components/UploadFileModel.jsx";
import { icons } from '../../constants/index';
import MyCloudWebRTC from '../../context/WebRTC';
import { useWebRTC } from '../../context/WebRTCProvider';
 
const Features = () => {
    const [servers, setServers] = useState(null);
    const {rtc} = useWebRTC();
    const {setRTC} = useWebRTC();
    const fetchServers=async()=>{
        const saved = await AsyncStorage.getItem("servers");
        const list = saved?JSON.parse(saved):[];
        setServers(list);
    }

    useEffect(()=>{
        fetchServers();
    },[]);

    const handleRtcInit=async(s)=>{
        const clientID = await AsyncStorage.getItem("clientID");
        const newRtc = new MyCloudWebRTC(s.id, s.name, clientID);
        newRtc.start();
        setRTC(newRtc);
    }

    const handleDeleteServer=async(s)=>{
        const newlist = servers.filter(i=>i.name!==s);
        setServers(newlist);
        await AsyncStorage.setItem("servers", JSON.stringify(newlist));
    }

  return (
    <SafeAreaView className="bg-white h-full">
        <View className="h-[15vh] bg-white items-center justify-center flex-row gap-x-4">
            <Image 
            source={icons.currentServer}
            resizeMode='contain'
            className="w-7 h-7"
            />
            <View className="bg-primary/10 p-2 rounded-md h-[40px] min-w-[150px] items-center justify-center">
                 <Text className="font-mmedium text-black text-xl">{rtc?.SERVER_NAME}</Text>
            </View>
           <ServerPicker
            servers={servers}
            onSelect={(s)=>handleRtcInit(s)}
            deleteServer={(s)=>handleDeleteServer(s)}
           />
        </View>
        <View className="bg-gray-200 h-full rounded-t-3xl pt-7 p-4 gap-y-4">
            <FileSystemModel />
            <UploadFileModel/>
        </View> 
        <StatusBar style='inverted'/>
    </SafeAreaView>
    )
}

export default Features