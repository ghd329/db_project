const express = require('express');
const mysql = require('mysql2');
const app = express();

// 중간고사 프로젝트 - 학생 성적 관리 시스템

// body 데이터 읽기용 설정 (이거 안 쓰면 req.body 안 읽힘)
app.use(express.json());
app.use(express.static('public')); // public 폴더 안에 HTML 파일들 넣을 예정

const db = mysql.createConnection({
    host: 'mydb',            
    user: 'root',
    password: '1234', // docker-compose에 적은 비밀번호와 일치시킬 것
    database: 'score_db'
});

db.connect((err) => {
    if (err) {
        console.log('DB 연결 에러 : ', err);
        return;
    }
    console.log('MySQL 연결 성공했습니다');
});

// 1. 학생 등록하는 API (화면에서 받아온 학번, 이름 저장)
app.post('/api/students', (req, res) => {
    const s_id = req.body.student_id;
    const s_name = req.body.name;
    
    // SQL 쿼리문 실행 (students 테이블에 인서트)
    const sql = 'INSERT INTO students (student_id, name) VALUES (?, ?)';
    db.query(sql, [s_id, s_name], (err, result) => {
        if (err) {
            return res.json({ status: 'fail', message: '등록 실패..' });
        }
        res.json({ status: 'success' });
    });
});

// 2. 성적 입력하는 API (학번, 과목, 점수 저장)
app.post('/api/scores', (req, res) => {
    const s_id = req.body.student_id;
    const subj = req.body.subject;
    const pt = req.body.point;

    const sql = 'INSERT INTO scores (student_id, subject, point) VALUES (?, ?, ?)';
    db.query(sql, [s_id, subj, pt], (err, result) => {
        if (err) return res.json({ status: 'fail' });
        res.json({ status: 'success' });
    });
});

// 3. 학생 성적이랑 등급 계산해서 보내주는 API
app.get('/api/results', (req, res) => {
    // 학생 정보와 성적 정보를 학번(student_id) 기준으로 조인(JOIN)해서 가져오는 쿼리문
    const sql = `
        SELECT s.student_id, s.name, sc.subject, sc.point,
               CASE 
                   WHEN sc.point >= 90 THEN 'A'
                   WHEN sc.point >= 80 THEN 'B'
                   ELSE 'C'
               END AS grade
        FROM students s
        JOIN scores sc ON s.student_id = sc.student_id
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'DB 조회 실패' });
        }
        res.json(results); // 브라우저에게 JSON 형태로 결과 전달
    });
});

app.listen(3000, () => {
    console.log('3000포트 서버');
});