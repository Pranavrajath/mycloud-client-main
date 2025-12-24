import { TextInput, View } from 'react-native';

const CustomInputField = ({value, handleChangeText, extraStyle}) => {
  return (
    <View className={`border-2 w-[250px] h-[50px] rounded-md bg-gray-200 px-4 flex-row items-center ${extraStyle}`}>
        <TextInput
          className="text-black font-mmedium text-lg flex-1"
          value={value}
          onChangeText={handleChangeText}
        />
    </View>
  )
}

export default CustomInputField; 