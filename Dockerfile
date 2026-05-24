# 1. Node 이미지 가져오기
FROM node:18

# 2. 컨테이너 내부의 작업 디렉토리 설정
WORKDIR /app

# 3. 라이브러리 설치를 위해 package 파일들 복사
COPY package*.json ./

# 4. 필수 패키지 설치
RUN npm install

# 5. 소스코드 전체 복사 (public 폴더 포함)
COPY . .

# 6. 백엔드가 사용하는 3000번 포트 열어주기
EXPOSE 3000

# 7. 서버 실행 명령
CMD ["node", "app.js"]