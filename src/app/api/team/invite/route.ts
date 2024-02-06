import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',  // 사용하고자 하는 서비스
    host: 'smtp.gmail.com', // host를 gmail로 설정
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER_EMAIL, // Gmail 주소 입력
      pass: process.env.PASS // 앱 비밀번호 입력
    }
})

async function sendMail({ to, from, html, subject }:{to:string, from:string, html:string,subject:string}) {
    let info = await transporter.sendMail({
        from, // 보낸 사람 
        to, // 받는 사람
        subject, // 메일 제목
        html, // 메일 내용
    })    
}

export async function POST(req: Request) {
    const body = await req.json(); // body = ReadableStream
    console.log("invite : ",body)
    return sendMail(body)
      .then(
        () =>
          new Response(JSON.stringify({ message: '메일을 성공적으로 보냈음' }), {
            status: 200,
          })
      )
      .catch((error) => {
        console.error(error);
        return new Response(JSON.stringify({ message: '메일 전송에 실패함' }), {
          status: 500,
        });
      });
  }