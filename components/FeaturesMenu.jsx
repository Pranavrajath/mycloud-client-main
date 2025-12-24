import { Image, Text, TouchableOpacity } from 'react-native'

const FeaturesMenu = ({title, icon, handlePress}) => {
  return (
    <TouchableOpacity
    onPress={handlePress}
    className="h-[50px] flex-row bg-gray-100 p-2 gap-x-4 justify-start items-center rounded-md"
    >
        <Image
            source={icon}
            resizeMode='contain'
            className="w-7 h-7"
            tintColor="#56cfe1"
        />
        <Text className="font-mmedium text-lg text-black">{title}</Text>
    </TouchableOpacity>
  )
}

export default FeaturesMenu