import React, { useState } from "react";

const DashboardScreen: React.FC = () => {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  const toggleProject = (title: string) => {
    setExpandedProject((prev) => (prev === title ? null : title));
  };

  const handleNavClick = (label: string) => {
    alert(`Navigating to ${label}`);
  };

  return (
    <div style={styles.container}>
      {/* Scrollable content wrapper */}
      <div style={styles.scrollable}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerText}>ResearchCollab</h1>
        </div>

        {/* Navbar */}
        <div style={styles.navbar}>
          <div style={styles.navLinks}>
            {["Home", "Projects", "Dashboard"].map((label) => (
              <button
                key={label}
                onClick={() => handleNavClick(label)}
                style={{
                  ...styles.navButton,
                  ...(label === "Dashboard" ? styles.activeNav : {}),
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={styles.profile}>
            <span style={styles.profileName}>Jane Parker</span>
            <img
              src="https://placehold.co/30x30"
              alt="Profile"
              style={styles.profileImage}
            />
          </div>
        </div>

        {/* Welcome */}
        <div style={styles.section}>
          <h2 style={styles.welcomeTitle}>Welcome, Jane Parker</h2>
          <p>Your Research Dashboard</p>
        </div>

        {/* Stats */}
        <div style={styles.stats}>
          {[
            { title: "Total Projects", value: 5 },
            { title: "Active Projects", value: 3 },
            { title: "Total Credits", value: 42 },
          ].map((stat, idx) => (
            <div key={idx} style={styles.statCard}>
              <p style={styles.statTitle}>{stat.title}</p>
              <p style={styles.statValue}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Ongoing Projects */}
        <div style={styles.projectsSection}>
          <h3 style={styles.sectionTitle}>Ongoing Projects</h3>

          <div style={styles.project}>
            <div style={styles.projectTitle}>
              Neural Networks for Climate Prediction
            </div>
            <div style={styles.projectDetails}>
              <span>Credits: 15</span>
              <span>Due: May 20, 2025</span>
            </div>
            <div style={styles.tags}>
              {["Python", "TensorFlow", "Machine Learning"].map((tag, i) => (
                <span key={i} style={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progress,
                  width: "50%",
                  backgroundColor: "#8B5DFF",
                }}
              />
              <span style={styles.progressText}>50%</span>
            </div>
          </div>

          <div style={styles.project}>
            <div style={styles.projectTitle}>Sustainable Energy Solutions</div>
            <div style={styles.projectDetails}>
              <span>Credits: 12</span>
              <span>Due: June 15, 2025</span>
            </div>
            <div style={styles.tags}>
              {["Engineering", "Renewable"].map((tag, i) => (
                <span key={i} style={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progress,
                  width: "80%",
                  backgroundColor: "#8B5DFF",
                }}
              />
              <span style={styles.progressText}>80%</span>
            </div>
          </div>
        </div>

        {/* Completed Projects */}
        <div style={styles.projectsSection}>
          <h3 style={styles.sectionTitle}>Completed Projects</h3>

          {[
            {
              title: "Medical Data Analysis",
              details: { credits: 8, completed: "Jan 10, 2025" },
              tags: ["Biotech", "Data Mining"],
            },
            {
              title: "Quantum Computing Basics",
              details: { credits: 7, completed: "Feb 28, 2025" },
              tags: ["Quantum", "Physics"],
            },
          ].map((project) => (
            <div
              key={project.title}
              style={styles.project}
              onClick={() => toggleProject(project.title)}
            >
              <div style={styles.projectTitle}>{project.title}</div>
              {expandedProject === project.title && (
                <>
                  <div style={styles.projectDetails}>
                    <span>Credits: {project.details.credits}</span>
                    <span>Completed: {project.details.completed}</span>
                  </div>
                  <div style={styles.tags}>
                    {project.tags.map((tag, i) => (
                      <span key={i} style={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progress,
                        width: "100%",
                        backgroundColor: "#4caf50",
                      }}
                    />
                    <span style={styles.progressText}>100%</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    width: "100%",
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
  },
  scrollable: {
    overflowY: "auto",
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    backgroundColor: "#8B5DFF",
    padding: 20,
    textAlign: "center",
  },
  headerText: {
    color: "white",
    fontSize: "24px",
    fontWeight: "bold",
  },
  navbar: {
    backgroundColor: "white",
    padding: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  navLinks: {
    display: "flex",
    gap: 10,
  },
  navButton: {
    background: "none",
    border: "none",
    color: "#8B5DFF",
    cursor: "pointer",
    fontSize: "14px",
  },
  activeNav: {
    fontWeight: "bold",
    textDecoration: "underline",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  profileName: {
    color: "#8B5DFF",
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: "50%",
  },
  section: {
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  stats: {
    display: "flex",
    justifyContent: "space-around",
    padding: 10,
  },
  statCard: {
    backgroundColor: "white",
    flex: 1,
    margin: 5,
    padding: 15,
    borderRadius: 10,
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  statTitle: {
    color: "#8B5DFF",
    fontWeight: "bold",
  },
  statValue: {
    fontSize: 18,
  },
  projectsSection: {
    margin: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  project: {
    marginBottom: 15,
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: 10,
    cursor: "pointer",
  },
  projectTitle: {
    fontWeight: "bold",
    fontSize: 16,
    paddingLeft: 10,
    backgroundColor: "#E7DDFF",
    borderLeft: "5px solid #8B5DFF",
    marginBottom: 5,
  },
  projectDetails: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 5,
    fontSize: 14,
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 5,
  },
  tag: {
    backgroundColor: "#e0e0e0",
    padding: "4px 10px",
    borderRadius: 5,
    fontSize: 12,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    position: "relative",
    marginTop: 5,
    overflow: "hidden",
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
};

export default DashboardScreen;
