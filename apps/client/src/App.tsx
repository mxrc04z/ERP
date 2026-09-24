import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

type Drawer = 'notifications' | 'profile' | null;

type MetricProps = {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
  warning?: boolean;
};

type ActivityTone = 'green' | 'orange' | 'blue';

type ActivityProps = {
  title: string;
  detail: string;
  time: string;
  tone: ActivityTone;
};

const NAVIGATION_ITEMS = ['Resumen', 'Ventas', 'Inventario', 'Clientes', 'Finanzas'];

const QUICK_ACTIONS = [
  'Crear cotización',
  'Registrar cliente',
  'Transferir inventario',
  'Registrar pago'
];

const todayLabel = (): string =>
  new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
    .format(new Date())
    .replace(/[.,]/g, '')
    .trim()
    .toUpperCase();

export default function App() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (event.key === 'Escape') {
        setCommandOpen(false);
        setDrawer(null);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', listener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', listener);
      }
    };
  }, []);

  const visibleItems = NAVIGATION_ITEMS.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topbar}>
        <View>
          <Text style={styles.eyebrow}>ERP PLATFORM</Text>
          <Text style={styles.title}>Centro de operaciones</Text>
        </View>
        <View style={styles.topbarActions}>
          <TouchableOpacity
            style={styles.commandButton}
            onPress={() => setCommandOpen(true)}
            accessibilityLabel="Abrir paleta de comandos"
          >
            <Text style={styles.commandButtonText}>
              Buscar <Text style={styles.shortcut}>Ctrl K</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDrawer('notifications')}
            style={styles.iconButton}
            accessibilityLabel="Abrir notificaciones"
          >
            <Text>Bell</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDrawer('profile')}
            style={styles.avatar}
            accessibilityLabel="Abrir perfil"
          >
            <Text style={styles.avatarText}>LM</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.sidebar}>
          <Text style={styles.sidebarLabel}>Workspace</Text>
          {NAVIGATION_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item}
              style={[styles.navItem, index === 0 && styles.activeNavItem]}
            >
              <Text style={[styles.navText, index === 0 && styles.activeNavText]}>{item}</Text>
            </TouchableOpacity>
          ))}
          <View style={styles.sidebarFooter}>
            <Text style={styles.tenantText}>Empresa Demo</Text>
            <Text style={styles.branchText}>Sucursal Centro</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.welcomeRow}>
            <View>
              <Text style={styles.pageKicker}>{todayLabel()}</Text>
              <Text style={styles.heading}>Buenos días, Laura.</Text>
              <Text style={styles.subheading}>Aquí tienes el pulso de tu operación.</Text>
            </View>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>+ Nueva operación</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metricGrid}>
            <Metric label="Ventas del mes" value="$284,920" delta="+12.8%" positive />
            <Metric label="Pedidos abiertos" value="128" delta="8 requieren atención" />
            <Metric label="Stock crítico" value="17" delta="3 más que ayer" warning />
            <Metric label="Por cobrar" value="$92,410" delta="Vence esta semana" />
          </View>

          <View style={styles.panelRow}>
            <View style={[styles.panel, styles.largePanel]}>
              <Text style={styles.panelTitle}>Actividad reciente</Text>
              <Activity
                title="Pedido SO-1092 confirmado"
                detail="Cliente: Comercial Atlas"
                time="Hace 8 min"
                tone="green"
              />
              <Activity
                title="Stock bajo en 4 productos"
                detail="Almacén Centro"
                time="Hace 24 min"
                tone="orange"
              />
              <Activity
                title="Factura FAC-100923 emitida"
                detail="Cliente: Norte Industrial"
                time="Hace 42 min"
                tone="blue"
              />
            </View>
            <View style={styles.panel}>
              <Text style={styles.panelTitle}>Acciones rápidas</Text>
              {QUICK_ACTIONS.map((action) => (
                <TouchableOpacity key={action} style={styles.quickAction}>
                  <Text style={styles.quickActionText}>{action}</Text>
                  <Text style={styles.arrow}>→</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {commandOpen && (
        <View style={styles.modalBackdrop}>
          <View style={styles.commandModal}>
            <Text style={styles.modalTitle}>¿Qué necesitas hacer?</Text>
            <TextInput
              autoFocus
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar una sección o acción..."
              placeholderTextColor="#8A918D"
              style={styles.searchInput}
            />
            {visibleItems.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.commandItem}
                onPress={() => setCommandOpen(false)}
              >
                <Text>{item}</Text>
                <Text style={styles.commandHint}>Enter</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setCommandOpen(false)}>
              <Text style={styles.closeText}>Esc para cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {drawer && (
        <View style={styles.drawer}>
          <TouchableOpacity onPress={() => setDrawer(null)}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
          <Text style={styles.drawerTitle}>
            {drawer === 'profile' ? 'Perfil de usuario' : 'Notificaciones'}
          </Text>
          <Text style={styles.drawerText}>
            {drawer === 'profile'
              ? 'Laura Martínez · Administradora'
              : 'No tienes notificaciones nuevas.'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

function Metric({ label, value, delta, positive, warning }: MetricProps) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={[styles.metricDelta, positive && styles.positive, warning && styles.warning]}>
        {delta}
      </Text>
    </View>
  );
}

function Activity({ title, detail, time, tone }: ActivityProps) {
  const toneColor =
    tone === 'green' ? '#4A8B6A' : tone === 'orange' ? '#D58A45' : '#5B7FA6';

  return (
    <View style={styles.activity}>
      <View style={[styles.activityDot, { backgroundColor: toneColor }]} />
      <View style={styles.activityMain}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityDetail}>{detail}</Text>
      </View>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F5F1' },
  topbar: {
    minHeight: 82,
    paddingHorizontal: 32,
    paddingVertical: 18,
    backgroundColor: '#173C35',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  eyebrow: { color: '#9BC5A8', fontSize: 11, letterSpacing: 1.5, fontWeight: '700' },
  title: { color: '#F5F3EB', fontSize: 21, fontWeight: '700', marginTop: 4 },
  topbarActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  commandButton: {
    backgroundColor: '#31584F',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 5
  },
  commandButtonText: { color: '#ECF2EB' },
  shortcut: { color: '#A9C6B0', fontSize: 11 },
  iconButton: { padding: 10 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#D6A56F',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: { color: '#173C35', fontWeight: '700', fontSize: 12 },
  body: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 214, backgroundColor: '#E8ECE5', padding: 24, justifyContent: 'flex-start' },
  sidebarLabel: {
    color: '#718078',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 18
  },
  navItem: { paddingVertical: 11, paddingHorizontal: 12, borderRadius: 4, marginBottom: 4 },
  activeNavItem: { backgroundColor: '#D0E1D3' },
  navText: { color: '#51635B', fontSize: 14 },
  activeNavText: { color: '#173C35', fontWeight: '700' },
  sidebarFooter: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#D2D9D0',
    paddingTop: 16
  },
  tenantText: { color: '#29483F', fontWeight: '700', fontSize: 12 },
  branchText: { color: '#718078', fontSize: 11, marginTop: 4 },
  content: { padding: 32, maxWidth: 1300, width: '100%' },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 28
  },
  pageKicker: { color: '#7C8980', fontSize: 11, letterSpacing: 1.2, fontWeight: '700' },
  heading: { color: '#173C35', fontSize: 32, fontWeight: '700', marginTop: 7 },
  subheading: { color: '#718078', fontSize: 15, marginTop: 5 },
  primaryButton: {
    backgroundColor: '#C77745',
    paddingVertical: 12,
    paddingHorizontal: 17,
    borderRadius: 4
  },
  primaryButtonText: { color: '#FFF8F0', fontWeight: '700' },
  metricGrid: { flexDirection: 'row', gap: 14, marginBottom: 18 },
  metric: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DEE5DC',
    padding: 18,
    minHeight: 124
  },
  metricLabel: { color: '#718078', fontSize: 12 },
  metricValue: { color: '#173C35', fontSize: 28, fontWeight: '700', marginTop: 12 },
  metricDelta: { color: '#8A918D', fontSize: 12, marginTop: 7 },
  positive: { color: '#4A8B6A' },
  warning: { color: '#C77745' },
  panelRow: { flexDirection: 'row', gap: 18 },
  panel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DEE5DC',
    padding: 20,
    minHeight: 280
  },
  largePanel: { flex: 1.5 },
  panelTitle: { color: '#173C35', fontWeight: '700', fontSize: 16, marginBottom: 18 },
  activity: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EDF0EC',
    paddingVertical: 15
  },
  activityDot: { width: 9, height: 9, borderRadius: 5, marginRight: 12 },
  activityMain: { flex: 1 },
  activityTitle: { color: '#29483F', fontSize: 13, fontWeight: '700' },
  activityDetail: { color: '#7C8980', fontSize: 12, marginTop: 3 },
  activityTime: { color: '#A1AAA4', fontSize: 11 },
  quickAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EDF0EC',
    paddingVertical: 16
  },
  quickActionText: { color: '#29483F', fontSize: 13 },
  arrow: { color: '#C77745', fontSize: 18 },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(23, 60, 53, 0.45)',
    alignItems: 'center',
    paddingTop: 100
  },
  commandModal: {
    width: 480,
    maxWidth: '90%',
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderRadius: 6,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 14
  },
  modalTitle: { color: '#173C35', fontSize: 18, fontWeight: '700', marginBottom: 14 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#CED8CE',
    padding: 12,
    borderRadius: 4,
    fontSize: 14
  },
  commandItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF0EC',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  commandHint: { color: '#9BA59E', fontSize: 12 },
  closeText: { color: '#718078', fontSize: 12, marginTop: 16 },
  drawer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 320,
    backgroundColor: '#FFFFFF',
    padding: 26,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 12
  },
  drawerTitle: { color: '#173C35', fontSize: 21, fontWeight: '700', marginTop: 28 },
  drawerText: { color: '#718078', marginTop: 14 }
});