// 검색 기능
function handleSearch() {
    const query = document.querySelector("#searchInput").value.trim();
    const resultsDiv = document.querySelector("#searchResults");

    if (!query) {
        resultsDiv.innerHTML = "<p>검색어를 입력하세요.</p>";
        return;
    }

    // 검색 결과를 동적으로 표시 (여기서는 예제 데이터 사용)
    const dummyData = [
        { title: "채식 레시피 1", description: "채소로 만든 건강한 레시피." },
        { title: "육식 레시피 1", description: "육류로 만든 고소한 요리." },
        { title: "BEST 레시피", description: "인기 있는 베스트 요리." },
    ];

    const filteredData = dummyData.filter((item) =>
        item.title.includes(query) || item.description.includes(query)
    );

    resultsDiv.innerHTML = ""; // 기존 결과 초기화

    if (filteredData.length === 0) {
        resultsDiv.innerHTML = "<p>검색 결과가 없습니다.</p>";
        return;
    }

    filteredData.forEach((item) => {
        const resultItem = document.createElement("div");
        resultItem.className = "result-item";
        resultItem.innerHTML = `
            <h2>${item.title}</h2>
            <p>${item.description}</p>
        `;
        resultsDiv.appendChild(resultItem);
    });
}

// 검색 버튼 이벤트 등록
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#searchButton").addEventListener("click", handleSearch);
});

