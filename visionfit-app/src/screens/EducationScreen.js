import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity
} from 'react-native';

const articles = [
  {
    id: 1,
    title: 'What is digital eye strain?',
    desc: 'Causes, symptoms, and how to relieve it in five minutes.',
    readTime: '5 MIN READ',
  },
  {
    id: 2,
    title: 'The 20-20-20 rule',
    desc: 'A simple habit that resets tired focusing muscles.',
    readTime: '2 MIN READ',
  },
  {
    id: 3,
    title: 'UV protection basics',
    desc: 'Why sunglasses matter even on cloudy days.',
    readTime: '4 MIN READ',
  },
];

export default function EducationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.overline}>LEARN</Text>
            <Text style={styles.title}>Educational hub</Text>
          </View>
          <TouchableOpacity style={styles.searchBtn}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Articles */}
        {articles.map((article) => (
          <TouchableOpacity key={article.id} style={styles.articleCard}>
            <View style={styles.articleIcon}>
              <Text style={styles.articleIconText}>💡</Text>
            </View>
            <View style={styles.articleBody}>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleDesc}>{article.desc}</Text>
              <Text style={styles.articleTime}>{article.readTime}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7F2' },
  content: { padding: 24 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 28, marginTop: 10,
  },
  overline: { fontSize: 11, fontWeight: '700', color: '#888', letterSpacing: 0.5, marginBottom: 4 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#222' },
  searchBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  searchIcon: { fontSize: 18 },
  articleCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  articleIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: '#EBF3EC',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 14,
  },
  articleIconText: { fontSize: 20 },
  articleBody: { flex: 1 },
  articleTitle: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 4 },
  articleDesc: { fontSize: 13, color: '#888', lineHeight: 19, marginBottom: 6 },
  articleTime: { fontSize: 11, color: '#AAA', fontWeight: '600', letterSpacing: 0.3 },
  chevron: { fontSize: 22, color: '#CCC', marginLeft: 8 },
});
