import { Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  function handleStart() {
    console.log("START pressed");
  }

  function handleStop() {
    console.log("STOP pressed");
  }

  return (
    <View className="flex-1 items-center justify-center bg-zinc-900">
      
      <View className="flex-row mb-12">
        <Text className="text-5xl font-bold text-white">Track</Text>
        <Text className="text-5xl font-bold text-emerald-400">Sense</Text>
      </View>

      <View className="flex-col gap-6">
        
        <TouchableOpacity 
          className="flex-row items-center bg-emerald-500 px-6 py-4 rounded-xl"
          onPress={handleStart}
          activeOpacity={0.7}
        >
          <Text className="text-white text-xl mr-2">▶</Text>
          <Text className="text-white text-xl font-bold">START</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-row items-center bg-red-500 px-6 py-4 rounded-xl"
          onPress={handleStop}
          activeOpacity={0.7}
        >
          <Text className="text-white text-xl mr-2">⏹</Text>
          <Text className="text-white text-xl font-bold">STOP</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}