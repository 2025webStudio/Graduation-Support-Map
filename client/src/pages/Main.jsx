import schools from '../data/schools.json';
import districtCenters from '../data/seoulDistrictCenters.json';

// 렌더링 확인
console.log('Main.jsx loaded');

function Main() {
    const root = document.createElement('main');
    root.className = 'main';

    //CSS
    const style = document.createElement('style');
    style.textContent = `
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
  `;
    document.head.appendChild(style);

    //left
    const left = document.createElement('section');
    left.className = 'left';
    left.textContent = '학교 카드 영역 (팀 논의 후 연결)';

    //right
    const right = document.createElement('section');
    right.className = 'right';

    const map = document.createElement('div');
    map.className = 'seoul-map';

    const mapImg = document.createElement('img');
    mapImg.src = '/images/seoul-map.png';
    mapImg.className = 'map';
    mapImg.alt = '서울 지도';
    map.appendChild(mapImg);

//같은 구 학교 계산
    const districtCount = {};
    schools.forEach((school) => {
        districtCount[school.district] =
            (districtCount[school.district] || 0) + 1;
    });

//같은 구 index 추적
    const districtIndex = {};

//마커 생성
    schools.forEach((school) => {
        const center = districtCenters[school.district];
        if (!center) return;

        districtIndex[school.district] =
            (districtIndex[school.district] || 0);

        const index = districtIndex[school.district];
        districtIndex[school.district] += 1;

        const marker = document.createElement('img');
        marker.src = '/images/map-point.png';
        marker.className = 'marker';
        marker.alt = school.name;

        marker.style.left = `${center.x_ratio * 100}%`;
        marker.style.top = `${center.y_ratio * 100}%`;

        // 같은 구에 학교가 2개일 때만 좌우 분리
        if (districtCount[school.district] === 2) {
            const offset = index === 0 ? -12 : 12; // px
            marker.style.transform = `
        translate(-50%, -50%)
        translate(${offset}px, 0)
      `;
        }

        marker.onmouseenter = () => {
            marker.src = '/images/map-point-toggle.png';
        };

        marker.onmouseleave = () => {
            marker.src = '/images/map-point.png';
        };

        map.appendChild(marker);
    });

    right.appendChild(map);

//화면 붙이기
    root.appendChild(left);
    root.appendChild(right);

    return root;
}

export default Main;
