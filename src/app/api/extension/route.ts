import { NextRequest, NextResponse } from "next/server";

import { getSubtitles, getVideoDetails } from "youtube-caption-extractor";
import { fetchTranscript } from "youtube-subtitle-transcript";

export const POST = async (req: NextRequest, res: NextResponse) => {
  // 스패너 돌기 시작

  console.log("Post 요청 들어옴");
  const data = await readRequestBody(req);

  let videoURL = data.videoUrl;
  if (videoURL) {
    console.log("유튜브인 경우");
    const { transcript, error } = await fetchTranscript(videoURL, "ko");
    let parsed_script = transcript.map((entry) => entry.text).join("");
    let lang = "ko";
    const videoDetails = await getVideoDetails({ videoID: videoURL, lang });
    console.log(parsed_script);
    console.log(videoDetails);

    return new Response("OK");
  } else {
    // 유튜브 동영상 말고 그냥 데이터 인 경우
    let url = data.url;
    let contents = data.contents;
    console.log(url, contents);
  }
  return new Response("OK");
};

async function readRequestBody(req: Request) {
  const chunks = [];
  for await (const chunk of req.body as any) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString());
}

// preflight - OPTIONS
export const OPTIONS = async (req: NextRequest, res: NextResponse) => {
  console.log("options..");
  console.log(req);
  return new Response("OK");
};
