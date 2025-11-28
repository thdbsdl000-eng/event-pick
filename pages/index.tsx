import { useState } from 'react';
import Head from 'next/head';

interface BannerData {
  headline: string[];
  sub: string[];
  benefit: string[];
  period: string[];
  legal: string;
  colors: string[];
  style: string;
}

// 예시 배너 이미지 경로
// public/banners 폴더에 이미지 파일을 저장하세요
// 파일명: example1.jpg, example2.jpg, example3.jpg 등
const exampleBanners = [
  {
    image: '/banners/example1.jpg',
    alt: '예시 배너 1',
  },
  {
    image: '/banners/example2.jpg',
    alt: '예시 배너 2',
  },
  {
    image: '/banners/example3.jpg',
    alt: '예시 배너 3',
  },
];

export default function Home() {
  const [formData, setFormData] = useState({
    brand: '',
    title: '',
    subtitle: '',
    benefit: '',
    period: '',
    legal: '',
    colors: '',
  });

  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BannerData | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 파일 검증 및 처리 공통 함수
  const processImageFile = (file: File) => {
    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      setError('이미지 파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 이미지 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setLogoFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      processImageFile(file);
    }
  };

  const removeImage = () => {
    setLogoImage(null);
    setLogoFile(null);
    // 파일 입력 초기화
    const fileInput = document.getElementById('logo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.brand.trim()) {
      setError('상호명은 필수 입력 항목입니다.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // 이미지를 base64로 변환
      let logoBase64: string | null = null;
      if (logoFile) {
        logoBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1]; // data:image/... 부분 제거
            resolve(base64String);
          };
          reader.onerror = reject;
          reader.readAsDataURL(logoFile);
        });
      }

      const response = await fetch('/api/generate-banner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          logoImage: logoBase64,
          logoMimeType: logoFile ? logoFile.type : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '생성에 실패했습니다.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '생성에 실패했습니다. 입력값을 다시 확인하거나 잠시 후 다시 시도해 주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('클립보드에 복사되었습니다.');
    } catch (err) {
      alert('복사에 실패했습니다.');
    }
  };

  const copyAllCopy = () => {
    if (!result) return;
    const allText = `
[메인 헤드라인]
${result.headline.join('\n')}

[서브 헤드라인]
${result.sub.join('\n')}

[혜택 문구]
${result.benefit.join('\n')}

[기간 문구]
${result.period.join('\n')}

[필수 문구]
${result.legal}

[추천 색상 조합]
${result.colors.join('\n')}

[배너 스타일 가이드]
${result.style}
    `.trim();
    copyToClipboard(allText);
  };

  const copyHeadlines = () => {
    if (!result) return;
    copyToClipboard(result.headline.join('\n'));
  };

  const copyLegal = () => {
    if (!result) return;
    copyToClipboard(result.legal);
  };

  return (
    <>
      <Head>
        <title>EventBanner AI - 네이버 플레이스 이벤트 배너 문구 생성기</title>
        <meta name="description" content="AI 기반 이벤트 배너 문구 자동 생성 서비스" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#050816] text-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* 헤더 */}
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              EventBanner AI
            </h1>
            <p className="text-gray-300 text-lg">
              네이버 플레이스 이벤트 배너 전용 문구 & 구성 자동 생성기
            </p>
          </header>

          {/* 예시 배너 섹션 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-6 text-white">
              ✨ AI가 만든 예시 배너
            </h2>
            <p className="text-center text-gray-400 mb-8 text-sm">
              마우스를 올리면 크게 볼 수 있어요
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {exampleBanners.map((banner, idx) => (
                <div
                  key={idx}
                  className="group relative cursor-pointer transform transition-all duration-300 hover:scale-110 hover:z-10"
                >
                  <div className="relative overflow-hidden rounded-xl shadow-2xl bg-gray-800">
                    <img
                      src={banner.image}
                      alt={banner.alt}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        // 이미지 로드 실패 시 대체 텍스트 표시
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.error-message')) {
                          const errorDiv = document.createElement('div');
                          errorDiv.className = 'error-message flex items-center justify-center h-64 text-gray-400 text-sm';
                          errorDiv.textContent = '이미지를 불러올 수 없습니다';
                          parent.appendChild(errorDiv);
                        }
                      }}
                    />
                    {/* 호버 시 오버레이 */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 pointer-events-none"></div>
                  </div>
                  {/* 호버 시 그림자 강화 */}
                  <div className="absolute inset-0 rounded-xl shadow-none group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {/* 입력 폼 */}
          <form onSubmit={handleSubmit} className="bg-white text-gray-900 rounded-xl shadow-xl p-6 md:p-8 mb-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="brand" className="block text-sm font-semibold mb-2">
                  상호명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="예: 맛있는 카페"
                />
              </div>

              <div>
                <label htmlFor="logo" className="block text-sm font-semibold mb-2">
                  로고 이미지 (선택)
                </label>
                <div className="space-y-3">
                  <div
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
                      isDragging
                        ? 'border-purple-500 bg-purple-50 scale-105'
                        : 'border-gray-300 hover:border-purple-400 bg-gray-50'
                    }`}
                  >
                    <div className="p-6 text-center">
                      {logoImage ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                            <svg
                              className="w-5 h-5 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>이미지가 업로드되었습니다</span>
                          </div>
                          <label
                            htmlFor="logo"
                            className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer text-sm font-medium"
                          >
                            이미지 변경
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <svg
                              className="w-12 h-12 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <div className="text-sm text-gray-600">
                              <p className="font-medium">드래그 앤 드롭 또는 클릭하여 업로드</p>
                              <p className="text-xs mt-1 text-gray-500">
                                JPG, PNG, WebP (최대 5MB)
                              </p>
                            </div>
                          </div>
                          <label
                            htmlFor="logo"
                            className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer text-sm font-medium"
                          >
                            파일 선택
                          </label>
                        </div>
                      )}
                      <input
                        type="file"
                        id="logo"
                        name="logo"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </div>
                  {logoImage && (
                    <div className="relative">
                      <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600 font-medium">미리보기</span>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            삭제
                          </button>
                        </div>
                        <img
                          src={logoImage}
                          alt="로고 미리보기"
                          className="max-h-32 mx-auto object-contain rounded"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  로고가 있는 경우 업로드해주세요. AI가 로고를 참고하여 배너 문구를 생성합니다.
                </p>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-semibold mb-2">
                  이벤트 제목
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="예: 겨울 특가 이벤트"
                />
              </div>

              <div>
                <label htmlFor="subtitle" className="block text-sm font-semibold mb-2">
                  이벤트 부제
                </label>
                <textarea
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="예: 따뜻한 겨울을 위한 특별한 혜택"
                />
              </div>

              <div>
                <label htmlFor="benefit" className="block text-sm font-semibold mb-2">
                  할인율 / 쿠폰 혜택 / 증정 내용
                </label>
                <textarea
                  id="benefit"
                  name="benefit"
                  value={formData.benefit}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="예: 20% 할인, 음료 1잔 무료 증정"
                />
              </div>

              <div>
                <label htmlFor="period" className="block text-sm font-semibold mb-2">
                  진행 기간
                </label>
                <input
                  type="text"
                  id="period"
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="예: 11.20 ~ 11.27"
                />
              </div>

              <div>
                <label htmlFor="legal" className="block text-sm font-semibold mb-2">
                  필수문구
                </label>
                <textarea
                  id="legal"
                  name="legal"
                  value={formData.legal}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="예: 일부 품목 제외, 중복 할인 불가"
                />
              </div>

              <div>
                <label htmlFor="colors" className="block text-sm font-semibold mb-2">
                  대표 색상 1~2가지
                </label>
                <input
                  type="text"
                  id="colors"
                  name="colors"
                  value={formData.colors}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="예: 보라, 검정 / 또는 #7C3AED, #000000"
                />
                <p className="mt-1 text-xs text-gray-500">
                  예시: 보라, 검정 / 또는 #7C3AED, #000000
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    생성 중...
                  </span>
                ) : (
                  '문구 자동 생성하기'
                )}
              </button>
            </div>
          </form>

          {/* 생성 결과 */}
          {result && (
            <div className="bg-white text-gray-900 rounded-xl shadow-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">생성 결과</h2>

              <div className="space-y-6">
                {/* 메인 헤드라인 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-purple-600">메인 헤드라인</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.headline.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 서브 헤드라인 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-pink-600">서브 헤드라인</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.sub.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-pink-100 text-pink-800 rounded-lg text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 혜택 문구 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-600">혜택 문구</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.benefit.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 기간 문구 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-blue-600">기간 문구</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.period.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 필수 문구 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-orange-600">필수 문구</h3>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-orange-900">{result.legal}</p>
                  </div>
                  <button
                    onClick={copyLegal}
                    className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                  >
                    필수 문구 복사
                  </button>
                </div>

                {/* 추천 색상 조합 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-indigo-600">추천 색상 조합</h3>
                  <div className="flex flex-wrap gap-4">
                    {result.colors.map((color, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div
                          className="w-12 h-12 rounded-lg border-2 border-gray-300"
                          style={{ backgroundColor: color }}
                        ></div>
                        <span className="text-sm font-mono">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 배너 스타일 가이드 */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-teal-600">배너 스타일 가이드</h3>
                  <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                    <p className="text-teal-900">{result.style}</p>
                  </div>
                </div>
              </div>

              {/* 복사 버튼들 */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={copyAllCopy}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
                  >
                    전체 카피 한 번에 복사
                  </button>
                  <button
                    onClick={copyHeadlines}
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    헤드라인만 복사
                  </button>
                  <button
                    onClick={copyLegal}
                    className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                  >
                    필수 문구만 복사
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

