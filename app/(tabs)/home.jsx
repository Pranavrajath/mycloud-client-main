import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { icons } from "../../constants/index";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useWebRTC } from '../../context/WebRTCProvider';

const Home = () => {
  const {isLoading, userName} = useGlobalContext();
  const [sloading, setSLoading] = useState(false);
  const [cpuStats, setCpuStats] = useState(null);
  const [cpuBar,setCpuBar] = useState(null);
  const [ramStats, setRamStats] = useState(null);
  const [ramBar,setRamBar] = useState(null);
  const [storStats, setStorStats] = useState(null);
  const [storBar, setStorBar] = useState(null);
  const [savedServers, setSavedServers] = useState([]);
  const [info, setInfo] = useState(null);
  const {rtc, setRTC} = useWebRTC();

  const sleep=(ms)=>{
  return new Promise(resolve => setTimeout(resolve, ms));
  }

  const usageHelper=(val,c)=>{
  const str = val?val:"";
  if(c){
      const clean = str.replace("%", "");
      return Math.floor(clean);
  }
  const clean = str.replace(" GB", "");
  const [used, total] = clean.split("/").map(Number);
  const ratio = Math.floor(used / total * 100);
  return ratio;
  }

  const handleCloseRtc=()=>{
    try{
      setSLoading(true);
      rtc.close();
      rtc.isConnected = false;
      setRTC(null);
      setInfo(null);
      setStorBar(null);
      setStorStats(null);
      setCpuStats(null);
      setCpuBar(null);
      setRamStats(null);
      setRamBar(null);
    }catch(err){
      console.log("Error while closing connection",err);
    }finally{
      setSLoading(false);
    }
  }

  const getStatus=  async()=>{
      try {
        if (!rtc) return console.warn("RTC not ready yet");
        setSLoading(true);
        const cpu = await rtc?.sendCommand("CPU");
        await sleep(1);
        const ram = await rtc?.sendCommand("RAM");

        if (cpu&&ram) {
          setCpuStats(cpu);
          setRamStats(ram);
          setCpuBar(usageHelper(cpu,1));
          setRamBar(usageHelper(ram,0));
        }
      } catch (err) {
        console.log("Error fetching stats:", err);
      } finally {
        setSLoading(false);
      }
    };
     
      const loadServers=async()=>{
      try{
        setSLoading(true);
        const serversList = await AsyncStorage.getItem("servers");
        setSavedServers(serversList ? JSON.parse(serversList) : []);
      }catch(e){
        Alert.alert("Cant load servers",e);
        console.log("Cant load servers",e);
      }finally{
      setSLoading(false);
      }
      };

      const getDataOnce = async()=>{
        try{
          if (rtc){
          setSLoading(true);
          const info = await rtc?.sendCommand("SYSTEMINFO");
          await sleep(1);
          const stor = await rtc?.sendCommand("STORAGE");

          if(info&&stor){
            setInfo(JSON.parse(info));
            setStorStats(stor);
            setStorBar(usageHelper(stor,0));
          }
        }
        }catch(err){
          console.log("Error fetching stats:", err);
        }finally{
          setSLoading(false);
        }
      };

  useEffect(()=>{
    let intervalId;
    let mounted = true;
    const init = async () => {
      await loadServers();
      await getDataOnce();
      if (!mounted) return;
      setTimeout(async() => {
        await getStatus();
        await getDataOnce();
        intervalId = setInterval(getStatus, 2 * 60 * 1000);
      }, 3000);
    };
    
    init();
  
    return () => {
    mounted = false;
    if (intervalId) clearInterval(intervalId);
    };

  },[rtc]);

  if(isLoading){
    return(<SafeAreaView className="bg-grey h-full items-center justify-center">
        <Text className="text-xl font-mmedium text-primary">Loading...</Text>
    </SafeAreaView>)
  }
  if(userName===null)
    {
      return <Redirect href="/" />;
    }
    return (
      <SafeAreaView className="h-full bg-primary">
         <LinearGradient
            colors={['#FFFFFF', '#56cfe1']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 0, y: 0 }} 
            className="w-full items-start justify-start h-full px-4"
         >
          <View className="w-full mt-[5vh] flex-row items-center justify-between">
            <Text className="font-mbold text-secondary text-3xl">Hello, {userName}</Text>
            <TouchableOpacity
            onPress={()=>router.navigate('/addServer')}
            >
              <Image 
              source={icons.addServer}
              resizeMode='contain'
              className="w-8 h-7"
              tintColor="#0077b6"
            />
            </TouchableOpacity> 
          </View>
          <View className="flex-row gap-x-[50px] w-full h-[12vh] items-center justify-center mt-[2vh]">
            <View className="bg-sky-100/50 h-[10vh] w-[80%] rounded-md items-center p-2">
              <Text className="font-msemibold text-secondary/50 text-lg">Total Servers</Text>
              <Text className="font-mbold text-secondary/50 text-3xl">{sloading?"...":savedServers.length}</Text>
            </View>
          </View>
          <View className="w-full flex-row items-center justify-between mt-[5vh] gap-x-4">
            <View className="flex-row items-center gap-x-5">
            <Image 
            source={icons.currentServer}
            resizeMode='contain'
            className="w-8 h-7"
            tintColor="#0077b6"
            />
            <TouchableOpacity onPress={()=>{getDataOnce()}}>
            <Text className="font-mbold text-secondary text-2xl">{rtc?rtc.SERVER_NAME:"Select Server"}</Text>
            </TouchableOpacity>
            </View>
            {rtc?
            <TouchableOpacity onPress={handleCloseRtc}>
            <Text className="text-red-400 font-mbold text-sm">Close Connection</Text>
            </TouchableOpacity>:null}
          </View>
          <View className="h-full w-full p-3">
            {!rtc? <Text className="text-black font-msemibold text-[15px] text-center mt-[5vh]">No Connections</Text>:sloading?<Text className="text-xl font-mmedium text-primary">Loading...</Text>:<View className="h-full w-full items-center  flex-col gap-y-5">
              <View className="bg-sky-200 h-auto w-[80%] items-start mt-[5vh] p-2 rounded-md">
                <Text className="text-gray-600 font-msemibold text-[14px]">OS :  {info?.osName}</Text>
                  <Text className="text-gray-600 font-msemibold text-[14px]">Hostname :  {info?.hostname}</Text>
                    <Text className="text-gray-600 font-msemibold text-[14px]">Architecture :  {info?.arch}</Text>
                <Text className="text-gray-600 font-msemibold text-[14px]">Model :  {info?.model}</Text>
              </View>
              <View className="bg-sky-200 w-[80%] h-[8vh] p-2 rounded-md flex-col items-start justify-around">
                  <Text className="font-msemibold text-black text-lg">Cpu    <Text className="font-mregular text-black text-sm ">{cpuStats}</Text></Text>
                  <View className="flex-row h-[25px] w-full items-center justify-around">
                      <Image
                      source={icons.cpu}
                      resizeMode='contain'
                      className="w-6 h-6"
                      />
                      <View className="bg-white h-[15px] w-[50vw] rounded-sm">
                        <View className={`bg-blue-400 h-full`} style={{ width: `${cpuBar?cpuBar:0}%` }}></View>
                      </View>
                  </View>
              </View>
              <View className="bg-sky-200 w-[80%] h-[8vh] p-2 rounded-md flex-col items-start justify-around">
                  <Text className="font-msemibold text-black text-lg">Ram   <Text className="font-mregular text-black text-sm">{ramStats}</Text></Text>
                  <View className="flex-row h-[25px] w-full items-center justify-around">
                      <Image
                      source={icons.ram}
                      resizeMode='contain'
                      className="w-6 h-6"
                      />
                      <View className="bg-white h-[15px] w-[50vw] rounded-sm">
                        <View className={`bg-blue-400 h-full`} style={{ width: `${ramBar?ramBar:0}%` }}></View>
                      </View>
                  </View>
              </View>
              <View className="bg-sky-200 w-[80%] h-[8vh] p-2 rounded-md flex-col items-start justify-around">
                  <Text className="font-msemibold text-black text-lg">Storage   <Text className="font-mregular text-black text-sm">{storStats}</Text></Text>
                  <View className="flex-row h-[25px] w-full items-center justify-around">
                      <Image
                      source={icons.storage1}
                      resizeMode='contain'
                      className="w-6 h-6"
                      />
                      <View className="bg-white h-[15px] w-[50vw] rounded-sm">
                        <View className={`bg-blue-400 h-full`} style={{ width: `${storBar?storBar:0}%` }}></View>
                      </View>
                  </View>
              </View>
            </View>}
          </View>
         </LinearGradient>
         <StatusBar style='dark' />
      </SafeAreaView>
  )
 }

export default Home;