import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../theme/colors';

interface Message {
  id: string;
  from: 'bot' | 'user';
  text: string;
}

const INITIAL: Message[] = [
  { id: '1', from: 'bot', text: "Hey! I see you're cooking Miso Salmon — need a substitute for mirin?" },
  { id: '2', from: 'user', text: "Yes, I don't have any at home" },
  { id: '3', from: 'bot', text: 'No problem — use 1 tbsp rice vinegar + 1 tsp sugar instead.' },
];

export default function ChatScreen() {
  const [messages, setMessages] = useState(INITIAL);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), from: 'user', text: input }]);
    setInput('');
    // TODO: replace with real call to the ChefGuru AI backend endpoint
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topbar}>
        <Text style={styles.title}>ChefGuru</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        {messages.map((m) => (
          <View
            key={m.id}
            style={[styles.msgRow, m.from === 'user' && { justifyContent: 'flex-end' }]}
          >
            <View style={[styles.bubble, m.from === 'bot' ? styles.bubbleBot : styles.bubbleUser]}>
              <Text style={m.from === 'bot' ? styles.bubbleTextBot : styles.bubbleTextUser}>
                {m.text}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask ChefGuru anything…"
          placeholderTextColor={colors.inkSoft}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={send}
        />
        <Pressable style={styles.sendBtn} onPress={send} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  topbar: { padding: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line },
  title: { fontSize: 17, fontWeight: '700', color: colors.ink },
  msgRow: { flexDirection: 'row', marginBottom: spacing.sm },
  bubble: { maxWidth: '78%', paddingVertical: 10, paddingHorizontal: 13, borderRadius: 16 },
  bubbleBot: { backgroundColor: colors.cream, borderWidth: 1, borderColor: colors.line },
  bubbleUser: { backgroundColor: colors.orange },
  bubbleTextBot: { color: colors.ink, fontSize: 13 },
  bubbleTextUser: { color: colors.white, fontSize: 13 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', padding: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.line, gap: spacing.sm,
  },
  input: {
    flex: 1, height: 44, borderRadius: radius.pill, backgroundColor: colors.cream,
    borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.md, color: colors.ink,
  },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.orange },
});
