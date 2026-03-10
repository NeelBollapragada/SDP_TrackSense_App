<<<<<<< HEAD
import { useState } from 'react';
=======
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
>>>>>>> 48cc0de (Communication with CV)
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const { stopReason } = useLocalSearchParams();
  const [banner, setBanner] = useState(stopReason || null);

  // Clear banner param from URL after reading so it doesn't persist on re-render
  useEffect(() => {
    if (stopReason) {
      setBanner(stopReason);
      router.setParams({ stopReason: undefined });
    }
  }, [stopReason]);

  // Hardcoded IP - will probably need to change
<<<<<<< HEAD
  const LAPTOP_IP = '192.168.8.1'; 

  const [isStarted, setIsStarted] = useState(false);
=======
  const LAPTOP_IP = '192.168.118.173'; 
>>>>>>> 48cc0de (Communication with CV)

  async function handleStart() {
    console.log("Sending START...");
    try {
      // Send the POST request to your Laptop's Flask server
      const response = await fetch(`http://${LAPTOP_IP}:5050/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'START' }),
      });

      if (response.ok) {
        console.log("✅ Successfully sent START");
<<<<<<< HEAD
        setIsStarted(true);
=======
        router.push('/live');
>>>>>>> 48cc0de (Communication with CV)
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
      const response = await fetch(`http://${LAPTOP_IP}:5050/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'STOP' }),
      });

      if (response.ok) {
        console.log("✅ Successfully sent STOP");
        setIsStarted(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Connection Failed", "Could not reach the laptop.");
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-zinc-900">

      {/* Auto-stop banner */}
      {banner && (
        <View className="absolute top-0 left-0 right-0 bg-red-600 px-5 py-4 z-10">
          <Text className="text-white font-bold text-base mb-1">⚠️ Robot Auto-Stopped</Text>
          <Text className="text-red-100 text-sm">{banner}</Text>
          <TouchableOpacity onPress={() => setBanner(null)} className="mt-2">
            <Text className="text-red-200 text-xs underline">Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="flex-row mb-12">
        <Text className="text-5xl font-bold text-white">Track</Text>
        <Text className="text-5xl font-bold text-emerald-400">Sense</Text>
      </View>

      <View className="flex-col gap-6">
        
        {!isStarted ? 
        <TouchableOpacity 
          className="flex-row items-center bg-emerald-500 px-6 py-4 rounded-xl"
          onPress={handleStart}
          activeOpacity={0.7}
        >
          <Text className="text-white text-xl mr-2">▶</Text>
          <Text className="text-white text-xl font-bold">START</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity 
          className="flex-row items-center bg-red-500 px-6 py-4 rounded-xl"
          onPress={handleStop}
          activeOpacity={0.7}
        >
          <Text className="text-white text-xl mr-2">⏹</Text>
          <Text className="text-white text-xl font-bold">STOP</Text>
        </TouchableOpacity>
        }
      </View>
    </View>
  );
}