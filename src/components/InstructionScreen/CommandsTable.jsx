import React from "react";

const CommandsTable = ({ cols, rows }) => {
  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            {cols.map((col, idx) => (
              <th key={idx} style={styles.headerCell}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((data, idx) => (
            <tr key={idx}>
              <td style={styles.commandCell}>
                <div style={styles.commandList}>
                  {data.commands.map((cmd, i) => (
                    <div key={i} style={styles.commandItem}>
                      {cmd}
                    </div>
                  ))}
                </div>
              </td>
              <td style={styles.infoCell}>
                <p dangerouslySetInnerHTML={{ __html: data.info }} style={styles.infoText} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableWrapper: {
    overflowX: "auto",
    margin: "1rem 0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "600px",
    backgroundColor: "#ffffff",
    boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    overflow: "hidden",
  },
  headerCell: {
    backgroundColor: "#f5f5f5",
    padding: "12px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "16px",
    borderBottom: "2px solid #ddd",
    textTransform: "capitalize",
  },
  commandCell: {
    padding: "12px",
    verticalAlign: "middle",
    borderBottom: "1px solid #eee",
    textAlign: "center",
  },
  infoCell: {
    padding: "12px",
    verticalAlign: "middle", // căn giữa theo chiều dọc
    borderBottom: "1px solid #eee",
    textAlign: "center",     // căn giữa ngang
  },
  infoText: {
    margin: 0,
    padding: 0,
  },
  commandList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  commandItem: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "14px",
    minWidth: "120px",
    textAlign: "center",
  },
};

export default CommandsTable;
