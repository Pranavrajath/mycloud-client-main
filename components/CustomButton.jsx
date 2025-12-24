import { Image, Text, TouchableOpacity } from 'react-native';

const CustomButton = ({title, handlePress, isLoading, extraStyle, icon, iconStyle}) => {
  return (
    <TouchableOpacity 
    onPress={handlePress}
    activeOpacity={0.7}
    className={`bg-primary rounded-md h-[30px] justify-center items-center px-4 flex-row gap-x-2 ${extraStyle} ${isLoading?'opacity-50':''}`}
    disabled={isLoading}
    >
        <Text className="text-white font-mmedium text-[14px]">{title}</Text>
        {icon?(<Image
        source={icon}
        resizeMode='contain'
        className={`${iconStyle}`}
        style={{tintColor:'white'}}
        />):null}
    </TouchableOpacity>
    
  )
}

export default CustomButton