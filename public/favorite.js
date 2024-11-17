// 즐겨찾기 목록을 로드하는 함수
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteList = document.getElementById('favorite-list');

    favoriteList.innerHTML = ''; // 기존 목록 비우기
    favorites.forEach((recipe, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name} 이미지" width="100">
            <div class="recipe-info">
                <h3>${recipe.name}</h3>
                <p>${recipe.description}</p>
                <button class="remove-favorite" onclick="removeFavorite(${index})">삭제</button>
            </div>
        `;
        favoriteList.appendChild(listItem);
    });
}

// 즐겨찾기를 추가하는 함수
function addFavorite() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const newRecipe = {
        name: '새 레시피', // 레시피 이름
        description: '레시피 설명', // 레시피 설명
        image: 'sample.jpg', // 레시피 이미지 경로
    };

    favorites.push(newRecipe);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites(); // 즐겨찾기 목록을 갱신
    alert('즐겨찾기가 추가되었습니다!');
}

// 즐겨찾기를 삭제하는 함수
function removeFavorite(index) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.splice(index, 1); // 선택한 항목 삭제
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadFavorites(); // 즐겨찾기 목록을 갱신
}

// 페이지 로드 시 즐겨찾기 목록을 자동으로 로드
document.addEventListener('DOMContentLoaded', loadFavorites);

