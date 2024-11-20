<script>
        document.getElementById('login-form').addEventListener('submit', function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // 서버에 로그인 요청
            fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                // 로그인 성공 시 사용자 정보를 로컬 스토리지에 저장
                localStorage.setItem('username', data.username);
                localStorage.setItem('email', data.email);
                window.location.href = 'main.html'; // 메인 페이지로 이동
            })
            .catch(error => {
                console.error('로그인 오류:', error);
            });
        });
    </script>
