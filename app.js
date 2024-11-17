const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3000;

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

// 미들웨어 설정
app.use(express.urlencoded({ extended: true }));  // POST 데이터 처리
app.use(express.json());  // JSON 데이터 처리
app.use(session({
    secret: 'secret',       // 세션 비밀 키
    resave: false,
    saveUninitialized: true
}));

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

// 로그인 확인 미들웨어
function checkAuthentication(req, res, next) {
    if (!req.session.user) {
        return res.status(403).send('로그인 후 사용하십시오.');
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

    // 이메일 중복 검사
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [email], (err, result) => {
        if (err) {
            console.error('회원가입 오류:', err);
            return res.status(500).send('회원가입 오류');
        }

        // 이메일이 이미 존재하는 경우
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

            // 사용자 정보 저장
            const query = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
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

// 사용자 정보 API
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

// 로그인 처리 (로그인 성공 시)
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
                console.log('로그인 성공:', result[0].username);
                return res.redirect('/main.html'); // 메인 페이지로 리디렉션
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


// 레시피 추가 API
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



// 레시피 가져오기 API
app.get('/api/recipes', (req, res) => {
    const { category } = req.query;

    const query = `SELECT recipes.recipe_id, recipes.name, recipes.description, recipes.total_time, 
                          recipes.image_url, GROUP_CONCAT(ingredients.name) AS ingredients
                   FROM recipes
                   LEFT JOIN recipe_ingredients ON recipes.recipe_id = recipe_ingredients.recipe_id
                   LEFT JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.ingredient_id
                   WHERE recipes.category = ?
                   GROUP BY recipes.recipe_id`;

    db.query(query, [category], (err, results) => {
        if (err) {
            return res.status(500).send('레시피 데이터를 가져올 수 없습니다.');
        }
        res.json(results);
    });
});

app.get('/recipe/:id', (req, res) => {
    const recipeId = req.params.id;

    if (!recipeId || isNaN(recipeId)) {
        return res.status(400).json({ error: '유효하지 않은 레시피 ID입니다.' });
    }

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
        const ingredientsQuery = `SELECT i.name FROM ingredients i
                                   JOIN recipe_ingredients ri ON i.ingredient_id = ri.ingredient_id
                                   WHERE ri.recipe_id = ?`;
        db.query(ingredientsQuery, [recipeId], (err, ingredients) => {
            if (err) {
                console.error('재료 조회 오류:', err);
                return res.status(500).json({ error: '재료 조회 오류' });
            }

            // 재료가 있는지 확인
            console.log('재료:', ingredients);

            const steps = recipe.steps.split('\n');
            res.render('recipe', {
                recipe: recipe,
                ingredients: ingredients, // ingredients 데이터를 ejs로 전달
                steps: steps.join('\n')
            });
        });
    });
});


// 레시피 검색 API
app.get('/api/search', (req, res) => {
    const { query } = req.query; // 검색 쿼리 파라미터
    if (!query) {
        return res.status(400).json({ error: '검색어를 입력하세요.' });
    }

    const sql = `
        SELECT recipes.recipe_id, recipes.name, recipes.description, recipes.image_url, recipes.category 
        FROM recipes 
        WHERE recipes.name LIKE ? OR recipes.description LIKE ? OR recipes.category LIKE ?
    `;
    const queryValue = `%${query}%`;
    db.query(sql, [queryValue, queryValue, queryValue], (err, results) => {
        if (err) {
            console.error('검색 오류:', err);
            return res.status(500).json({ error: '검색 중 오류가 발생했습니다.' });
        }
        res.json(results);
    });
});


// 레시피 즐겨찾기 추가
app.post('/api/favorites', checkAuthentication, (req, res) => {
    const userId = req.session.user.user_id;
    const { recipeId } = req.body;

    const sql = `INSERT INTO favorites (user_id, recipe_id) VALUES (?, ?) 
                 ON DUPLICATE KEY UPDATE favorite_id = favorite_id`;
    db.query(sql, [userId, recipeId], (err, result) => {
        if (err) {
            console.error('즐겨찾기 추가 오류:', err);
            return res.status(500).json({ error: '즐겨찾기 추가 중 오류 발생' });
        }
        res.json({ message: '즐겨찾기에 추가되었습니다.' });
    });
});

// 즐겨찾기 삭제
app.delete('/api/favorites', checkAuthentication, (req, res) => {
    const userId = req.session.user.user_id;
    const { recipeId } = req.body;

    const sql = `DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?`;
    db.query(sql, [userId, recipeId], (err, result) => {
        if (err) {
            console.error('즐겨찾기 삭제 오류:', err);
            return res.status(500).json({ error: '즐겨찾기 삭제 중 오류 발생' });
        }
        res.json({ message: '즐겨찾기에서 제거되었습니다.' });
    });
});

// 사용자의 즐겨찾기 가져오기
app.get('/api/favorites', checkAuthentication, (req, res) => {
    const userId = req.session.user.user_id;

    const sql = `
        SELECT recipes.recipe_id, recipes.name, recipes.description, recipes.image_url
        FROM favorites 
        JOIN recipes ON favorites.recipe_id = recipes.recipe_id
        WHERE favorites.user_id = ?
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('즐겨찾기 조회 오류:', err);
            return res.status(500).json({ error: '즐겨찾기 조회 중 오류 발생' });
        }
        res.json(results);
    });
});




// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});

