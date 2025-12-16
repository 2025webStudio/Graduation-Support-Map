import "../styles/global.css";

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
                        <li>건국대학교</li>
                        <li>고려대학교</li>
                        <li>국민대학교</li>
                    </ul>
                    <ul>
                        <li>서울과학기술대학교</li>
                        <li>서울시립대학교</li>
                        <li>홍익대학교</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                2025 WebStudio
            </div>
        </footer>
    );
}

