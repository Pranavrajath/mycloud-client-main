import { Image, Text, TouchableOpacity } from 'react-native'

const SettingsList = ({title, icon, handlePress}) => {
  return (
    <TouchableOpacity
    onPress={handlePress}
    className="flex-row p-4 items-center gap-x-4 justify-start self-start">
        <Image 
        source={icon}
        resizeMode='contain'
        className="w-5 h-5"
        tintColor="#6b7280"
        />
        <Text className="text-xl font-mmedium text-gray-500">{title}</Text>
    </TouchableOpacity>
  )
}

export default SettingsList