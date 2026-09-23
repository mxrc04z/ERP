import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>ERP PLATFORM</Text>
      <Text style={styles.title}>Cliente operativo</Text>
      <Text style={styles.body}>La aplicación móvil está lista para conectar los módulos del ERP.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 32, backgroundColor: '#F7F8F5' },
  eyebrow: { color: '#2F6B4F', fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
  title: { color: '#17221D', fontSize: 32, fontWeight: '700', marginTop: 8 },
  body: { color: '#68736D', fontSize: 16, lineHeight: 24, marginTop: 12, maxWidth: 460 }
});