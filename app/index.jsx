import { Text, TouchableOpacity, View } from 'react-native';

export default function App() {

  const LAPTOP_IP = '10.124.221.193'; 

  async function handleStart() {
    console.log("Sending START...");
    try {
      // Send the POST request to your Laptop's Flask server
      const response = await fetch(`http://${LAPTOP_IP}:5000/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'START' }),
      });

      if (response.ok) {
        console.log("✅ Successfully sent START");
      } else {
        Alert.alert("Error", "Laptop received the request but something went wrong.");
      }
    } catch (error) {
      // This triggers if your laptop is offline, on a different Wi-Fi, or the IP is wrong
      console.error(error);
      Alert.alert("Connection Failed", "Could not reach the laptop at " + LAPTOP_IP);
    }
  }

  async function handleStop() {
    console.log("Sending STOP...");
    try {
      const response = await fetch(`http://${LAPTOP_IP}:5000/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'STOP' }),
      });

      if (response.ok) {
        console.log("✅ Successfully sent STOP");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Connection Failed", "Could not reach the laptop.");
    }
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