import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";

const DashboardScreen = () => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const toggleProject = (title: string) => {
    setExpandedProject((prev) => (prev === title ? null : title));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>ResearchCollab</Text>
      </View>

      {/* Navbar */}
      <View style={styles.navbar}>
        <View style={styles.navLinks}>
          <Text style={styles.navLink}>Home</Text>
          <Text style={styles.navLink}>Projects</Text>
          <Text style={[styles.navLink, styles.activeNav]}>Dashboard</Text>
        </View>
        <View style={styles.profile}>
          <Text style={styles.profileName}>Jane Parker</Text>
          <Image
            source={{ uri: "https://placehold.co/30x30" }}
            style={styles.profileImage}
          />
        </View>
      </View>

      {/* Welcome */}
      <View style={styles.section}>
        <Text style={styles.welcomeTitle}>Welcome, Jane Parker</Text>
        <Text>Your Research Dashboard</Text>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Total Projects</Text>
          <Text style={styles.statValue}>5</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Active Projects</Text>
          <Text style={styles.statValue}>3</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Total Credits</Text>
          <Text style={styles.statValue}>42</Text>
        </View>
      </View>

      {/* Ongoing Projects */}
      <View style={styles.projectsSection}>
        <Text style={styles.sectionTitle}>Ongoing Projects</Text>
        <View style={styles.project}>
          <Text style={styles.projectTitle}>
            Neural Networks for Climate Prediction
          </Text>
          <View style={styles.projectDetails}>
            <Text>Credits: 15</Text>
            <Text>Due: May 20, 2025</Text>
          </View>
          <View style={styles.tags}>
            <Text style={styles.tag}>Python</Text>
            <Text style={styles.tag}>TensorFlow</Text>
            <Text style={styles.tag}>Machine Learning</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progress,
                { width: "50%", backgroundColor: "#8B5DFF" },
              ]}
            />
            <Text style={styles.progressText}>50%</Text>
          </View>
        </View>

        <View style={styles.project}>
          <Text style={styles.projectTitle}>Sustainable Energy Solutions</Text>
          <View style={styles.projectDetails}>
            <Text>Credits: 12</Text>
            <Text>Due: June 15, 2025</Text>
          </View>
          <View style={styles.tags}>
            <Text style={styles.tag}>Engineering</Text>
            <Text style={styles.tag}>Renewable</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progress,
                { width: "80%", backgroundColor: "#8B5DFF" },
              ]}
            />
            <Text style={styles.progressText}>80%</Text>
          </View>
        </View>
      </View>

      {/* Completed Projects */}
      <View style={styles.projectsSection}>
        <Text style={styles.sectionTitle}>Completed Projects</Text>

        {/* Project 1 */}
        <TouchableOpacity
          onPress={() => toggleProject("Medical Data Analysis")}
          style={styles.project}
        >
          <Text style={styles.projectTitle}>Medical Data Analysis</Text>
          {expandedProject === "Medical Data Analysis" && (
            <>
              <View style={styles.projectDetails}>
                <Text>Credits: 8</Text>
                <Text>Completed: Jan 10, 2025</Text>
              </View>
              <View style={styles.tags}>
                <Text style={styles.tag}>Biotech</Text>
                <Text style={styles.tag}>Data Mining</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progress,
                    { width: "100%", backgroundColor: "#4caf50" },
                  ]}
                />
                <Text style={styles.progressText}>100%</Text>
              </View>
            </>
          )}
        </TouchableOpacity>

        {/* Project 2 */}
        <TouchableOpacity
          onPress={() => toggleProject("Quantum Computing Basics")}
          style={styles.project}
        >
          <Text style={styles.projectTitle}>Quantum Computing Basics</Text>
          {expandedProject === "Quantum Computing Basics" && (
            <>
              <View style={styles.projectDetails}>
                <Text>Credits: 7</Text>
                <Text>Completed: Feb 28, 2025</Text>
              </View>
              <View style={styles.tags}>
                <Text style={styles.tag}>Quantum</Text>
                <Text style={styles.tag}>Physics</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progress,
                    { width: "100%", backgroundColor: "#4caf50" },
                  ]}
                />
                <Text style={styles.progressText}>100%</Text>
              </View>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#8B5DFF",
    padding: 20,
    alignItems: "center",
  },
  headerText: { color: "white", fontSize: 24, fontWeight: "bold" },
  navbar: {
    backgroundColor: "white",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },
  navLinks: { flexDirection: "row" },
  navLink: { marginHorizontal: 10, color: "#8B5DFF" },
  activeNav: { fontWeight: "bold" },
  profile: { flexDirection: "row", alignItems: "center" },
  profileName: { color: "#8B5DFF" },
  profileImage: { width: 30, height: 30, borderRadius: 15, marginLeft: 10 },
  section: { padding: 20 },
  welcomeTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  statCard: {
    backgroundColor: "white",
    flex: 1,
    margin: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  statTitle: { color: "#8B5DFF", fontWeight: "bold" },
  statValue: { fontSize: 18 },
  projectsSection: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  project: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
    paddingBottom: 10,
  },
  projectTitle: {
    fontWeight: "bold",
    fontSize: 16,
    paddingLeft: 10,
    backgroundColor: "#E7DDFF",
    borderLeftColor: "#8B5DFF",
    borderLeftWidth: 5,
    marginBottom: 5,
  },
  projectDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 5,
  },
  tag: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    marginRight: 8,
    marginTop: 4,
    fontSize: 12,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
    position: "relative",
    marginTop: 5,
  },
  progress: {
    height: "100%",
  },
  progressText: {
    position: "absolute",
    right: 10,
    top: -18,
    fontSize: 12,
  },
});

export default DashboardScreen;
