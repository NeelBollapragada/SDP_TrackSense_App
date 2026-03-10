import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

const LAPTOP_IP = '192.168.118.173';
const HTTP_BASE = `http://${LAPTOP_IP}:5050`;
const WS_URL = `ws://${LAPTOP_IP}:5050/ws/status`;

const initialStatus = {
  running: false,
  front: {
    robot_status: 'NORMAL',
    ANGLE: 'ANGLE=0.00',
    object_detection: { warning: [], danger: [] },
    stop_conditions: [],
  },
  rear: {
    status: 'No feet detected',
    object_detection: { warning: [], danger: [] },
    stop_conditions: [],
  },
};

export default function LiveScreen() {
  const [status, setStatus] = useState(initialStatus);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);

  const frontWarningText = useMemo(() => (status.front.object_detection.warning || []).join(', ') || 'None', [status]);
  const frontDangerText = useMemo(() => (status.front.object_detection.danger || []).join(', ') || 'None', [status]);
  const frontStopText = useMemo(() => (status.front.stop_conditions || []).join(', ') || 'None', [status]);
  const rearWarningText = useMemo(() => (status.rear.object_detection.warning || []).join(', ') || 'None', [status]);
  const rearDangerText = useMemo(() => (status.rear.object_detection.danger || []).join(', ') || 'None', [status]);
  const rearStopText = useMemo(() => (status.rear.stop_conditions || []).join(', ') || 'None', [status]);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    let pollTimer = null;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`${HTTP_BASE}/status`);
        if (!res.ok) return;
        const payload = await res.json();
        setStatus(payload);
      } catch (_) {
        // ignore poll failures; websocket may still be active
      }
    };

    ws.onopen = () => setConnected(true);

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        setStatus(payload);

        // Auto-stop: server detected a hard stop condition — go home with reason
        if (payload.auto_stop_reason && payload.auto_stop_reason.length > 0) {
          const reason = payload.auto_stop_reason.join(', ');
          ws.close();
          router.replace({ pathname: '/', params: { stopReason: reason } });
        }
      } catch (err) {
        console.error('Failed to parse websocket payload', err);
      }
    };

    ws.onerror = (event) => {
      console.error('WebSocket error', event);
    };

    ws.onclose = () => {
      setConnected(false);
      wsRef.current = null;
    };

    // Fallback consistency channel: poll status periodically
    pollTimer = setInterval(fetchStatus, 400);
    fetchStatus();

    return () => {
      if (pollTimer) clearInterval(pollTimer);
      ws.close();
    };
  }, []);

  async function handleStop() {
    try {
      const response = await fetch(`${HTTP_BASE}/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'STOP' }),
      });

      if (!response.ok) {
        Alert.alert('Error', 'Failed to send STOP command.');
        return;
      }

      if (wsRef.current) {
        wsRef.current.close();
      }
      router.replace('/');
    } catch (error) {
      console.error(error);
      Alert.alert('Connection Failed', 'Could not reach the laptop.');
    }
  }

  return (
    <View className="flex-1 bg-zinc-900 p-5">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-white">Live CV Feed</Text>
        <Text className={`text-sm font-semibold ${connected ? 'text-emerald-400' : 'text-red-400'}`}>
          {connected ? 'WS Connected' : 'WS Disconnected'}
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="mb-4 rounded-xl bg-zinc-800 p-4">
          <Text className="mb-2 text-xl font-bold text-white">Front Camera</Text>
          <Text className="text-base text-zinc-200">Robot Status: {status.front.robot_status}</Text>
          <Text className="text-base text-zinc-200">{status.front.ANGLE}</Text>
          <Text className="mt-2 text-base text-amber-300">Warnings: {frontWarningText}</Text>
          <Text className="mt-1 text-base text-red-300">Dangers: {frontDangerText}</Text>
          <Text className="mt-1 text-base text-white">Stop Conditions: {frontStopText}</Text>
        </View>

        <View className="mb-6 rounded-xl bg-zinc-800 p-4">
          <Text className="mb-2 text-xl font-bold text-white">Rear Camera</Text>
          <Text className="text-base text-zinc-200">Foot Status: {status.rear.status}</Text>
          <Text className="mt-2 text-base text-amber-300">Warnings: {rearWarningText}</Text>
          <Text className="mt-1 text-base text-red-300">Dangers: {rearDangerText}</Text>
          <Text className="mt-1 text-base text-white">Stop Conditions: {rearStopText}</Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        className="items-center rounded-xl bg-red-500 px-6 py-4"
        onPress={handleStop}
        activeOpacity={0.7}
      >
        <Text className="text-xl font-bold text-white">⏹ STOP</Text>
      </TouchableOpacity>
    </View>
  );
}
