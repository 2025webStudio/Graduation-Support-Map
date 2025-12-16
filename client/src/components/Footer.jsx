import "../styles/global.css";
import { Link } from "react-router-dom";


export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                {/* Left Title */}
                <div className="footer-title">
                    <div>Seoul</div>
                    <div>Graduation</div>
                    <div>Exhibition</div>
                </div>

                {/* School List */}
                <div className="footer-universities">
                    <ul>
                        <li><Link to="/school/1">건국대학교</Link></li>
                        <li><Link to="/school/2">고려대학교</Link></li>
                        <li><Link to="/school/3">국민대학교</Link></li>
                    </ul>

                    <ul>
                        <li><Link to="/school/4">서울과학기술대학교</Link></li>
                        <li><Link to="/school/5">서울시립대학교</Link></li>
                        <li><Link to="/school/6">홍익대학교</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                2025 WebStudio
            </div>
        </footer>
    );
}

