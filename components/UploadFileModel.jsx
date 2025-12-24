import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { useState } from 'react';
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import { icons } from '../constants/index';
import { useWebRTC } from '../context/WebRTCProvider';
import FeaturesMenu from './FeaturesMenu';

const UploadFileModel = () => {
    const [visible, setVisible] = useState(false);
    const [fileName, setFileName ]= useState(null);
    const [fileData, setFileData ]= useState(null);
    const [res, setRes] = useState(null);
    const [loading, setLoading] = useState(false);
    const {rtc} = useWebRTC();

    const handleClose=()=>{
          setFileName(null);
          setFileData(null);
          setRes(null);
          setLoading(false);
          setVisible(false);
    }

     const handleUpload=async()=>{
        try {
          if(rtc){
            setLoading(true);
            const res = await rtc?.sendCommand(`UPLOAD:${fileName}@${fileData}`);
            setRes(res);
            console.log(res);
          }
        }catch(err){
            console.log("error while uploading file",err);
          }
          finally{
            setLoading(false);
          }
        }

    const handleSelect=async()=>{
        try {
            const result = await DocumentPicker.getDocumentAsync({
            type: "*/*",
            multiple: false,
            copyToCacheDirectory: true,
        });
        setFileName(result.assets[0].name);
        const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64,
        });
        setFileData(base64);
        console.log(base64);
        }catch(err){
            console.log("error while Selecting file",err);
          }
        }

    return (
    <View>
      <FeaturesMenu
        icon={icons.upload}
        title="Upload Files"
        handlePress={()=>{
          setVisible(true);
        }}
      />
      <Modal visible={visible} transparent animationType='slide'>
          <View className="flex-1 bg-black/40 justify-center items-center">
              <View className="bg-white w-[80%] rounded-md max-h-[80vh] min-h-[50vh] p-2">
                <View className="flex-row justify-between px-4 items-center border-b-2 border-gray-200 h-[50px]">
                  <Text className="text-black font-mbold text-[18px]">Upload Files</Text>
                  <TouchableOpacity onPress={handleClose}>
                    <Text className="text-red-400 font-mbold text-[15px]">Close</Text>
                  </TouchableOpacity>
                </View>
                {loading? <View className="items-center justify-center h-[20vh]"><ActivityIndicator color="#56cfe1" size="large"/></View>:!res?
                <View className="items-center justify-center p-5 h-[20vh] gap-y-4">
                   <View className="items-center flex-row justify-center gap-x-4">
                    <Text className="flex-col text-black font-mmedium text-[15px] text-wrap">{fileName?fileName:"Select File"}</Text>
                     {fileName?<TouchableOpacity onPress={()=>setFileName(null)}>
                      <Text className="text-red-400 font-mbold text-2xl pb-2">x</Text>
                    </TouchableOpacity>:""}
                    </View>
                    <View className="items-center flex-row justify-center gap-x-4">
                    <CustomButton
                    title="Select"
                    handlePress={handleSelect}
                    />
                    {fileName?<CustomButton
                    title="Upload"
                    handlePress={handleUpload}
                    />:""}
                    </View>
                  </View>:<View className="justify-center items-center h-[20vh]">
                  <Text className="text-black font-mbold text-[18px]">{res}</Text>
                </View>
                }
              </View>
          </View>      
      </Modal>
    </View>
  )
}

export default UploadFileModel