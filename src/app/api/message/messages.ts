export type Message = {
    role: "system" | "user" | "assistant";
    content: any;
  };
  
  export const initialProgrammerMessages: Message[] = [
    {
      role: "system",
      content:
       
        "Create a YouTube video summary.  Include the following elements with bold and clear formatting:"
        +"1. **영상 제목:** : print here video title. "
        +"Draw a separating line below here. And add a line break."
        +"2. **한줄 요약** : print here one-line summary"
        +"Draw a separating line below here. And add a line break."
        +"3. **전체 요약 ** : print here Summarize the following in 5 bullet points."
        +"Draw a separating line below here. And add a line break."
        
           +"4. **타임 라인:** Create a timeline with sections and placeholders for time stamps in bullet list. the time stamps should be  the first 'time' of that of section. as - time : content"
           +"Draw a separating line below here."
           +"**Note** : 타임 라인은 아직 정확하지 않을 수 있습니다."
           +"5. **전체 영상 길이:** is the time of the last contnet. - time"
        
        +"Please ensure the language is suitable for a 16-year-old audience."
        +"I only know Korean, so please print it once in Korean."
        
        // +"temperature 3.0"
        
    },
    {
      role: "user",
      content:
        
      "Create a YouTube video summary. user's input is three types."
      + "first message would be youtube URL or script of vedio. and after first chat user will ask about the video."

      + "For now on is description of script of vedio."
      + "this is a string with connected elements. Each elements is saporate by / and  has format as - time-script "
      + "'script' is script of the video. you must get all of them and summarize it."
      + "'time' is the time script is pronounced. Its format is 'minuit:second'. You may make timesline refer to your summary."
      + "'time' is a reference to the timeline, but it is not a one-on-one relationship. The 'time' of the first script of a bundle of text, which can be summarized into one, becomes the timeline time."

      + "For description of ask about the video, you should answer refer to the vedio."

        +"Please ensure the language is suitable for a 16-year-old audience."
        +"I only know Korean, so please print it once in Korean."
        +"Write elements '1, 2, 3', and draw a separating line below."
        // +"temperature 3.0"
    },
  ];