document.addEventListener('DOMContentLoaded', () => {
    const userId = getCurrentUserId(); // 현재 로그인한 사용자 ID를 가져오는 함수 (구현 필요)

    // 즐겨찾기 데이터 가져오기
    fetch(`/api/favorites/${userId}`)
        .then(response => response.json())
        .then(data => {
            const favoritesContainer = document.getElementById('favoritesList');
            
            // 데이터 렌더링
            data.forEach(recipe => {
                const recipeElement = document.createElement('div');
                recipeElement.classList.add('recipe');
                
                recipeElement.innerHTML = `
                    <img src="${recipe.image_url}" alt="${recipe.name}" />
                    <h3>${recipe.name}</h3>
                    <p>${recipe.description}</p>
                    <button class="removeFavoriteButton" data-id="${recipe.recipe_id}">즐겨찾기 제거</button>
                `;

                favoritesContainer.appendChild(recipeElement);
            });
        })
        .catch(err => console.error('즐겨찾기 데이터 가져오기 오류:', err));
});

// "즐겨찾기 제거" 버튼 클릭 이벤트 처리
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('removeFavoriteButton')) {
        const recipeId = e.target.getAttribute('data-id');
        const userId = getCurrentUserId(); // 현재 로그인한 사용자 ID 가져오기

        // 즐겨찾기 삭제 API 호출
        fetch('/api/favorites', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, recipeId })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message); // 성공 메시지 표시
            e.target.closest('.recipe').remove(); // DOM에서 해당 항목 제거
        })
        .catch(err => console.error('즐겨찾기 제거 오류:', err));
    }
});

// 현재 로그인한 사용자 ID를 반환하는 함수
function getCurrentUserId() {
    // 이 함수는 실제로 로그인 상태를 확인하고 사용자 ID를 반환해야 합니다.
    // 아래는 예시입니다. 적절한 인증 로직으로 대체하세요.
    return localStorage.getItem('userId') || 1; // 기본값으로 1을 반환
}

      // 로딩 중 메시지 표시
      function showLoadingMessage() {
        const loadingMessage = document.createElement('div');
        loadingMessage.id = 'loading-message';
        loadingMessage.innerText = '즐겨찾기 목록을 불러오는 중...';
        document.body.appendChild(loadingMessage);
    }

    function hideLoadingMessage() {
        const loadingMessage = document.getElementById('loading-message');
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }

    // 즐겨찾기 목록 로드 함수
    function loadFavorites() {
        showLoadingMessage(); // 로딩 메시지 표시
        const userId = 1; // 사용자 ID를 설정 (예: 로그인한 사용자 ID)
        fetch(`/api/favorites?userId=${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('네트워크 응답이 좋지 않습니다.');
                }
                return response.json();
            })
            .then(data => {
                const favoriteList = document.getElementById('favorite-list');
                favoriteList.innerHTML = ''; // 기존 목록 초기화
                data.favorites.forEach(recipe => {
                    const listItem = createRecipeCard(recipe);
                    favoriteList.appendChild(listItem);
                });
                hideLoadingMessage(); // 로딩 메시지 숨기기
            })
            .catch(error => {
                hideLoadingMessage(); // 로딩 메시지 숨기기
                console.error('즐겨찾기 데이터 로드 오류:', error);
            });
    }

    function createRecipeCard(recipe) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <img src="/uploads/${recipe.image_url}" alt="${recipe.recipe_name}">
            <div class="recipe-info">
                <h3>${recipe.recipe_name}</h3>
                <p>${recipe.description}</p>
                <p><strong>조리 방법:</strong> ${recipe.steps}</p>
                <button class="remove-favorite" onclick="removeFavorite(${recipe.favorite_id})">삭제</button>
                <a href="/recipe/${recipe.recipe_id}" class="view-recipe-button">레시피 보기</a>
            </div>
        `;
        return listItem;
    }

    function removeFavorite(id) {
        fetch(`/api/favorites/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('삭제 요청 실패');
                }
                loadFavorites(); // 즐겨찾기 목록 다시 로드
            })
            .catch(error => {
                console.error('삭제 오류:', error);
            });
    }

    function addFavorite() {
        // 즐겨찾기 추가 로직
        alert("즐겨찾기가 추가되었습니다!");
        loadFavorites(); // 즐겨찾기 목록 다시 로드
    }

    // 페이지 로드 시 즐겨찾기 목록 로드
    window.onload = loadFavorites;

