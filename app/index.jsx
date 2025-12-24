import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { icons, images } from "../constants/index";
import { useGlobalContext } from '../context/GlobalProvider';
import "../global.css";

const Index = () => {
  const {isLoading, userName} = useGlobalContext();
  if (isLoading) {
    return (
      <SafeAreaView className="bg-grey h-full items-center justify-center">
        <Text className="text-xl font-mmedium text-primary">Loading...</Text>
      </SafeAreaView>
    );
  }
  if(userName!==null ){
     return <Redirect href="/home" />;
  }  
  else
  {
   return (
   <SafeAreaView className="bg-grey h-full">
     <ScrollView contentContainerStyle={{height:'100%'}}>
        <LinearGradient
            colors={['#FFFFFF', '#56cfe1']}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }} 
            className="w-full items-center justify-center h-full gap-y-3"
            >
          <Image
            source={images.Logo}
            className="w-[100px] h-[100px]"
            resizeMode="contain"
          />
          <Text className="font-mmedium text-3xl text-primary">MyCloud Client</Text>
          <Text className="font-mmedium text-[15px] text-primary">Anywhere, Anytime</Text>
          <Text className="font-mregular text-[15px] text-black text-center px-4">Connect to your private server and access your documents, photos, and media from any device.</Text>
          <CustomButton
            title="Continue"
            handlePress={()=> router.push('/userDetails')}
            extraStyle="mt-[10vh] min-w-[100px]"
            icon={icons.rightArrow}
            iconStyle="w-6 h-6"
          />
        </LinearGradient>
     </ScrollView>
     <StatusBar style="dark"/>
   </SafeAreaView>
  );
 }
}

export default Index;