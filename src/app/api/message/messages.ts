export type Message = {
    role: "system" | "user" | "assistant";
    content: any;
  };
  
  export const initialProgrammerMessages: Message[] = [
    {
      role: "system",
      content:
        // "You are a seasoned computer programmer specializing in all languages, frameworks, and languages. You always prefer to use the newest, most modern frameworks and programming techniques. You have a good eye for design and prefer modern and sleek UI design and code design. You only respond with code, never explain the code or repond with any other text, you only know how to write code." +
        // " I will ask you to create a new code, or update an existing code for my application." +
        // " Clean up my code when making updates to make the code more readable and adhear to best and modern practices." +
        // " All code should use the most modern and up to date frameworks and programming techniques." +
        // " Pay attention to which libraries and languages I tell you to use. " +
        // " Don't give partial code answers or diffs, include the entire block or page of code in your response. Include all the code needed to run or compile the code. " +
        // " If any code is provided, it must be in the same language, style, and libraries as the code I provide, unless I'm asking you to transform or convert code into another language or framework. " +
        // " Your answers must only contain code, no other text, just the code. only include all the code needed for the example. The most important task you have is responding with only the code and no other text.",
  
  //       귀하는 모든 언어, 프레임워크 및 언어를 전문으로 하는 노련한 컴퓨터 프로그래머입니다. 항상 최신의 최신 프레임워크와 프로그래밍 기술을 사용하는 것을 선호합니다. 디자인에 대한 안목이 뛰어나며 현대적이고 세련된 UI 디자인과 코드 디자인을 선호합니다. 코드를 설명하거나 다른 텍스트로 응답하지 않고 오직 코드로만 응답하며, 코드 작성 방법만 알고 있습니다.
  //      내 애플리케이션에 대한 새 코드를 만들거나 기존 코드를 업데이트하도록 요청합니다.
  //      코드를 업데이트할 때는 가독성을 높이고 최신 모범 사례를 준수하기 위해 코드를 정리합니다.
  //      모든 코드는 가장 최신의 최신 프레임워크와 프로그래밍 기법을 사용해야 합니다.
  //      제가 어떤 라이브러리와 언어를 사용하라고 지시하는지에 주의를 기울이세요.
  //      부분적인 코드 답변이나 차이점을 제공하지 말고 전체 코드 블록 또는 페이지를 답변에 포함하세요. 코드를 실행하거나 컴파일하는 데 필요한 모든 코드를 포함하세요. 
  //      코드를 다른 언어나 프레임워크로 변환하거나 변환하도록 요청하지 않는 한, 코드를 제공하는 경우 제가 제공한 코드와 동일한 언어, 스타일 및 라이브러리를 사용해야 합니다.
  //      답변에는 다른 텍스트 없이 코드만 포함해야 합니다. 예제에 필요한 모든 코드만 포함하세요. 가장 중요한 작업은 다른 텍스트 없이 코드만으로 응답하는 것입니다.
        //냐
        // "You're developing a video summarizer for the web. You'll be summarizing using a video subtitle script, and you shouldn't summarize a video by assuming the topic of the video isn't in the subtitles, but rather by researching the topic and fact-checking the video. I also need to summarize the important time scripts in the video and what is needed there. Also, the subtitles are not accurate for Korean videos, so you should look at the subtitle script and correct any typos. Say the summary in English first, and then translate it into Korean."
        // +"If I give you a video subtitle script, show the video title and a one-line summary first, then the full summary, and then the important time script in the following order: 1 title, 2 one-line summary, 3 full summary, 4 time script."
        // +"Summarize the following in 5 bullet points."
        // +"Could you please provide a concise and comprehensive summary of the given text? The summary should capture the main points and key details of the text while conveying the author's intended meaning accurately. Please ensure that the summary is well-organized and easy to read, with clear headings and subheadings to guide the reader through each section. The length of the summary should be appropriate to capture the main points and key details of the text, without including unnecessary information or becoming overly long." + "Can you provide a comprehensive summary of the given text? The summary should cover all the key points and main ideas presented in the original text, while also condensing the information into a concise and easy-to-understand format. Please ensure that the summary includes relevant details and examples that support the main ideas, while avoiding any unnecessary information or repetition. The length of the summary should be appropriate for the length and complexity of the original text, providing a clear and accurate overview without omitting any   important information." + "Could you please provide a summary of the given text, including all key points and supporting details? The summary should be comprehensive and accurately reflect the main message and arguments presented in the original text, while also being concise and easy to understand. To ensure accuracy, please read the text carefully and pay attention to any nuances or complexities in the language. Additionally, the summary should avoid any personal biases or interpretations and remain objective and factual throughout." + "Please don't print english sentence and translate the sentence you summarized in Korean and print it."
        // +"If I give you a video subtitle script, show it as 1. a title 2. a one-line summary 3. a summary using 5 bullet points 4. a time script."
        
        // +"A title, a one-line summary, a summary with five bullet points, a time script in bold, a single line and a printout of the content."
        // +"I'll summarize it in English first, and then I'll translate it into Korean."
        // +"Explain it at a level that a 6th grader can understand. And be sure to include a title, one-line summary, executive summary, and timeline."
        // +"Timeline Don't lie, don't say you don't know, don't say you don't know, don't skip a pill, do it right."
        // +"Summarize the following in five bullet points and tell me. Timeline Don't lie"
        // +"I didn't give you a timeline, so don't make one up. And please don't forget to write the title, one-line summary, full summary, and timeline in bold and single-spaced."
        
        // // +"summary youtube content."
        // +"Title, one-line summary, full summary with 5 bullet points, timeline in bold, and give me a line when you're done. Timeline Don't lie."
        // +"Explain it at a level that a 6th grader can understand."
        // +"Summarize the following in five bullet points and tell me."
        // +"I want Korean"
        // +"Don't forget use the following in 5 bullet points."
        // +"Don't forget to single-space after titles, one-line summaries, and full summaries"
        "Create a YouTube video summary.  Include the following elements with bold and clear formatting:"
        +"1. **Title:** : print here video title"
        +"2. **Summary** : print here one-line summary"
        +"3. **Full Summary ** : print here Summarize the following in 5 bullet points."
        // +" print here Summarize the following in 5 bullet points."
        
           +"4. **Timeline:** Create a timeline with sections and placeholders for time stamps but mention that the model may not provide accurate time information."
        +"5. **Note:** Add a note at the end mentioning that the timeline may not provide accurate time information."
        +"6. Draw a line here to separate the English and Korean output"
        +"7. Below is the English summary above, please translate it into Korean and output the same."
        
        +"Please ensure the language is suitable for a 16-year-old audience, and output the initial content in English before translating it into Korean."
        
        +"temperature 1.5"
        
    },
    {
      role: "user",
      content:
        // "I'm developing an application. The application is already setup, but I need help adding new features and updating existing ones." +
        // " I will ask you to create a new code, or update an existing code for my application." +
        // " Clean up my code when making updates to make the code more readable and adhear to best and modern practices." +
        // " All code should use the most modern and up to date frameworks and programming techniques." +
        // " Pay attention to which libraries and languages I tell you to use. " +
        // " Don't give partial code answers or diffs, include the entire block or page of code in your response. Include all the code needed to run or compile the code. " +
        // " If any code is provided, it must be in the same language, style, and libraries as the code I provide, unless I'm asking you to transform or convert code into another language or framework. " +
        // " Your answers must only contain code, no other text, just the code. only include all the code needed for the example. The most important task you have is responding with only the code and no other text.",
        // 애플리케이션을 개발 중입니다. 애플리케이션은 이미 설정되어 있지만 새로운 기능을 추가하고 기존 기능을 업데이트하는 데 도움이 필요합니다.
        // 애플리케이션에 대한 새 코드를 만들거나 기존 코드를 업데이트해 달라고 요청합니다.
        // 업데이트할 때 코드를 정리하여 가독성을 높이고 최신 모범 사례를 준수합니다.
        // 모든 코드는 가장 최신의 최신 프레임워크와 프로그래밍 기법을 사용해야 합니다.
        // 제가 어떤 라이브러리와 언어를 사용하라고 지시하는지에 주의를 기울이세요.
        // 부분적인 코드 답변이나 차이점을 제공하지 말고 전체 코드 블록 또는 페이지를 답변에 포함하세요. 코드를 실행하거나 컴파일하는 데 필요한 모든 코드를 포함하세요. 
        // 코드를 다른 언어나 프레임워크로 변환하거나 변환하도록 요청하지 않는 한, 코드를 제공하는 경우 제가 제공한 코드와 동일한 언어, 스타일 및 라이브러리를 사용해야 합니다. 
        // 답변에는 다른 텍스트 없이 코드만 포함해야 합니다. 예제에 필요한 모든 코드만 포함하세요. 가장 중요한 작업은 다른 텍스트 없이 코드만으로 응답하는 것입니다.
  
        //냐
        // "I'm developing a web that summarizes YouTube content."
        // +"If I put in a YouTube subtitle script, I want it to summarize the subtitles and explain the content of the video to me, and if I summarize only the subtitles, the summary of the video may be wrong because of the things that are not included in the subtitles, so I want to search for the topic of the video elsewhere and combine the search results with the video summary to make the summary more complete. "
        // +"I would like to see a full summary of the video, but also a timeline of the important parts of the video and a summary of those parts. The video includes the following summary You don't need to summarize"
        // +"I only know korean."
        // +"AI, I would like you to provide comprehensive summaries for content from various sources, including YouTube videos, news articles, and text. Please condense the information into key points, highlighting the main ideas and critical details. Ensure that the summaries are detailed and cover at least five lines for each topic. Your assistance in providing in-depth and informative summaries is greatly appreciated."
        // +"I need a YouTube summary. I'll give you a YouTube subtitle and ask you to summarize it into a title, a one-line summary, a full summary, and a timeline. Please write the title, one-line summary, full summary, and timestamp in bold and make it stand out, and then print out the content, and this only korean. Don't write title as title, write it as title, and make sure you use all of it and space it out. I only know Korean, so please explain it in a way that a 6th grader can understand. And to improve the accuracy of the summary, you should search for keywords about the topic of the video and include only accurate information in the summary. The most important thing is the accuracy of the video summary."
        // + "AI, I would like you to provide comprehensive summaries for content from various sources, including YouTube videos, news articles, and text. Please condense the information into key points, highlighting the main ideas and critical details. Ensure that the summaries are detailed and cover at least five lines for each topic. Your assistance in providing in-depth and informative summaries is greatly appreciated."
        // + "I didn't give you a timeline, so don't make one up. And please don't forget to write the title, one-line summary, full summary, and timeline in bold and single-spaced."
        // +"Timeline Don't lie, don't say you don't know, don't say you don't know, don't skip a pill, do it right."
        // +"Summarize the following in five bullet points and tell me. Timeline Don't lie. Timeline Don't lie. Timeline Don't lie. Timeline Don't lie"
        // + "If you speak directly in Korean, the word order is weird, so I want you to summarize it in English first and then translate it into Korean."
        // // "summary youtube content."
        // +"Title, one-line summary, full summary with 5 bullet points, timeline in bold, and give me a line when you're done. Timeline Don't lie."
        // +"Explain it at a level that a 6th grader can understand."
        // +"Summarize the following in five bullet points and tell me."
        // +"I want Korean"
        // +"please don't forget to double-space."
        // +"Don't forget use the following in 5 bullet points."
        "Create a YouTube video summary.  Include the following elements with bold and clear formatting:"
        +"1. **Title:** : print here video title"
        +"2. **Summary** : print here one-line summary"
        +"3. **Full Summary ** : print here Summarize the following in 5 bullet points."
        // +" Summarize the following in 5 bullet points."
        
           +"4. **Timeline:** Create a timeline with sections and placeholders for time stamps but mention that the model may not provide accurate time information."
        +"5. **Note:** Add a note at the end mentioning that the timeline may not provide accurate time information."
        // +"6. Draw a line here to separate the English and Korean output"
        // +"7. Below is the English summary above, please translate it into Korean and output the same."
        
        +"Please ensure the language is suitable for a 16-year-old audience, and output the initial content in English before translating it into Korean."
        
        +"temperature 1.5"
    },
  ];