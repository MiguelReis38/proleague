import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { api } from '../api';
import { Trophy, Calendar } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'ChampionshipDetails'>;

export function ChampionshipDetailsScreen({ route }: Props) {
  const { id } = route.params;
  const [championship, setChampionship] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    try {
      const res = await api.get(`/championships/${id}`);
      setChampionship(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (!championship) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Campeonato não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      {/* HEADER SECTION */}
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Trophy color="#10b981" size={32} />
        </View>
        <Text style={styles.title}>{championship.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{championship.players?.length || 0} Jogadores</Text>
        </View>
      </View>

      {/* CLASSIFICATION / ROUNDS PLACEHOLDER */}
      <Text style={styles.sectionTitle}>Tabela</Text>
      <View style={styles.card}>
        <Text style={styles.infoText}>
          A tabela oficial e o feed de partidas aparecerão aqui em breve para os jogadores acompanharem.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Últimas Partidas</Text>
      {championship.rounds?.length > 0 ? (
        championship.rounds.map((round: any, index: number) => (
          <View key={round.id} style={styles.matchCard}>
            <View style={styles.matchHeader}>
              <Calendar color="#a1a1aa" size={16} />
              <Text style={styles.roundText}>Rodada {index + 1}</Text>
            </View>
            <View style={styles.divider} />
            {round.matches.map((match: any) => (
              <View key={match.id} style={styles.scoreRow}>
                <Text style={styles.teamName}>{match.homeTeam?.name || 'Time A'}</Text>
                <Text style={styles.scoreBox}>{match.homeScore ?? '-'}</Text>
                <Text style={styles.vs}>X</Text>
                <Text style={styles.scoreBox}>{match.awayScore ?? '-'}</Text>
                <Text style={styles.teamNameRight}>{match.awayTeam?.name || 'Time B'}</Text>
              </View>
            ))}
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>Nenhuma partida gerada ainda.</Text>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    backgroundColor: '#09090b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#18181b',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272a',
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fafafa',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#27272a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#a1a1aa',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fafafa',
    marginBottom: 16,
  },
  infoText: {
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 22,
  },
  matchCard: {
    backgroundColor: '#18181b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272a',
    marginBottom: 16,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  roundText: {
    color: '#a1a1aa',
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#27272a',
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  teamName: {
    flex: 1,
    color: '#fafafa',
    textAlign: 'right',
    fontSize: 14,
  },
  teamNameRight: {
    flex: 1,
    color: '#fafafa',
    textAlign: 'left',
    fontSize: 14,
  },
  vs: {
    color: '#52525b',
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: 'bold',
  },
  scoreBox: {
    backgroundColor: '#27272a',
    color: '#fafafa',
    width: 32,
    height: 32,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  emptyText: {
    color: '#52525b',
    textAlign: 'center',
  },
});
