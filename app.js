const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config(); // 환경 변수 사용


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
    host: 'localhost',  // 데이터베이스 호스트
    user: 'root',       // 데이터베이스 사용자
    password: '',       // 데이터베이스 비밀번호
    database: 'forcook' // 사용할 데이터베이스
});

// 데이터베이스 연결
db.connect((err) => {
    if (err) {
        console.error('DB 연결 실패:', err);
    } else {
        console.log('DB 연결 성공');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html')); // main.html 파일 경로 수정
});

// 미들웨어 설정
app.use(express.urlencoded({ extended: true }));  // POST 데이터 처리
app.use(express.json());  // JSON 데이터 처리
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true
}));

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.get('/main', (req, res) => {
    const isLoggedIn = !!req.session.userId; // 로그인 상태 확인
    const username = req.session.user ? req.session.user.username : null; // 사용자 이름 저장
    res.sendFile(path.join(__dirname, 'public', 'main.html'), { user: { isLoggedIn, username } }); // HTML 파일 전송
});

app.use(express.static(path.join(__dirname, 'public')));

// meat.html로 이동하는 라우트
app.get('/meat.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'meat.html'));
});

// main.html로 이동하는 라우트
app.get('/main.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'main.html'));
});


// Multer 파일 업로드 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // 파일 저장 위치
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름 설정
    }
});

const upload = multer({ storage: storage });

// 정적 파일 경로 설정
app.use(express.static(path.join(__dirname, 'public')));  // HTML, CSS, JS 등
app.use(express.static(path.join(__dirname, 'images')));  // 이미지 파일 접근 설정
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/recipe', express.static(path.join(__dirname, 'public/recipes')));
app.get('/recipes', (req, res) => {
    res.render('recipes'); // recipes.ejs 렌더링
});

function checkAuthentication(req, res, next) {
    if (!req.session.userId) {
        return res.status(403).json({ success: false, message: '로그인 후 사용하십시오.' });
    }
    next();
}



// 로그인, 회원가입 페이지
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// 회원가입 처리
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, result) => {
        if (err) {
            console.error('회원가입 오류:', err);
            return res.status(500).send('회원가입 오류');
        }

        if (result.length > 0) {
            return res.send(`
                <script>
                    alert("이미 사용 중인 이메일입니다. 다른 이메일을 사용해 주세요.");
                    window.location.href = "/signup";
               </script>
            `);
        }

        bcrypt.hash(password, 12, (err, hashedPassword) => {
            if (err) {
                console.error('비밀번호 암호화 오류:', err);
                return res.status(500).send('비밀번호 암호화 오류');
            }

            const query = `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`;
            db.query(query, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error('회원가입 오류:', err);
                    return res.status(500).send('회원가입 오류');
                }

                res.redirect('/signup-success');
            });
        });
    });
});
// 회원가입 성공 페이지
app.get('/signup-success', (req, res) => {
    res.send(`
        <script>
            alert("회원가입이 완료되었습니다!");
            window.location.href = "/login";
        </script>
    `);
});

app.get('/api/user', (req, res) => {
    if (req.session.user) {
        res.json({
            username: req.session.user.username,
            email: req.session.user.email
        });
    } else {
        res.status(401).json({ error: '로그인되지 않았습니다.' });
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE LOWER(email) = LOWER(?)';
    
    db.query(query, [email], (err, result) => {
        if (err) {
            console.error('로그인 오류:', err);
            return res.status(500).send('로그인 오류');
        }
        
        if (result.length === 0) {
            return res.status(400).send('사용자를 찾을 수 없습니다.');
        }
        
        // 비밀번호 비교
        bcrypt.compare(password, result[0].password_hash, (err, isMatch) => {
            if (err) {
                return res.status(500).send('비밀번호 비교 오류');
            }
            
            if (isMatch) {
                // 로그인 성공 시 세션에 사용자 정보 저장
                req.session.user = result[0]; // 사용자 정보를 세션에 저장
                req.session.userId = result[0].user_id; // 사용자 ID 저장
                console.log('로그인 성공:', result[0].username);
                
                // 메인 페이지로 리디렉션
                return res.redirect('/main.html'); // EJS 템플릿을 사용하고 있다면 /main으로
            } else {
                console.log('비밀번호 불일치');
                return res.status(400).send('비밀번호가 일치하지 않습니다.');
            }
        });
    });
});


// 로그아웃 처리
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('로그아웃 오류');
        }
        res.redirect('/login');
    });
});


// 
app.post('/addRecipe', upload.single('recipe-photo'), (req, res) => {
    const { recipeName, description, ingredients, instructions, totalTime, difficulty, category } = req.body;
    const recipePhoto = req.file ? req.file.filename : null;

    const query = `INSERT INTO recipes (name, description, steps, total_time, difficulty, category, image_url)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [recipeName, description, instructions, totalTime, difficulty, category, recipePhoto], (err, result) => {
        if (err) {
            console.error('레시피 추가 오류:', err);
            return res.status(500).send('레시피 추가 오류');
        }

        const recipeId = result.insertId;
        const ingredientsArray = ingredients.split(',').map(ing => ing.trim());

        // 재료 추가
        ingredientsArray.forEach(ingredient => {
            const ingredientQuery = `INSERT INTO ingredients (name) VALUES (?) 
                                     ON DUPLICATE KEY UPDATE ingredient_id=LAST_INSERT_ID(ingredient_id)`;
            db.query(ingredientQuery, [ingredient], (err, result) => {
                if (err) {
                    console.error('재료 추가 오류:', err);
                    return;
                }
                const ingredientId = result.insertId;
                
                // 레시피와 재료 연결
                const relationQuery = `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount)
                                       VALUES (?, ?, ?)`;
                db.query(relationQuery, [recipeId, ingredientId, null], err => {
                    if (err) {
                        console.error('레시피-재료 관계 추가 오류:', err);
                    }
                });
            });
        });

        res.json({ message: '레시피가 성공적으로 추가되었습니다!', recipeId });
    });
});



app.get('/api/favorites', (req, res) => {
    const userId = req.query.userId;

    const sql = `
        SELECT f.favorite_id, r.recipe_id, r.name AS recipe_name, r.image_url, r.description, r.steps
        FROM favorites f
        JOIN recipes r ON f.recipe_id = r.recipe_id
        WHERE f.user_id = ?`;
    
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('즐겨찾기 목록 가져오기 오류:', err);
            return res.status(500).json({ success: false, message: '즐겨찾기 목록 가져오기 중 오류 발생' });
        }
        res.json({ success: true, favorites: results });
    });
});


app.get('/recipe/:id', (req, res) => {
    const recipeId = req.params.id;

    // 유효한 ID인지 확인
    if (!recipeId || isNaN(recipeId)) {
        return res.status(400).json({ error: '유효하지 않은 레시피 ID입니다.' });
    }

    // 레시피 조회
    const query = 'SELECT * FROM recipes WHERE recipe_id = ?';
    db.query(query, [recipeId], (err, result) => {
        if (err) {
            console.error('레시피 조회 오류:', err);
            return res.status(500).json({ error: '레시피 조회 오류' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: '레시피를 찾을 수 없습니다.' });
        }

        const recipe = result[0];

        // 재료 조회
        const ingredientsQuery = `SELECT i.name FROM ingredients i
                                  JOIN recipe_ingredients ri ON i.ingredient_id = ri.ingredient_id
                                  WHERE ri.recipe_id = ?`;
        db.query(ingredientsQuery, [recipeId], (err, ingredients) => {
            if (err) {
                console.error('재료 조회 오류:', err);
                return res.status(500).json({ error: '재료 조회 오류' });
            }

            // recipe와 ingredients를 EJS로 전달
            res.render('recipe', {
                recipe: recipe,
                ingredients: ingredients // 이 부분에서 ingredients가 전달됨
            });
        });
    });
});


app.get('/api/recipes', (req, res) => {
    const { category } = req.query;

    // SQL 쿼리
    const query = `
        SELECT 
            recipes.recipe_id, 
            recipes.name, 
            recipes.description, 
            recipes.total_time, 
            recipes.image_url, 
            GROUP_CONCAT(ingredients.name) AS ingredients
        FROM recipes
        LEFT JOIN recipe_ingredients ON recipes.recipe_id = recipe_ingredients.recipe_id
        LEFT JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.ingredient_id
        WHERE recipes.category = ?
        GROUP BY recipes.recipe_id
    `;

    // 쿼리 실행
    db.query(query, [category], (err, results) => {
        if (err) {
            return res.status(500).send('레시피 데이터를 가져올 수 없습니다.');
        }
        res.json(results);
    });
});

// 레시피 검색 API
app.get('/api/search', (req, res) => {
    const { query } = req.query; // 검색 쿼리 파라미터
    if (!query) {
        return res.status(400).json({ error: '검색어를 입력하세요.' });
    }

    // 검색어를 쉼표로 구분하여 배열로 분리
    const searchTerms = query.split(',').map(term => term.trim());

    if (searchTerms.length === 0) {
        return res.status(400).json({ error: '유효한 검색어를 입력하세요.' });
    }

    // 검색 조건 생성
    const conditions = searchTerms
        .map(() => `(recipes.name LIKE ? OR recipes.description LIKE ? OR recipes.category LIKE ?)`)
        .join(' OR ');

    const values = searchTerms.flatMap(term => {
        const likeQuery = `%${term}%`;
        return [likeQuery, likeQuery, likeQuery];
    });

    const sql = `
        SELECT recipes.recipe_id, recipes.name, recipes.description, recipes.image_url, recipes.category
        FROM recipes
        WHERE ${conditions}
    `;
	
    console.log("Generated SQL Query:", sql);
    console.log("Query Values:", values);

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('검색 오류:', err);
            return res.status(500).json({ error: '검색 중 오류가 발생했습니다.' });
        }
        console.log("Query Results:", results);
        res.json(results);
    });
});


// 즐겨찾기 추가 API
app.post('/api/favorite', checkAuthentication, (req, res) => {
    const userId = req.session.userId; // 세션에서 사용자 ID 가져오기
    const { recipeId } = req.body; // POST 요청의 body에서 recipeId 가져오기

    if (!recipeId) {
        return res.status(400).json({ success: false, message: '레시피 ID가 필요합니다.' });
    }

    const sql = `INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?) 
                 ON DUPLICATE KEY UPDATE favorite_id = favorite_id`;
    db.query(sql, [userId, recipeId], (err, result) => {
        if (err) {
            console.error('즐겨찾기 추가 오류:', err);
            return res.status(500).json({ success: false, message: '즐겨찾기 추가 중 오류 발생' });
        }
        res.json({ success: true, message: '즐겨찾기에 추가되었습니다.' });
    });
});


app.get('/api/favorites', checkAuthentication, (req, res) => {
    const userId = req.session.userId; // 세션에서 사용자 ID 가져오기

    const sql = `SELECT * FROM favorites WHERE user_id = ?`;
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('즐겨찾기 목록 가져오기 오류:', err);
            return res.status(500).json({ success: false, message: '즐겨찾기 목록 가져오기 중 오류 발생' });
        }
        res.json({ success: true, favorites: results });
    });
});



app.delete('/api/favorites/:id', (req, res) => {
    const favoriteId = req.params.id;

    const sql = 'DELETE FROM favorites WHERE favorite_id = ?';
    db.query(sql, [favoriteId], (err, results) => {
        if (err) {
            console.error('즐겨찾기 삭제 오류:', err);
            return res.status(500).json({ success: false, message: '서버 오류' });
        }
        res.json({ success: true, message: '즐겨찾기 삭제 완료' });
    });
});


// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});

