import { Tabs } from 'expo-router';
import { Image, View } from 'react-native';
import { icons } from "../../constants/index";

const TabIcon = ({icons, color})=>{
    return (
        <View>
            <Image
                source={icons}
                resizeMode='contain'
                tintColor={color}
                className="w-6 h-6"
            />
        </View>
    )
}

const TabsLayout = () => {
  return (
    <Tabs 
    screenOptions={{
        tabBarShowLabel:false,
        tabBarActiveTintColor:"#56cfe1",
        tabBarStyle:{
            backgroundColor:'#F7F7F7',
            height: 50,
            paddingTop:5
        }
    }}
    >
        <Tabs.Screen name='home' options={{title:"Home",headerShown:false, tabBarIcon:({color})=>(
            <TabIcon 
            icons={icons.home}
            color={color}
            />
            )}}/>
        <Tabs.Screen name='features' options={{title:"features",headerShown:false, tabBarIcon:({color})=>(
            <TabIcon 
            icons={icons.features}
            color={color}
            />
            )}}/>
        <Tabs.Screen name='settings' options={{title:"Settings",headerShown:false, tabBarIcon:({color})=>(
            <TabIcon 
            icons={icons.settings}
            color={color}
            />
            )}}/>
    </Tabs>
  )
}

export default TabsLayout;