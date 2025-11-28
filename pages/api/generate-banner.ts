import type { NextApiRequest, NextApiResponse } from 'next';

interface GenerateBannerRequest {
  brand: string;
  title?: string;
  subtitle?: string;
  benefit?: string;
  period?: string;
  legal?: string;
  colors?: string;
  logoImage?: string; // base64 인코딩된 이미지
  logoMimeType?: string; // image/jpeg, image/png 등
}

interface GenerateBannerResponse {
  headline: string[];
  sub: string[];
  benefit: string[];
  period: string[];
  legal: string;
  colors: string[];
  style: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateBannerResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      brand, 
      title = '', 
      subtitle = '', 
      benefit = '', 
      period = '', 
      legal = '', 
      colors = '',
      logoImage,
      logoMimeType
    } = req.body as GenerateBannerRequest;

    if (!brand || brand.trim() === '') {
      return res.status(400).json({ error: '상호명은 필수입니다.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.');
      console.error('현재 환경 변수:', Object.keys(process.env).filter(key => key.includes('GEMINI')));
      return res.status(500).json({ 
        error: 'API 키가 설정되지 않았습니다. Railway 대시보드에서 환경 변수를 확인해주세요.' 
      });
    }

    // API 키 형식 확인 (기본 검증)
    if (!apiKey.startsWith('AIza')) {
      console.error('API 키 형식이 올바르지 않습니다.');
      return res.status(500).json({ 
        error: 'API 키 형식이 올바르지 않습니다.' 
      });
    }

    // 프롬프트 템플릿 생성
    let prompt = `당신은 이벤트 배너 문구 제작 전문가입니다.  
아래 양식에 광고주가 입력한 내용을 기반으로,
입력이 누락되었거나 어색해도 적절히 해석하고
배너에 들어갈 문구를 자동 생성·보완해 주세요.

====================
[광고주 입력값]

상호명: ${brand}
이벤트 제목: ${title}
이벤트 부제: ${subtitle}
할인율/쿠폰/증정 내용: ${benefit}
진행 기간: ${period}
필수문구: ${legal}
대표 색상: ${colors}`;

    // 로고 이미지가 있으면 프롬프트에 추가
    if (logoImage) {
      prompt += `
로고 이미지: 광고주가 업로드한 로고 이미지를 참고하여, 로고의 색상, 스타일, 브랜드 아이덴티티를 반영한 배너 문구를 생성해주세요.`;
    }

    prompt += `
====================

[출력 지침]

1) 누락된 항목이 있으면 문맥 기반으로 자연스럽게 생성합니다.  
   - 제목이 없으면 "특가 이벤트", "시즌 세일" 등을 자동 생성  
   - 할인/혜택이 없으면 업종, 제목, 분위기 등을 보고 자연스러운 혜택 문구 생성  
   - 기간이 없으면 "행사 기간: 상시 진행" 또는 "한정 기간 진행" 등의 문구 자동 생성  
   - 대표 색상이 없으면 이벤트 느낌에 맞는 색상 1~2개 추천

2) 광고주가 잘못 입력하거나 어색한 문장을 입력해도  
   자연스럽고 광고 문구처럼 다듬어서 출력합니다.

3) 최종 출력은 아래 구조를 반드시 지켜주세요.

====================
[최종 출력]

1. 메인 헤드라인 (3개)
   - 짧고 강하게
   - 이벤트 제목이 어색하면 자동 재작성

2. 서브 헤드라인 (3개)
   - 혜택을 강조하거나 분위기 살리기

3. 혜택 문구 (3개)
   - 광고주가 입력한 문구를 개선하거나
     누락 시 자동 생성

4. 기간 문구 (2개)
   - 기간 누락 시 자연스러운 문구 생성
   - 예: "단 일주일간", "한정 기간 진행"

5. 필수 문구 (1개)
   - 광고주 입력값을 기반으로 재정돈
   - 미입력 시 '일부 품목 제외·중복 할인 불가'로 생성

6. 추천 색상 조합 (hex 코드 2세트)
   - 입력값 없으면 대표 색상 자동 추천

7. 배너 스타일 가이드 (1개)
   - 전체 톤·요소·분위기 제안
   - 예: 네온 블랙프라이데이 / 산타 레드 민트 / 우주 퍼플 글로시

출력은 반드시 JSON으로만 표현하세요.
키 구조는 다음과 같습니다:

{
 "headline": [...],
 "sub": [...],
 "benefit": [...],
 "period": [...],
 "legal": "...",
 "colors": [...],
 "style": "..."
}

====================`;

    // Gemini API 호출 - 이미지가 있으면 parts에 이미지와 텍스트 모두 포함
    const parts: any[] = [];
    
    // 이미지가 있으면 먼저 이미지 추가
    if (logoImage && logoMimeType) {
      parts.push({
        inline_data: {
          mime_type: logoMimeType,
          data: logoImage,
        },
      });
    }
    
    // 텍스트 프롬프트 추가
    parts.push({
      text: prompt,
    });

    // Gemini API 엔드포인트 - v1 API 사용 (더 안정적)
    // 모델 옵션: gemini-1.5-pro-latest, gemini-1.5-flash-latest, gemini-pro
    const modelName = 'gemini-1.5-pro-latest'; // 최신 안정 버전 사용
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: parts,
          },
        ],
      }),
    });

    if (!response.ok) {
      let errorMessage = 'Gemini API 호출에 실패했습니다.';
      try {
        const errorData = await response.json();
        console.error('Gemini API Error Response:', JSON.stringify(errorData, null, 2));
        
        // Gemini API의 구체적인 오류 메시지 추출
        if (errorData.error) {
          if (errorData.error.message) {
            errorMessage = `Gemini API 오류: ${errorData.error.message}`;
          } else if (errorData.error.status) {
            errorMessage = `Gemini API 오류 (${errorData.error.status}): ${JSON.stringify(errorData.error)}`;
          }
        }
      } catch (parseError) {
        const errorText = await response.text();
        console.error('Gemini API Error (text):', errorText);
        errorMessage = `Gemini API 호출 실패 (${response.status}): ${errorText.substring(0, 200)}`;
      }
      
      return res.status(500).json({ error: errorMessage });
    }

    const data = await response.json();

    // 응답에서 텍스트 추출
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(500).json({ error: 'Gemini API 응답 형식이 올바르지 않습니다.' });
    }

    // JSON 파싱 시도 (마크다운 코드 블록 제거)
    let jsonText = text.trim();
    // ```json 또는 ``` 제거
    jsonText = jsonText.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/i, '').trim();

    let parsedData: GenerateBannerResponse;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw text:', text);
      return res.status(500).json({ error: '응답 파싱에 실패했습니다.' });
    }

    // 응답 구조 검증
    if (
      !Array.isArray(parsedData.headline) ||
      !Array.isArray(parsedData.sub) ||
      !Array.isArray(parsedData.benefit) ||
      !Array.isArray(parsedData.period) ||
      !Array.isArray(parsedData.colors) ||
      typeof parsedData.legal !== 'string' ||
      typeof parsedData.style !== 'string'
    ) {
      return res.status(500).json({ error: '응답 형식이 올바르지 않습니다.' });
    }

    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return res.status(500).json({ 
      error: `서버 오류가 발생했습니다: ${errorMessage}` 
    });
  }
}

