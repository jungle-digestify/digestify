# DIGEST [![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fjungle-digestify&count_bg=%233DC8BC&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=Digest&edge_flat=false)](https://hits.seeyoufarm.com)

<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://digest-jungle.site/playground-hjin/" target="_blank">
    <img src="https://github.com/jungle-digestify/digestify/assets/147629257/6fdd44bd-4dd7-497b-bca0-de91c7233fba" alt="Logo" width="" height="">

  </a>

  <p align="center">
   <i>for Collaboration</i>
  </p>
  <p align="center">
    <b> 크롬 익스텐션을 통해 유튜브 동영상 정보를 받아와 요약하고, 요약본을 협업 스페이스에서 공유할 수 있는 AI 기반 서비스</b>
  </p>
</div>

<!-- TABLE OF CONTENTS -->

## 목차

1. [프로젝트 개요](#Digest)
2. [서비스 소개](#Intro)
3. [서비스 이용방법](#HowtoUse)
4. [서비스 구조도](#Arch)
5. [프로젝트 포스터](#Poster)

<!-- ABOUT THE PROJECT -->

<a name="DIGEST"> </a>

## 🗓프로젝트 개요

프로젝트 기간 : 2024.01.14 ~ 2024.02.23

기술 스택 :

| 분류                      | 기술                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**              | <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white"/> <img src="https://img.shields.io/badge/tailwindcss-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"> <img src="https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff&style=for-the-badge&color=grey">|
| **Extension**             | <img src="https://img.shields.io/badge/Extension Manifest v3-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white"> <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/OpenAI-4479A1?style=for-the-badge&logo=OpenAI&logoColor=white">                                                                                                      |
| **Backend**               | <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white"/> <img src="https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=PM2&logoColor=white"/>                                                                                                                                                                                                                                                                                                                                |
| **Database**              | <img src="https://img.shields.io/badge/postgresql-4479A1?style=for-the-badge&logo=postgresql&logoColor=white"> <img src="https://img.shields.io/badge/drizzleorm-C5F74F?style=for-the-badge&logo=Drizzle&logoColor=black">                                                                                                         |
| **Infrastructure/DevOps/API** | <img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"> <img src="https://img.shields.io/badge/aws_ec2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white">           |


👨‍👨‍👦‍👦 팀원 : [배성재](https://github.com/sungjaebae)(TL/FE,BE,Deploy), [송형진](https://github.com/hyeongjinsong)(BE), [조현지](https://github.com/chohyunji1007)(FE), [진상하](https://github.com/slemdem)(BE), [허용민](https://github.com/JungleHuh)(FE)

🌐 웹사이트 : [바로가기](https://digest-jungle.site/playground-hjin/)

📹 시연 영상 : [바로가기]()

📷 현장 발표영상 : [바로가기]()

<p align="right">(<a href="#readme-top">맨 위로</a>)</p>

<a name="Intro"> </a>

## 서비스 소개

<h3> DIGEST는 AI 기반 유튜브 요약툴입니다. </h3>
 
- 정보의 홍수 시대에, __유튜브 정보를 효율적 파악__ 하기 위해 개발되었습니다.
- 유튜브 영상 옆의 버튼을 누르면, 대시보드에 영상 요약이 바로 뜹니다.
- 에디터를 이용해 __요약한 정보를 수정 및 하이라이팅__ 할 수 있습니다.
- __협업 스페이스에 영상 요약본을 공유__ 할 수 있습니다.

 <h3 align="left">주요 기능</h3>
 
#### 1. 크롬 익스텐션를 이용한 원클릭 요약 기능
- 유튜브 홈페이지에서 원클릭으로 요약 내용을 대시보드에 저장할 수 있습니다.
- 클릭한 영상은 대시보드에 자동으로 들어옵니다.
<table border="0" >
<tr>
<td><img width="300" height="400" src="https://github.com/jungle-digestify/digestify/assets/147629257/272ec3ec-98ee-4829-96dd-7e8d8d2bd890"> </img></td>
<br/>
<td><img width="1000" height="400" src="https://github.com/jungle-digestify/digestify/assets/147629257/ca3090ec-4a2e-4eaa-a63b-d3ac914f7b84"> </img></td>
<tr/>
<table/>

#### 2. 요약된 내용 수정 기능
- GPT가 생성한 요약본을 사용자가 직접 수정할 수 있습니다.
- 하이라이팅 기능, 볼드 기능을 통해 중요한 부분을 강조할 수 있습니다.
<table border="0" >
<tr>
<td><img width="500" height="400" src="https://github.com/jungle-digestify/digestify/assets/147629257/1e37a0c2-f855-4e37-94b0-4485dd3a532f"> </img></td>
<br/>
<tr/>
<table/>

  
<!-- 여기 포스터 넣어주세용 -->
<!-- This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). 

#### 2. 요약한 내용 수정 기능
- GPT가 요약한 내용을 내장된 에디터를 이용해, 사용자가 직접 수정할 수 있습니다.

<h1>Digest (2022.01.12 - 2022.02.24)</h1>

### 유튜브 영상 요약 및 공유가 가능한 AI기반 서비스

- 크롬 익스텐션을 통한 유튜브 영상 AI 요약 및 요약 수정 
- 개인 스페이스 또는 팀 스페이스를 통해 요약 공유 가능

### 🗓️ 프로젝트 기간
##     2024.01.14 ~ 2024.02.23

### 🔗 바로가기 
 - 서비스:
 - 발표영상:

   
### 👨‍👨‍👦‍👦 팀원 소개
이름	역할
배성재	개발환경 구축 및 배포,TRPC, Next.Auth 로그인/회원가입 기능 구현, 
송형진 협업 스페이스 구성, 협업스페이스 초대시 메일 전송 기능 구현, 유튜브 데이터 전송 크롬 익스텐션 구현
조현지	반응형 UI/UX, React-Player를 사용한 동영상 서비스 구현, 타임 스탬프 구현
진상하	에디터 구현, DB 설계, 협업 스페이스 구현
허용민


### 사용 방법
1. extension 폴더를 다운받아 chrome 확장 프로그램에 추가한다.
2. 페이지에서 회원가입을 한다.
3. 익스텐션을 켜고, 유튜브에 들어가 요약을 원하는 영상에서 뜨는 익스텐션 아이콘을 누른다.
4. 페이지로 돌아와 요약된 내용을 확인하고, 텍스트 수정이 가능하다.
5. 처음 요약 내용은 개인 스페이스에 저장되며, 공유하기를 눌러 팀 스페이스로 공유한다.

## Getting Started

```bash
pnpm exec drizzle-kit push:sqlite
```

## env list

```bash
GITHUB_ID =
GITHUB_SECRET =
NEXTAUTH_SECRET=
OPENAI_API_KEY=
```

then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
-->
