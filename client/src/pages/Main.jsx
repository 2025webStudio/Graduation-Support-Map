import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import districtCenters from "../data/seoulDistrictCenters.json";
import schoolsData from "../data/schools.json";
import "../styles/Main.css";

//전시 포스터가 없을 경우 : 기본 이미지 송출
const PLACEHOLDER_IMG = "https://placehold.co/300x200/png";

const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "https://graduation-support-map.up.railway.app";

export default function Main() {
    //마커 클릭시 학교 상세페이지로 이동
    const navigate = useNavigate();
    //현재 마우스가 올라가 있는 학교 정보를 저장
    const [hoveredSchool, setHoveredSchool] = useState(null);

    // 학교별 전시 목록(id를 기준으로 전시 목록 저장)
    const [exhibitionsBySchool, setExhibitionsBySchool] = useState({});

    //화면 진입시 모든 학교의 전시정보를 미리 불러옴
    useEffect(() => {
        const fetchExhibitions = async () => {
            const result = {};

            //각 학교 목록을 순회하며 학교별 전시 API 호출
            for (const school of schoolsData) {
                try {
                    const res = await fetch(
                        `${API_BASE}/api/universities/${school.id}/exhibitions`
                    );
                    const data = await res.json();
                    //로딩이 성공할때만 배열에 저장
                    result[school.id] = Array.isArray(data) ? data : [];
                } catch (e) {
                    console.error("전시 로딩 실패:", school.id, e);
                    result[school.id] = [];
                }
            }
            //모든 학교 전시 정보를 한번에 상태로 저장
            setExhibitionsBySchool(result);
        };

        fetchExhibitions();
    }, []);

    //구 단위로 학교 개수를 세서 마커 겹침 여부 판단
    const districtCount = {};
    schoolsData.forEach((school) => {
        districtCount[school.district] =
            (districtCount[school.district] || 0) + 1;
    });

    //같은 구 안에서 몇번째 학교인지 추적
    const districtIndex = {};

    return (
        <main className="main">
            {/* 좌측 영역 */}
            <section className="left">
                {!hoveredSchool ? (
                    <div className="school-card-empty">
                        <p className="empty-title">
                            Seoul Graduation Exhibition
                        </p>
                        <p className="empty-sub">
                            지도 위 학교 마커에 마우스를 올려보세요
                        </p>
                    </div>
                ) : (
                    (() => {
                        const exhibitions =
                            exhibitionsBySchool[hoveredSchool.id] || [];
                        const representativeExhibition = exhibitions[0];

                        return (
                            <div className="school-card">
                                <div className="school-card-image">
                                    <img
                                        src={
                                            representativeExhibition?.poster_url ||
                                            PLACEHOLDER_IMG
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

                        const exhibitions =
                            exhibitionsBySchool[school.id] || [];
                        const representativeExhibition = exhibitions[0];

                        /* =========================
                           항공대(id=7) 마커 분기
                        ========================= */
                        const isKAU = school.id === 7;

                        const defaultMarkerSrc = isKAU
                            ? "/images/kau-map-point.png"
                            : "/images/map-point.png";

                        const hoverMarkerSrc = isKAU
                            ? "/images/kau-map-point.png"
                            : "/images/map-point-toggle.png";

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
                                    src={defaultMarkerSrc}
                                    alt={school.name}
                                    className="marker"
                                    onClick={() =>
                                        navigate(`/school/${school.id}`)
                                    }
                                    onMouseEnter={(e) => {
                                        e.currentTarget.src = hoverMarkerSrc;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.src = defaultMarkerSrc;
                                    }}
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
