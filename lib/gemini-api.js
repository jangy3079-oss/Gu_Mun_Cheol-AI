// Helper to convert File to Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve({ base64: base64String, mimeType: file.type || 'image/jpeg' });
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeWithGemini = async (files) => {
  try {
    const fileDataArray = await Promise.all(files.map(fileToBase64));
    
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ images: fileDataArray })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.warn("Failed to analyze with Gemini (using fallback):", err.message);
    const dummyFeatures = {
      "reply_delay_sec": Math.random() * 300,
      "read_without_reply_count": Math.floor(Math.random() * 5),
      "reply_after_midnight": Math.random() > 0.5 ? 1 : 0,
      "single_kk_count": Math.floor(Math.random() * 10),
      "multi_kk_ratio": Math.random(),
      "single_kk_ratio": Math.random(),
      "period_at_end_ratio": Math.random(),
      "question_mark_count": Math.floor(Math.random() * 6),
      "ellipsis_count": Math.floor(Math.random() * 3),
      "message_length_ratio": Math.random(),
      "caps_or_bold_count": 0,
      "single_char_reply_ratio": Math.random(),
      "conversation_ender_count": Math.floor(Math.random() * 2),
      "double_message_ratio": Math.random()
    };

    return {
      analysis_text: "아이고, 카톡 블랙박스 영상을 가져오셨는데 안타깝게도 영상이 너무 흐려서 정확한 판독이 어렵습니다. 하지만 대략적인 속도나 타이밍을 봤을 때 양쪽 다 고집을 꺾지 않고 직진하고 있네요. 도로 위나 카톡 방이나 양보가 제일 중요합니다!",
      analysis_bubbles: [
        {
          "time_step": "대화 초반",
          "quote": "오전 10:00 상대방 : 뭐해",
          "eval": "아이고, 카톡 블랙박스 영상을 가져오셨는데 안타깝게도 영상이 너무 흐려서 정확한 판독이 어렵습니다. 하지만 대략적인 속도나 타이밍을 봤을 때 양쪽 다 고집을 꺾지 않고 직진하고 있네요."
        },
        {
          "time_step": "대화 중반",
          "quote": "오후 01:20 본인 : 그냥 있어",
          "eval": "도로 위나 카톡 방이나 양보가 제일 중요합니다! 일단 AI 임시 판독 결과로 대체합니다."
        }
      ],
      analysis_conclusion: "최종 결론! 상대방 차량 과실 {OTHER_RATIO}%, 블박차(본인) 과실 {ME_RATIO}%로 봅니다!",
      summary: dummyFeatures,
      timeline: [
        { time_step: "초반", me: { ...dummyFeatures, single_kk_count: 0 }, other: { ...dummyFeatures, single_kk_count: 3 } },
        { time_step: "중반", me: { ...dummyFeatures, single_kk_count: 1 }, other: { ...dummyFeatures, single_kk_count: 2 } },
        { time_step: "후반", me: { ...dummyFeatures, single_kk_count: 5 }, other: { ...dummyFeatures, single_kk_count: 0 } }
      ]
    };
  }
};
