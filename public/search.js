document.getElementById('searchButton').addEventListener('click', () => {
    // 검색 입력값 가져오기
    const searchInput = document.getElementById('searchInput').value.trim();

    // 입력값이 비어 있으면 알림 표시
    if (!searchInput) {
        alert('검색어를 입력하세요.');
        return;
    }

    // 쉼표로 구분된 검색어를 서버로 전달
    const formattedQuery = searchInput.split(',')
        .map(term => term.trim()) // 각 검색어 양쪽 공백 제거
        .join(','); // 쉼표로 다시 합치기

    // 서버에 검색 요청 보내기
    fetch(`/api/search?query=${encodeURIComponent(formattedQuery)}`)
        .then(response => response.json())
        .then(data => {
            console.log('검색 결과:', data);
            
            // 결과를 화면에 표시하는 로직 추가
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = ''; // 기존 결과 초기화
            if (data.length > 0) {
                data.forEach(recipe => {
                    const recipeElement = document.createElement('div');
                    recipeElement.innerHTML = `
                        <h3>${recipe.name}</h3>
                        <p>${recipe.description}</p>
                        <img src="${recipe.image_url}" alt="${recipe.name}" />
                    `;
                    resultsContainer.appendChild(recipeElement);
                });
            } else {
                resultsContainer.innerHTML = '<p>검색 결과가 없습니다.</p>';
            }
        })
        .catch(err => console.error('검색 오류:', err));
});

