import schools from '../data/schools.json';
import districtCenters from '../data/seoulDistrictCenters.json';

export default function Main() {
    // 같은 구 학교 수 계산
    const districtCount = {};
    schools.forEach((school) => {
        districtCount[school.district] =
            (districtCount[school.district] || 0) + 1;
    });

    // 같은 구 index 추적
    const districtIndex = {};

    return (
        <>
            {/* 기존에 head에 넣던 CSS */}
            <style>
                {`
          .main {
            display: flex;
            height: 100vh;
            font-family: sans-serif;
          }

          .left {
            flex: 1;
            padding: 32px;
          }

          .right {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .seoul-map {
            position: relative;
            width: 100%;
            max-width: 700px;
          }

          .map {
            width: 100%;
            display: block;
          }

          .marker {
            position: absolute;
            width: 18px;
            height: 18px;
            transform: translate(-50%, -50%);
            cursor: pointer;
            transition: transform 0.2s;
          }

          .marker:hover {
            transform: translate(-50%, -50%) scale(1.25);
            z-index: 10;
          }
        `}
            </style>

            <main className="main">
                {/* left */}
                <section className="left">
                    학교 카드 영역 (팀 논의 후 연결)
                </section>

                {/* right */}
                <section className="right">
                    <div className="seoul-map">
                        <img
                            src="/images/seoul-map.png"
                            className="map"
                            alt="서울 지도"
                        />

                        {schools.map((school) => {
                            const center = districtCenters[school.district];
                            if (!center) return null;

                            districtIndex[school.district] ??= 0;
                            const index = districtIndex[school.district]++;
                            const offset =
                                districtCount[school.district] === 2
                                    ? index === 0 ? -12 : 12
                                    : 0;

                            return (
                                <img
                                    key={school.id}
                                    src="/images/map-point.png"
                                    className="marker"
                                    alt={school.name}
                                    style={{
                                        left: `${center.x_ratio * 100}%`,
                                        top: `${center.y_ratio * 100}%`,
                                        transform: `translate(-50%, -50%) translate(${offset}px, 0)`
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.src = '/images/map-point-toggle.png';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.src = '/images/map-point.png';
                                    }}
                                />
                            );
                        })}
                    </div>
                </section>
            </main>
        </>
    );
}
