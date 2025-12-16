import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import districtCenters from "../data/seoulDistrictCenters.json";
import schoolsData from "../data/schools.json";
import "../styles/Main.css";

const PLACEHOLDER_IMG = "https://placehold.co/300x200/png";

export default function Main() {
    const navigate = useNavigate();
    const [hoveredSchool, setHoveredSchool] = useState(null);

    // 학교별 전시 목록
    const [exhibitionsBySchool, setExhibitionsBySchool] = useState({});

    /* =========================
       학교별 전시 목록 불러오기
       (이미지 X, 데이터만)
    ========================= */
    useEffect(() => {
        const fetchExhibitions = async () => {
            const result = {};

            for (const school of schoolsData) {
                try {
                    const res = await fetch(`/api/universities/${school.id}/exhibitions`);
                    const data = await res.json();
                    result[school.id] = Array.isArray(data) ? data : [];
                } catch (e) {
                    console.error("전시 로딩 실패:", school.id, e);
                    result[school.id] = [];
                }
            }

            setExhibitionsBySchool(result);
        };

        fetchExhibitions();
    }, []);

    /* =========================
       같은 구 학교 개수 계산
    ========================= */
    const districtCount = {};
    schoolsData.forEach((school) => {
        districtCount[school.district] =
            (districtCount[school.district] || 0) + 1;
    });

    const districtIndex = {};

    return (
        <main className="main">
            {/* 좌측 영역 */}
            <section className="left">
                {!hoveredSchool ? (
                    /* 기본 상태 */
                    <div className="school-card-empty">
                        <p className="empty-title">Seoul Graduation Exhibition</p>
                        <p className="empty-sub">
                            지도 위 학교 마커에 마우스를 올려보세요
                        </p>
                    </div>
                ) : (
                    /* Hover 상태 */
                    (() => {
                        const exhibitions = exhibitionsBySchool[hoveredSchool.id] || [];
                        const representativeExhibition = exhibitions[0];

                        return (
                            <div className="school-card">
                                <div className="school-card-image">
                                    <img
                                        src={
                                            representativeExhibition?.poster_url ||
                                            "https://placehold.co/600x400/png"
                                        }
                                        alt={representativeExhibition?.title}
                                    />
                                </div>

                                <div className="school-card-content">
                                    <h2 className="school-name">
                                        {hoveredSchool.name}
                                    </h2>

                                    <ul className="exhibition-list">
                                        {exhibitions.slice(0, 3).map((ex) => (
                                            <li key={ex.id}>{ex.title}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })()
                )}
            </section>

            {/* 우측 지도 */}
            <section className="right">
                <div className="map-wrapper">
                    <img
                        src="/images/seoul-map.png"
                        alt="서울 지도"
                        className="map"
                    />

                    {schoolsData.map((school) => {
                        const center = districtCenters[school.district];
                        if (!center) return null;

                        // 같은 구 여러 학교 위치 보정
                        districtIndex[school.district] =
                            districtIndex[school.district] || 0;

                        const index = districtIndex[school.district];
                        districtIndex[school.district] += 1;

                        const offset =
                            districtCount[school.district] === 2
                                ? index === 0
                                    ? -12
                                    : 12
                                : 0;

                        // 학교 → 전시 배열 → 대표 전시 1개
                        const exhibitions = exhibitionsBySchool[school.id] || [];
                        const representativeExhibition = exhibitions[0];

                        return (
                            <div
                                key={school.id}
                                className="marker-wrapper"
                                style={{
                                    left: `${center.x_ratio * 100}%`,
                                    top: `${center.y_ratio * 100}%`,
                                    transform: `translate(-50%, -50%) translate(${offset}px, 0)`
                                }}
                                onMouseEnter={() => setHoveredSchool(school)}
                                onMouseLeave={() => setHoveredSchool(null)}
                            >
                                {/* 마커 */}
                                <img
                                    src="/images/map-point.png"
                                    alt={school.name}
                                    className="marker"
                                    onClick={() => navigate(`/school/${school.id}`)}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.src =
                                            "/images/map-point-toggle.png")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.src = "/images/map-point.png")
                                    }
                                />

                                {/* Hover 카드 */}
                                {hoveredSchool?.id === school.id && (
                                    <div className="tooltip">
                                        <img
                                            src={
                                                representativeExhibition?.poster_url ||
                                                PLACEHOLDER_IMG
                                            }
                                            alt={
                                                representativeExhibition?.department ||
                                                representativeExhibition?.title ||
                                                school.name
                                            }
                                            className="tooltip-img"
                                        />

                                        <div className="tooltip-title">
                                            {school.name}
                                        </div>

                                        {representativeExhibition && (
                                            <div className="tooltip-sub">
                                                {representativeExhibition.title}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
