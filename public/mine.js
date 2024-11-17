document.getElementById('recipe-form').addEventListener('submit', function(event) {
    event.preventDefault(); // 기본 폼 제출 방지

    const formData = new FormData(this); // 폼 데이터 수집

    fetch('/addRecipe', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('레시피 추가 실패');
        }
    })
    .then(data => {
        alert(data.message); // 성공 메시지 알림
        window.location.href = 'main.html'; // 메인 페이지로 리디렉션
    })
    .catch(error => {
        console.error('Error:', error);
        alert('레시피 추가 중 오류가 발생했습니다.');
    });
});

