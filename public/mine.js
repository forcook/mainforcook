document.getElementById("recipe-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let isValid = true;

    const fields = [
        { id: "recipe-name", message: "레시피 이름은 필수입니다." },
        { id: "description", message: "요리 설명을 입력해주세요." },
        { id: "ingredients", message: "재료 목록을 입력해주세요." },
        { id: "instructions", message: "조리 방법을 입력해주세요." },
        { id: "cooking-time", message: "조리 시간을 입력해주세요." },
        { id: "difficulty", message: "난이도를 선택해주세요." },
        { id: "category", message: "카테고리를 선택해주세요." }
    ];

    fields.forEach(function(field) {
        const input = document.getElementById(field.id);
        if (!input.value.trim()) {
            isValid = false;
            alert(field.message);
            input.style.borderColor = "red"; // 유효성 실패 시 경고
        } else {
            input.style.borderColor = ""; // 유효성 성공 시 기본 테두리
        }
    });

    if (!isValid) {
        return;
    }

    // 레시피 추가 후 성공 메시지 표시
    document.getElementById("confirmation-message").style.display = "block";
    setTimeout(function() {
        document.getElementById("confirmation-message").style.display = "none";
    }, 3000);  // 3초 후 숨기기

    // 폼 초기화
    document.getElementById("recipe-form").reset();
});

// 이미지 미리보기 기능
function previewImage(event) {
    const preview = document.getElementById('image-preview');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        preview.innerHTML = `<img src="${e.target.result}" alt="레시피 사진" class="preview-img">`;
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}
