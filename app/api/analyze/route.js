import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { images } = await req.json();

    // Use gemini-2.5-flash for much faster responses (crucial for hackathon demos)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      generationConfig: { 
        responseMimeType: "application/json" 
      } 
    });

    const prompt = `
      너는 카카오톡 대화를 분석하는 '구문철 AI'야.
      첨부된 카카오톡 싸움 화면 캡처들(전체 대화 흐름)을 보고, 아래의 14가지 피처값을 측정 혹은 추정해서 JSON 포맷으로 줘.
      이번에는 전체 대화의 요약값(summary)과 함께, 대화 흐름을 3~5개 구간(초반, 중반, 후반 등)으로 나눈 타임라인(timeline) 데이터를 본인(me)과 상대방(other)으로 나누어서 함께 반환해야 해.
      
      [절대 규칙: 본인(me)과 상대방(other) 구분법 - 틀리면 너는 해고야!]
      1. 본인(me) / 블박차: 
         - 위치: 화면의 **오른쪽**
         - 색상: 주로 **노란색** 말풍선
         - 특징: 말풍선 옆에 **프로필 사진이 절대로 없음**
      2. 상대방(other): 
         - 위치: 화면의 **왼쪽**
         - 색상: 주로 **흰색 또는 연한 회색** 말풍선
         - 특징: 말풍선 옆에 반드시 **프로필 사진 혹은 이름**이 붙어 있음
      
      너는 분석을 시작하기 전에 모든 말풍선의 위치와 프로필 사진 유무를 0.1초 단위로 전수 조사해서 피아식별을 완벽히 마쳐야 해. 오른쪽 노란색이 보낸 말을 상대방이 했다고 하면 이 서비스는 망해. 명심해!
      
      피처 14개 리스트:
      - reply_delay_sec: float (평균 답장 지연 시간, 초 단위)
      - read_without_reply_count: int (읽씹 횟수)
      - reply_after_midnight: int (1 또는 0, 자정 이후 답장 여부)
      - single_kk_count: int (단답 'ㅋ' 개수)
      - multi_kk_ratio: float (0.0~1.0, 전체 대화 중 'ㅋㅋㅋ' 등 다중 ㅋ 비율)
      - single_kk_ratio: float (0.0~1.0, 전체 대화 중 단답 'ㅋ' 비율)
      - period_at_end_ratio: float (0.0~1.0, 문장 끝 마침표 사용 비율)
      - question_mark_count: int (물음표 개수)
      - ellipsis_count: int (말줄임표 개수)
      - message_length_ratio: float (두 사람의 대화 길이 비율)
      - caps_or_bold_count: int (강조 표현 횟수)
      - single_char_reply_ratio: float (0.0~1.0, 단답형 대답 비율)
      - conversation_ender_count: int (대화를 끝내는 듯한 단어 사용 횟수)
      - double_message_ratio: float (0.0~1.0, 상대 답장 전 연달아 보낸 메시지 비율)
      
      추가 지시사항: 한문철 변호사 특유의 블랙박스 리뷰 말투(예: "이거 참 기가 막힙니다", "이게 말이 됩니까?", "블박차(본인) 잘못 하나도 없습니다" 등)를 사용하여 카톡 대화 상황을 생동감 있게 분석하고 과실의 근거를 설명하는 500자 내외의 줄글을 'analysis_text'로 작성하세요.
      
      또한, 대화 중 가장 핵심이 되는 결정적인 장면(피크 타임) 1~2개를 콕 집어서 블랙박스 영상 보듯이 인용(quote)하고 호통치거나 평가(eval)하는 내용을 담은 'analysis_bubbles' 배열을 작성하세요.
      
      [매우 중요한 지시사항: 누구의 편도 들지 않는 '매우 객관적인' 판독!]
      본인(블박차)이라고 해서 무조건 편을 들어주거나 반대로 무조건 꾸짖지 마세요. 오직 대화의 내용, 답장 시간, 공격적인 단어 사용 빈도 등 **철저히 객관적인 지표**만을 근거로 냉정하게 판독하세요. 누구든 잘못한 만큼 정확히 과실을 지적해야 진정한 AI입니다.
      
      [매우 중요한 지시사항: 과실 비율 숫자 플레이스홀더 사용]
      모든 분석이 끝난 후 최종 결론인 'analysis_conclusion'에는 반드시 과실 비율을 명확하게 외쳐야 합니다! 
      **절대로 임의로 숫자를 지어내지 마세요.** 대신 반드시 아래의 중괄호 플레이스홀더를 그대로 출력하세요. 
      이걸 어기고 숫자를 직접 쓰면 시스템 에러가 발생합니다!
      
      정확한 출력 형태:
      "최종 결론! 상대방 차량 과실 {OTHER_RATIO}%, 블박차(본인) 과실 {ME_RATIO}%로 봅니다!"

      사진에 내용이 명확하지 않더라도 무조건 위 14개 필드가 모두 포함된 JSON 객체를 반환해.
      반드시 아래 JSON 구조를 엄격히 지켜:
      {
        "analysis_text": "아이고, 이거 참 기가 막힙니다. 영상을, 아니 카톡을 한 번 보시죠. 상대방이 지금 새벽 2시에 다짜고짜 '자?' 하고 보내는데...",
        "analysis_bubbles": [
          {
            "time_step": "결정적 장면",
            "quote": "오전 02:15 상대방 : 자?",
            "eval": "아니 이 사람 보세요! 상대방이 지금 새벽 2시에 다짜고짜 '자?' 하고 보내는데, 이거 명백한 수면 방해죠!"
          }
        ],
        "analysis_conclusion": "최종 결론! 상대방 차량 과실 {OTHER_RATIO}%, 블박차(본인) 과실 {ME_RATIO}%로 봅니다!",
        "summary": {
          "reply_delay_sec": 120.5,
          "read_without_reply_count": 2,
          "reply_after_midnight": 1,
          "single_kk_count": 5,
          "multi_kk_ratio": 0.8,
          "single_kk_ratio": 0.2,
          "period_at_end_ratio": 0.9,
          "question_mark_count": 3,
          "ellipsis_count": 1,
          "message_length_ratio": 0.4,
          "caps_or_bold_count": 0,
          "single_char_reply_ratio": 0.7,
          "conversation_ender_count": 1,
          "double_message_ratio": 0.1
        },
        "timeline": [
          {
            "time_step": "대화 초반",
            "me": { "reply_delay_sec": 10, "single_kk_count": 0, "multi_kk_ratio": 0.0, "single_kk_ratio": 0.0, "period_at_end_ratio": 0.0, "question_mark_count": 1, "ellipsis_count": 0, "message_length_ratio": 0.5, "caps_or_bold_count": 0, "single_char_reply_ratio": 0.1, "conversation_ender_count": 0, "double_message_ratio": 0.0, "read_without_reply_count": 0, "reply_after_midnight": 0 },
            "other": { "reply_delay_sec": 120, "single_kk_count": 2, "multi_kk_ratio": 0.1, "single_kk_ratio": 0.5, "period_at_end_ratio": 0.2, "question_mark_count": 0, "ellipsis_count": 1, "message_length_ratio": 0.2, "caps_or_bold_count": 0, "single_char_reply_ratio": 0.8, "conversation_ender_count": 0, "double_message_ratio": 0.1, "read_without_reply_count": 1, "reply_after_midnight": 0 }
          },
          {
            "time_step": "대화 중반",
            "me": { ...위 14개 피처... },
            "other": { ...위 14개 피처... }
          }
        ]
      }
    `;

    // Process multiple images for Gemini payload
    const imageParts = images.map(img => ({
      inlineData: {
        data: img.base64,
        mimeType: img.mimeType,
      }
    }));

    const result = await model.generateContent([
      prompt,
      ...imageParts
    ]);

    const response = await result.response;
    const text = response.text();
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
