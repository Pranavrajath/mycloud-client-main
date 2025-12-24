import { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

const ServerPicker = ({ servers, onSelect, deleteServer}) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = (server) => {
    onSelect(server);
    setVisible(false);
  };

  return (
    <View>
        <TouchableOpacity
        className="bg-primary rounded-md h-[40px] justify-center items-center px-4 flex-row gap-x-2"
        onPress={() => setVisible(true)}
      >
        <Text className="font-mmedium text-white text-center text-sm">Select Server</Text>
      </TouchableOpacity>
    
      <Modal visible={visible} transparent animationType="slide">
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white w-[85%] rounded-xl p-4 shadow-md">
            <Text className="text-xl font-msemibold text-center mb-3 border-b-2 border-black/5 pb-4">
              Choose a Server
            </Text>
            <FlatList
              data={servers}
              ListEmptyComponent={
                <View className="min-h-[10vh] w-full items-center justify-center">
                <Text className="font-mmedium text-sm" >No servers Available</Text>
                </View>
              }
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View className="flex-row gap-x-3 justify-center items-center">
                <TouchableOpacity
                  className="p-3 bg-gray-100 rounded-md mb-2 flex-1"
                  onPress={() => handleSelect(item)}
                >
                  <Text className="text-lg font-mmedium text-gray-700 ">
                    {item.name} - {item.id}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="pb-2 w-5 items-center justify-center" onPress={()=>deleteServer(item.name)}>
                      <Text className="text-red-400 font-mbold text-2xl pb-2">x</Text>
                </TouchableOpacity>
                 </View>
              )}
             
            />
             <TouchableOpacity
              onPress={() => setVisible(false)}
              className="p-3 rounded-md mt-2 border-t-2 border-black/5"
            >
              <Text className="font-mbold text-red-500 text-center text-sm">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ServerPicker;
