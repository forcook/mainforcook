const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const app = express();

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
    host: 'localhost',  // 데이터베이스 호스트
    user: 'root',       // 데이터베이스 사용자
    password: '', // 데이터베이스 비밀번호
    database: 'forcook'  // 사용할 데이터베이스
});

// 데이터베이스 연결
db.connect((err) => {
    if (err) {
        console.error('DB 연결 실패:', err);
    } else {
        console.log('DB 연결 성공');
    }
});

// 미들웨어 설정
app.use(express.urlencoded({ extended: true }));  // POST 데이터 처리
app.use(express.json());  // JSON 데이터 처리
app.use(session({
    secret: 'secret',       // 세션 비밀 키
    resave: false,
    saveUninitialized: true
}));

// 정적 파일 경로 설정 (로그인, 회원가입 등 HTML 파일 경로)
app.use(express.static(path.join(__dirname, 'public')));

// 정적 파일 경로 설정 (이미지 파일 접근을 위한 설정)
app.use(express.static(path.join(__dirname, 'images')));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// 회원가입 라우터
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    // 이메일 중복 검사
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, result) => {
        if (err) {
            console.error('회원가입 오류:', err);
            return res.status(500).send('회원가입 오류');
        }

        // 이미 존재하는 이메일이 있는 경우
        if (result.length > 0) {
            return res.send(`
                <script>
                    alert("이미 사용 중인 이메일입니다. 다른 이메일을 사용해 주세요.");
                    window.location.href = "/signup";
                </script>
            `);
        }

        // 비밀번호 해시화
        bcrypt.hash(password, 12, (err, hashedPassword) => {
            if (err) {
                console.error('비밀번호 암호화 오류:', err);
                return res.status(500).send('비밀번호 암호화 오류');
            }

            // SQL 쿼리 실행 (사용자 정보 저장)
            const query = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
            db.query(query, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('회원가입 오류:', err);
                    return res.status(500).send('회원가입 오류');
                }

                console.log('회원가입 성공:', result);
                res.redirect('/signup-success'); // 회원가입 성공 후 페이지로 리디렉션
            });
        });
    });
});

// 회원가입 성공 페이지 라우터
app.get('/signup-success', (req, res) => {
    res.send(`
        <script>
            alert("회원가입이 완료되었습니다!");
            window.location.href = "/login";  // 로그인 페이지로 리디렉션
        </script>
    `);
});

// 로그인 라우터
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // 이메일로 사용자 조회 (대소문자 구분 없이 비교)
    const query = 'SELECT * FROM users WHERE LOWER(email) = LOWER(?)';
    db.query(query, [email], (err, result) => {
        if (err) {
            console.error('로그인 오류:', err);
            return res.status(500).send('로그인 오류');
        }

        if (result.length === 0) {
            console.log('사용자를 찾을 수 없습니다.');
            return res.status(400).send('사용자를 찾을 수 없습니다.');
        }

        // 비밀번호 비교
        bcrypt.compare(password, result[0].password_hash, (err, isMatch) => {
            if (err) {
                console.error('비밀번호 비교 오류:', err);
                return res.status(500).send('비밀번호 비교 오류');
            }

            if (isMatch) {
                // 로그인 성공 시 세션에 사용자 정보 저장
                req.session.user = result[0]; // 사용자 정보를 세션에 저장
                console.log('로그인 성공:', result[0].username);
                return res.redirect('/main.html'); // 메인 페이지로 리디렉션
            } else {
                console.log('비밀번호 불일치');
                return res.status(400).send('비밀번호가 일치하지 않습니다.');
            }
        });
    });
});

// 사용자 정보를 제공하는 API
app.get('/api/user', (req, res) => {
    if (req.session.user) {
        res.json({ username: req.session.user.username });
    } else {
        res.status(401).json({ message: '로그인하지 않았습니다.' });
    }
});

// 로그아웃 라우터
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('로그아웃 오류');
        }
        res.redirect('/login'); // 로그아웃 후 로그인 페이지로 리디렉션
    });
});

// 서버 시작
app.listen(3000, () => {
    console.log('서버가 3000번 포트에서 실행 중...');
});

