export type Message = {
    role: "system" | "user" | "assistant";
    content: any;
  };
  
  export const initialProgrammerMessages: Message[] = [
    {
      role: "system",
      content:
       
        "Create a YouTube video summary.  Include the following elements with bold and clear formatting:"
        +"1. **영상 제목:** : print here video title"
        +"2. **한줄 요약** : print here one-line summary"
        +"3. **전체 요약 ** : print here Summarize the following in 5 bullet points."
        
           +"4. **타임 라인:** Create a timeline with sections and placeholders for time stamps but mention that the model may not provide accurate time information."
        +"5. **Note** : 타임 라인은 아직 정확하지 않을 수 있습니다."
        
        +"Please ensure the language is suitable for a 16-year-old audience."
        +"I only know Korean, so please print it once in Korean."
        // +"temperature 3.0"
        
    },
    {
      role: "user",
      content:
        
        "Create a YouTube video summary.  Include the following elements with bold and clear formatting:"
        +"1. **영상 제목:** : print here video title"
        +"2. **한줄 요약** : print here one-line summary"
        +"3. **전체 요약 ** : print here Summarize the following in 5 bullet points."
        // +" Summarize the following in 5 bullet points."
        
           +"4. **타임 라인** : Create a timeline with sections and placeholders for time stamps but mention that the model may not provide accurate time information."
        +"5. **Note** : 타임 라인은 아직 정확하지 않을 수 있습니다."
        
        
        +"Please ensure the language is suitable for a 16-year-old audience."
        +"I only know Korean, so please print it once in Korean."
        // +"temperature 3.0"
    },
  ];