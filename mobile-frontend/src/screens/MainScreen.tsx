import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Dashboard = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100' }} // Replace with your user image
            style={styles.avatar}
          />
          <Text style={styles.welcomeText}>Welcome, User</Text>
        </View>
        <TouchableOpacity>
          <Icon name="notifications-outline" size={28} color="#5E4BD8" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        {[
          { label: 'Your Projects', color: '#D8C1FF', icon: 'folder' },
          { label: 'Resume', color: '#FAD1C3', icon: 'document-text' },
          { label: 'News & Events', color: '#D5C6F2', icon: 'newspaper' },
          { label: 'Reads & Publications', color: '#C7C7FF', icon: 'book' },
        ].map((card, idx) => (
          <TouchableOpacity key={idx} style={[styles.card, { backgroundColor: card.color }]}>
            <Icon name={card.icon} size={30} color="#5E4BD8" />
            <Text style={styles.cardText}>{card.label}</Text>
            <Icon name="chevron-forward" size={20} color="#5E4BD8" />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.popularTitle}>Popular Projects</Text>
      <View style={styles.projectsContainer}>
        {[1, 2, 3, 4].map((_, idx) => (
          <View key={idx} style={styles.projectCard}>
            <Image
              source={require('../../assets/tiger_head_generated.jpg')} 
              style={styles.projectImage}
              resizeMode="contain"
            />
            <Text style={styles.projectTitle}>PROJECT NAME</Text>
            <Text style={styles.projectAuthors}>Dr XYZ, Dr ABC</Text>
            <Text style={styles.projectStatus}>OPEN</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F5F3FC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profileContainer: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  welcomeText: { fontSize: 18, fontWeight: 'bold', color: '#3E2F7F' },
  cardContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginVertical: 20 },
  card: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 12,
    justifyContent: 'space-between',
  },
  cardText: { fontWeight: 'bold', fontSize: 14, color: '#3E2F7F', marginTop: 8 },
  popularTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#3E2F7F' },
  projectsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  projectCard: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  projectImage: { width: '100%', height: 80 },
  projectTitle: { fontWeight: 'bold', marginTop: 10, color: '#3E2F7F' },
  projectAuthors: { fontSize: 12, color: '#666' },
  projectStatus: { color: '#5E4BD8', marginTop: 4, fontWeight: 'bold' },
});

export default Dashboard;
