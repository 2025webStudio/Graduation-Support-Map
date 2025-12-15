import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <header style={styles.header}>
            <div style={styles.inner}>
                {/* Logo */}
                <div style={styles.logo}>
                    Seoul Graduation Exhibition
                </div>

                {/* Navigation */}
                <nav style={styles.nav}>
                    <NavLink
                        to="/"
                        end
                        style={({ isActive }) => ({
                            ...styles.link,
                            ...(isActive ? styles.active : {})
                        })}
                    >
                        MAIN
                    </NavLink>

                    <NavLink
                        to="/calendar"
                        style={({ isActive }) => ({
                            ...styles.link,
                            ...(isActive ? styles.active : {})
                        })}
                    >
                        CALENDAR
                    </NavLink>

                    <NavLink to="/signup" style={styles.link}>
                        SIGNUP
                    </NavLink>

                    <NavLink to="/login" style={styles.link}>
                        LOGIN
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}

const styles = {
    header: {
        width: "100%",
        borderBottom: "1px solid #eaeaea",
        backgroundColor: "#fff",
    },
    inner: {
        width: "100%",
        maxWidth: "1400px",   // ← 화면 꽉 차게 보이도록 확장
        margin: "0 auto",
        height: "72px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        boxSizing: "border-box",
    },
    logo: {
        fontSize: "28px",
        fontWeight: "600",
        letterSpacing: "-0.5px",
    },
    nav: {
        display: "flex",
        gap: "48px",
        alignItems: "center",
    },
    link: {
        fontSize: "13px",
        letterSpacing: "2px",
        textDecoration: "none",   // ✅ 밑줄 제거
        color: "#444",
        padding: "8px 0",
        borderTop: "1px solid transparent",
        borderBottom: "1px solid transparent",
    },
    active: {
        color: "#000",
        borderTop: "1px solid #000",
        borderBottom: "1px solid #000",
    },
};
