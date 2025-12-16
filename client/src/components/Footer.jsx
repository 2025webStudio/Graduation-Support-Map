export default function Footer() {
    return (
        <footer style={styles.footer}>
            <div style={styles.inner}>
                {/* Left Title */}
                <div style={styles.title}>
                    <div>Seoul</div>
                    <div>Graduation</div>
                    <div>Exhibition</div>
                </div>

                {/* School List */}
                <div style={styles.schools}>
                    <ul style={styles.ul}>
                        <li>건국대학교</li>
                        <li>고려대학교</li>
                        <li>국민대학교</li>
                    </ul>
                    <ul style={styles.ul}>
                        <li>서울과학기술대학교</li>
                        <li>서울시립대학교</li>
                        <li>홍익대학교</li>
                    </ul>
                </div>
            </div>

            <div style={styles.bottom}>
                2025 WebStudio
            </div>
        </footer>
    );
}

const styles = {
    footer: {
        background: "#2b2b2b",
        color: "#ccc",
    },
    inner: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "64px 16px",
        display: "flex",
        justifyContent: "space-between",
    },
    title: {
        fontSize: "36px",
        fontWeight: 300,
        color: "#bdbdbd",
        lineHeight: "1.2",
    },
    schools: {
        display: "flex",
        gap: "48px",
        fontSize: "13px",
    },
    ul: {
        listStyle: "none",
        padding: 0,
        margin: 0,
    },
    bottom: {
        borderTop: "1px solid #444",
        textAlign: "center",
        padding: "16px 0",
        fontSize: "12px",
        color: "#777",
    },
};
