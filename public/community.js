// 실제 운영되는 이벤트 데이터 (진행 중, 완료, 예정)
const events = [
    {
        id: 1,
        title: "피자 만들기 대회",
        description: "자신만의 독창적인 피자를 만들어 경연을 펼칩니다.",
        date: "2024년 12월 5일",
        category: "summer",
        diet: "carnivore",
        status: "진행 예정",
        image: "../images/pizza.png"
    },
    {
        id: 2,
        title: "비건 요리 대회",
        description: "비건 요리를 통한 건강한 레시피를 공유하는 대회입니다.",
        date: "2024년 12월 15일",
        category: "eco",
        diet: "vegan",
        status: "진행 예정",
        image: "../images/vegan.png"
    },
    {
        id: 3,
        title: "겨울 특선 요리 레시피",
        description: "겨울철 인기 있는 요리를 공유하고, 특별한 선물을 받아가세요.",
        date: "2024년 12월 25일",
        category: "winter",
        diet: "vegan",
        status: "진행 예정",
        image: "../images/winter.png"
    },
    {
        id: 4,
        title: "여름 요리 대회",
        description: "여름에 딱 맞는 요리를 만들어보세요! 멋진 상품이 기다립니다.",
        date: "2024년 12월 10일",
        category: "summer",
        diet: "carnivore",
        status: "진행 중",
        image: "../images/summer.png"
    },
    {
        id: 5,
        title: "친환경 요리 챌린지",
        description: "친환경 재료로 만든 요리로 도전해보세요! 환경 보호에 동참하세요.",
        date: "2024년 11월 30일",
        category: "eco",
        diet: "vegan",
        status: "진행 중",
        image: "../images/eco.png"
    },
    {
        id: 6,
        title: "가을의 맛",
        description: "가을에 어울리는 요리를 만들고, 모두와 나누는 이벤트입니다.",
        date: "2024년 11월 25일",
        category: "autumn",
        diet: "carnivore",
        status: "진행 중",
        image: "../images/autumn.png"
    },
    {
        id: 7,
        title: "육식 마스터 대회",
        description: "육식 요리의 진수를 뽐낼 수 있는 대회입니다.",
        date: "2024년 12월 18일",
        category: "autumn",
        diet: "carnivore",
        status: "진행 중",
        image: "../images/meat.png"
    },
    {
        id: 8,
        title: "디저트 마스터",
        description: "맛있는 디저트를 만들고, 전문가로 인정받아보세요.",
        date: "2024년 12월 20일",
        category: "winter",
        diet: "vegan",
        status: "마감",
        image: "../images/dessert.png",
        winner: "김민수", // 우승자
        winningDish: "딸기 치즈케이크", // 우승 요리
        secondPlace: "박지훈", // 2등 우승자
        secondDish: "초코 케이크", // 2등 요리
        prize: "현금 50만원 + 디저트 전문가 인증서", // 상품
        result: "이번 디저트 마스터 대회에서는 김민수님이 만든 '딸기 치즈케이크'가 우승을 차지했습니다. 참신한 레시피와 창의적인 플레이팅으로 심사위원들의 높은 평가를 받았습니다. 또한, 박지훈님이 만든 '초코 케이크'가 2등을 차지했습니다." // 결과 설명
    }
];

// 페이지 로드 시 전체 이벤트 목록을 표시
window.onload = function() {
    displayFilteredEvents(events);
}

// 이벤트 필터링 및 검색
function filterEvents() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const categoryDietSelect = document.getElementById('category-diet-select').value;
    const dietSelect = document.getElementById('diet-select').value;

    // 필터링
    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchInput);
        const matchesCategoryDiet = categoryDietSelect ? 
            event.category === categoryDietSelect : true;
        const matchesDiet = dietSelect ? event.diet === dietSelect : true;
        return matchesSearch && matchesCategoryDiet && matchesDiet;
    });

    // 상태별로 정렬 (진행 예정, 진행 중, 마감 순)
    const sortedEvents = filteredEvents.sort((a, b) => {
        const statusOrder = {
            '진행 예정': 1, // '진행 예정'이 가장 우선
            '진행 중': 2, // '진행 중'이 그 다음
            '마감': 3 // '마감'이 가장 뒤
        };

        return statusOrder[a.status] - statusOrder[b.status];
    });

    // 필터링된 후 정렬된 이벤트 목록 표시
    displayFilteredEvents(sortedEvents);
}

// 필터링된 이벤트 목록 표시
function displayFilteredEvents(filteredEvents) {
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = '';

    filteredEvents.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');
        
        const eventTitle = document.createElement('h4');
        eventTitle.textContent = event.title;
        eventCard.appendChild(eventTitle);

        const eventImage = document.createElement('img');
        eventImage.src = event.image;
        eventImage.alt = event.title;
        eventImage.classList.add('event-image');
        eventCard.appendChild(eventImage);

        const eventDate = document.createElement('p');
        eventDate.textContent = `일자: ${event.date}`;
        eventCard.appendChild(eventDate);

        const eventStatus = document.createElement('p');
        eventStatus.classList.add('status');
        eventStatus.classList.add(event.status === "진행 중" ? "ongoing" : event.status === "진행 예정" ? "upcoming" : "closed");
        eventStatus.textContent = `상태: ${event.status}`;
        eventCard.appendChild(eventStatus);

        const eventBtn = document.createElement('button');
        eventBtn.classList.add('btn-view');
        eventBtn.textContent = event.status === "마감" ? '결과 보기' : '자세히 보기';

        // 결과 보기 클릭 시 동작
        eventBtn.addEventListener('click', () => {
            if (event.status === "마감") {
                showEventResult(event);  // 마감 이벤트인 경우 결과 보기
            } else {
                showEventDetail(event.id);  // 진행 중 또는 예정인 경우 상세보기
            }
        });

        eventCard.appendChild(eventBtn);
        eventList.appendChild(eventCard);
    });
}

// 마감 이벤트 결과 보기
function showEventResult(event) {
    console.log("결과 보기 클릭됨", event);  // 확인용 로그 추가

    const resultSection = document.createElement('div');
    resultSection.classList.add('event-result');

    const resultTitle = document.createElement('h4');
    resultTitle.textContent = `우승자: ${event.winner}`;
    resultSection.appendChild(resultTitle);

    const resultDish = document.createElement('p');
    resultDish.textContent = `우승 요리: ${event.winningDish}`;
    resultSection.appendChild(resultDish);

    const secondPlaceTitle = document.createElement('h4');
    secondPlaceTitle.textContent = `2등 우승자: ${event.secondPlace}`;
    resultSection.appendChild(secondPlaceTitle);

    const secondDish = document.createElement('p');
    secondDish.textContent = `2등 요리: ${event.secondDish}`;
    resultSection.appendChild(secondDish);

    const prize = document.createElement('p');
    prize.textContent = `상품: ${event.prize}`;  // 상품 정보
    resultSection.appendChild(prize);

    const resultDescription = document.createElement('p');
    resultDescription.textContent = event.result;  // 우승자 결과 설명
    resultSection.appendChild(resultDescription);

    // 모달에 결과 내용 추가
    const resultModal = document.getElementById('event-result-modal');
    resultModal.innerHTML = '';
    resultModal.appendChild(resultSection);
    resultModal.style.display = 'block';
}

// 이벤트 상세보기
function showEventDetail(eventId) {
    const event = events.find(event => event.id === eventId);
    document.getElementById('event-title').textContent = event.title;
    document.getElementById('event-image').src = event.image;
    document.getElementById('event-description').textContent = event.description;
    document.getElementById('event-date').textContent = `일자: ${event.date}`;
    document.getElementById('event-status').textContent = `상태: ${event.status}`;
    document.getElementById('event-status').classList.add(event.status === "진행 중" ? "ongoing" : event.status === "진행 예정" ? "upcoming" : "closed");
    document.getElementById('event-detail').style.display = 'flex';
}

// 이벤트 신청 버튼 클릭 시 처리
document.getElementById('participate-btn')?.addEventListener('click', () => {
    const text = document.getElementById('event-application-text').value;
    const url = document.getElementById('event-application-url').value;
    if (text || url) {
        alert("이벤트에 참여하셨습니다!");
    } else {
        alert("참여 이유를 적어주세요.");
    }
});

// 이벤트 상세보기 모달 닫기
document.getElementById('close-detail').addEventListener('click', () => {
    document.getElementById('event-detail').style.display = 'none';
});

// 결과 보기 모달 닫기
document.getElementById('close-result').addEventListener('click', () => {
    document.getElementById('event-result-modal').style.display = 'none';
});
