import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";

const ResearchCollabDashboard = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ResearchCollab</Text>
        <View style={styles.nav}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Projects</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome Section */}
      <View style={styles.sectionCenter}>
        <Text style={styles.welcomeTitle}>Welcome, Prof. Aarushi Chawla</Text>
        <Text style={styles.subTitle}>Faculty Research Dashboard</Text>
      </View>

      {/* Stats */}
      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Active Projects</Text>
          <Text style={styles.cardValue}>3</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Students Mentored</Text>
          <Text style={styles.cardValue}>12</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Publications</Text>
          <Text style={styles.cardValue}>24</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Funding Status</Text>
          <Text style={styles.cardValue}>Active</Text>
        </View>
      </View>

      {/* Open Projects */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Open Research Projects</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Add New Project</Text>
          </TouchableOpacity>
        </View>

        {/* Project 1 */}
        <View style={styles.projectCard}>
          <View style={styles.projectRow}>
            <View style={[styles.projectBar, { backgroundColor: "#8B5DFF" }]} />
            <Text style={styles.projectTitle}>
              Neural Networks for Climate Prediction
            </Text>
          </View>
          <Text style={styles.projectMeta}>
            Positions: 3 Students Assigned: 1/3 Duration: 6 months
          </Text>
          <View style={styles.tags}>
            <Text style={styles.tag}>Python</Text>
            <Text style={styles.tag}>TensorFlow</Text>
            <Text style={styles.tag}>Machine Learning</Text>
          </View>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text>Manage</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Project 2 */}
        <View style={styles.projectCard}>
          <View style={styles.projectRow}>
            <View style={[styles.projectBar, { backgroundColor: "#8B5DFF" }]} />
            <Text style={styles.projectTitle}>
              Sustainable Energy Solutions
            </Text>
          </View>
          <Text style={styles.projectMeta}>
            Positions: 4 Students Assigned: 2/4 Duration: 12 months
          </Text>
          <View style={styles.tags}>
            <Text style={styles.tag}>Engineering</Text>
            <Text style={styles.tag}>Renewable</Text>
          </View>
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Text>Manage</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Completed Research */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Completed Research</Text>
        <View style={styles.grid2}>
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              Linking.openURL("https://example.com/medical-data-analysis")
            }
          >
            <Text style={styles.projectTitle}>Medical Data Analysis</Text>
            <Text style={styles.projectMeta}>
              Journal of AI in Medicine, June 2021
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              Linking.openURL("https://example.com/quantum-computing")
            }
          >
            <Text style={styles.projectTitle}>
              Quantum Computing Applications
            </Text>
            <Text style={styles.projectMeta}>
              Conference IEEE Quantum, Sept 2021
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },

  header: {
    backgroundColor: "#8B5DFF",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  headerTitle: { fontSize: 20, color: "white", fontWeight: "bold" },
  nav: { flexDirection: "row", flexWrap: "wrap" },
  navItem: { marginHorizontal: 8 },
  navText: { color: "white" },

  sectionCenter: { alignItems: "center", marginVertical: 20 },
  welcomeTitle: { fontSize: 22, fontWeight: "bold", color: "#8B5DFF" },
  subTitle: { color: "#555" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    width: "47%",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { color: "#666" },
  cardValue: { fontSize: 22, color: "#8B5DFF", fontWeight: "bold" },

  section: { marginVertical: 16, paddingHorizontal: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  addBtn: {
    backgroundColor: "#8B5DFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addBtnText: { color: "white" },

  projectCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  projectRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  projectBar: {
    width: 4,
    height: 24,
    marginRight: 8,
  },
  projectTitle: { fontWeight: "bold", fontSize: 16, color: "#333" },
  projectMeta: { color: "#777", marginBottom: 8 },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 8 },
  tag: {
    backgroundColor: "#E7DDFF",
    color: "#444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    marginRight: 6,
  },
  buttonGroup: { flexDirection: "row", gap: 10 },
  actionBtn: {
    backgroundColor: "#EEE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  grid2: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
});

export default ResearchCollabDashboard;
