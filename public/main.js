// 주간 인기 메뉴 슬라이드 기능
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.slider img');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    let currentIndex = 0;
    let slideInterval;

    const showImage = (index) => {
        images.forEach((img, i) => {
            img.classList.remove('active');
            if (i === index) {
                img.classList.add('active');
            }
        });
    };

    const nextImage = () => {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    };

    const prevImage = () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    };

    const startSlide = () => {
        slideInterval = setInterval(nextImage, 5000); // 5초마다 자동 슬라이드
    };

    const stopSlide = () => {
        clearInterval(slideInterval);
    };

    rightArrow.addEventListener('click', () => {
        nextImage();
        stopSlide();
        startSlide();
    });

    leftArrow.addEventListener('click', () => {
        prevImage();
        stopSlide();
        startSlide();
    });

    // 마우스 오버 시 자동 슬라이드 정지
    const slider = document.querySelector('.slider');
    slider.addEventListener('mouseover', stopSlide);
    slider.addEventListener('mouseout', startSlide);

    showImage(currentIndex);
    startSlide();
});

// 즐겨찾기 추가 함수
function addFavorite(button) {
    const favoriteIcon = button.textContent === '♡' ? '❤️' : '♡';
    button.textContent = favoriteIcon;
}

// 나만의 레시피 추가 버튼 클릭 시 로그인 상태 확인
document.getElementById('add-recipe-btn').addEventListener('click', function(event) {
    event.preventDefault(); // 기본 링크 동작 방지

    // API 호출하여 로그인 상태 확인
    fetch('/api/user')
        .then(response => {
            if (response.ok) {
                // 로그인 상태인 경우 mine.html로 이동
                window.location.href = 'mine.html'; // 나만의 레시피 페이지로 이동
            } else {
                // 로그인하지 않은 경우 로그인 페이지로 이동
                window.location.href = '/login'; // 로그인 페이지로 이동
            }
        })
        .catch(error => {
            console.error('Error:', error);
            window.location.href = '/login'; // 오류 발생 시 로그인 페이지로 이동
        });
});

