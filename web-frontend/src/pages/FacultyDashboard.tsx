import React from "react";
import Navigation from "../components/Navigation";  // Adjust the path as needed
import Footer from "../components/Footer";          // Adjust the path as needed

const ResearchCollabDashboard: React.FC = () => {
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      fontFamily: "sans-serif",
      backgroundColor: "#F3F4F6",
      minHeight: "100vh",
      overflowY: "auto",
      paddingBottom: "50px",
    },
    header: {
      backgroundColor: "#8B5DFF",
      padding: "16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
    },
    headerTitle: {
      fontSize: "20px",
      color: "white",
      fontWeight: "bold",
    },
    nav: {
      display: "flex",
      flexWrap: "wrap",
    },
    navItem: {
      margin: "0 8px",
      color: "white",
      cursor: "pointer",
      textDecoration: "underline",
    },
    sectionCenter: {
      textAlign: "center",
      margin: "20px 0",
    },
    welcomeTitle: {
      fontSize: "22px",
      fontWeight: "bold",
      color: "#8B5DFF",
    },
    subTitle: {
      color: "#555",
    },
    grid: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      padding: "0 16px",
      gap: "12px",
    },
    card: {
      backgroundColor: "white",
      padding: "16px",
      borderRadius: "10px",
      width: "47%",
      marginBottom: "12px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    cardTitle: { color: "#666" },
    cardValue: {
      fontSize: "22px",
      color: "#8B5DFF",
      fontWeight: "bold",
    },
    section: {
      margin: "16px 0",
      padding: "0 16px",
    },
    sectionHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#333",
    },
    addBtn: {
      backgroundColor: "#8B5DFF",
      color: "white",
      padding: "8px 12px",
      borderRadius: "6px",
      cursor: "pointer",
    },
    projectCard: {
      backgroundColor: "white",
      padding: "16px",
      borderRadius: "10px",
      marginBottom: "12px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
    },
    projectRow: {
      display: "flex",
      alignItems: "center",
      marginBottom: "6px",
    },
    projectBar: {
      width: "4px",
      height: "24px",
      marginRight: "8px",
      backgroundColor: "#8B5DFF",
    },
    projectTitle: {
      fontWeight: "bold",
      fontSize: "16px",
      color: "#333",
    },
    projectMeta: {
      color: "#777",
      marginBottom: "8px",
    },
    tags: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
      marginBottom: "8px",
    },
    tag: {
      backgroundColor: "#E7DDFF",
      color: "#444",
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
    },
    buttonGroup: {
      display: "flex",
      gap: "10px",
    },
    actionBtn: {
      backgroundColor: "#EEE",
      padding: "6px 12px",
      borderRadius: "6px",
      cursor: "pointer",
    },
    grid2: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: "12px",
    },
    linkCard: {
      backgroundColor: "white",
      padding: "16px",
      borderRadius: "10px",
      width: "47%",
      textDecoration: "none",
      color: "#333",
      boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
      transition: "transform 0.2s",
    },
  };

  const handleNavClick = (nav: string): void => {
    alert(`You clicked "${nav}" — implement routing here.`);
  };

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <Navigation />

      {/* Welcome Section */}
      <div style={styles.sectionCenter}>
        <div style={styles.welcomeTitle}>Welcome, Prof. Aarushi Chawla</div>
        <div style={styles.subTitle}>Faculty Research Dashboard</div>
      </div>

      {/* Stats */}
      <div style={styles.grid}>
        {[{ title: "Active Projects", value: "3" }, { title: "Students Mentored", value: "12" }, { title: "Publications", value: "24" }, { title: "Funding Status", value: "Active" }]
          .map(({ title, value }) => (
            <div style={styles.card} key={title}>
              <div style={styles.cardTitle}>{title}</div>
              <div style={styles.cardValue}>{value}</div>
            </div>
          ))}
      </div>

      {/* Open Projects */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionTitle}>Open Research Projects</div>
          <div style={styles.addBtn}>+ Add New Project</div>
        </div>
        {[{ title: "Neural Networks for Climate Prediction", meta: "Positions: 3 | Students Assigned: 1/3 | Duration: 6 months", tags: ["Python", "TensorFlow", "Machine Learning"] }, { title: "Sustainable Energy Solutions", meta: "Positions: 4 | Students Assigned: 2/4 | Duration: 12 months", tags: ["Engineering", "Renewable"] }]
          .map((project) => (
            <div style={styles.projectCard} key={project.title}>
              <div style={styles.projectRow}>
                <div style={styles.projectBar} />
                <div style={styles.projectTitle}>{project.title}</div>
              </div>
              <div style={styles.projectMeta}>{project.meta}</div>
              <div style={styles.tags}>
                {project.tags.map((tag) => (
                  <span style={styles.tag} key={tag}>{tag}</span>
                ))}
              </div>
              <div style={styles.buttonGroup}>
                <div style={styles.actionBtn}>Edit</div>
                <div style={styles.actionBtn}>Manage</div>
              </div>
            </div>
          ))}
      </div>

      {/* Completed Research */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Completed Research</div>
        <div style={styles.grid2}>
          {[{ title: "Medical Data Analysis", meta: "Journal of AI in Medicine, June 2021", link: "https://example.com/medical-data-analysis" }, { title: "Quantum Computing Applications", meta: "Conference IEEE Quantum, Sept 2021", link: "https://example.com/quantum-computing" }]
            .map((project) => (
              <a key={project.title} href={project.link} target="_blank" rel="noopener noreferrer" style={styles.linkCard}>
                <div style={styles.projectTitle}>{project.title}</div>
                <div style={styles.projectMeta}>{project.meta}</div>
              </a>
            ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ResearchCollabDashboard;
