import { NavLink } from "react-router-dom";
import "../styles/global.css";

export default function Navbar() {
    return (
        <header className="navbar-header">
            <div className="navbar-inner">
                {/* Logo */}
                <div className="navbar-logo">
                    Seoul Graduation Exhibition
                </div>

                {/* Navigation */}
                <nav className="navbar-nav">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        MAIN
                    </NavLink>

                    <NavLink
                        to="/calendar"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        CALENDAR
                    </NavLink>

                    <NavLink to="/signup" className="nav-link">
                        SIGNUP
                    </NavLink>

                    <NavLink to="/login" className="nav-link">
                        LOGIN
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}
