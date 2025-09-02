// 뉴스 관리 시스템
class NewsManager {
    constructor() {
        this.cacheFile = 'data/news-cache.json';
        this.cacheExpiry = 30 * 60 * 1000; // 30분 캐시 유효시간
        this.apiUrl = 'https://news.deepsearch.com/api';
        this.apiKey = '8daef9ce9c954ce1865472ebde12fc23';
    }

    // 캐시된 뉴스 데이터 로드 (localStorage 우선)
    async loadCachedNews() {
        try {
            console.log('캐시된 뉴스 데이터 로드 시작');
            
            // 먼저 localStorage에서 확인
            const cachedData = localStorage.getItem('news-cache');
            if (cachedData) {
                console.log('localStorage에서 캐시 데이터 발견');
                const data = JSON.parse(cachedData);
                
                // 캐시 만료 확인
                const lastUpdated = new Date(data.lastUpdated);
                const now = new Date();
                const timeDiff = now - lastUpdated;
                
                if (timeDiff <= this.cacheExpiry) {
                    console.log('유효한 localStorage 캐시 데이터 사용');
                    return data.news;
                } else {
                    console.log('localStorage 캐시가 만료됨, 새로운 뉴스 가져오기');
                }
            }
            
            // localStorage에 캐시가 없거나 만료된 경우, 새로운 뉴스 가져오기
            console.log('새로운 뉴스 데이터 가져오기 시도');
            return await this.fetchAndCacheNews();
            
        } catch (error) {
            console.error('캐시된 뉴스 로드 오류:', error);
            console.log('폴백 뉴스 데이터 사용');
            return this.getFallbackNews();
        }
    }

    // 딥서치 API에서 뉴스 가져오기 및 캐시 저장
    async fetchAndCacheNews() {
        try {
            console.log('딥서치 API에서 새로운 뉴스 가져오기 시작');
            
            const response = await fetch(`${this.apiUrl}/v1/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': this.apiKey
                },
                body: JSON.stringify({
                    query: 'AI OR 인공지능 OR "artificial intelligence" OR "machine learning" OR "deep learning" OR ChatGPT OR OpenAI OR 딥러닝',
                    size: 12,
                    sort: [
                        { "published_at": { "order": "desc" } }
                    ],
                    filter: {
                        published_at: {
                            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                        }
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`API 호출 실패: ${response.status}`);
            }

            const apiData = await response.json();
            const newsItems = apiData.hits || apiData.documents || [];
            
            // 뉴스 데이터 정규화
            const normalizedNews = newsItems.map((item, index) => ({
                id: `api-news-${Date.now()}-${index}`,
                title: item._source.title || item.title,
                summary: item._source.summary || item.summary || item._source.content?.substring(0, 200) + '...',
                published_at: item._source.published_at || item.published_at,
                source: item._source.source || item.source || 'Unknown',
                url: item._source.url || item.url || '#',
                image_url: item._source.image_url || item.image_url,
                tags: item._source.tags || item.tags || [],
                category: this.categorizeNews(item._source.title || item.title, item._source.tags || item.tags)
            }));

            // 캐시에 저장 (실제 환경에서는 서버 사이드에서 처리)
            const cacheData = {
                lastUpdated: new Date().toISOString(),
                news: normalizedNews
            };

            console.log('새로운 뉴스 데이터 가져오기 완료:', normalizedNews);
            
            // 브라우저 환경에서는 localStorage에 임시 저장
            localStorage.setItem('news-cache', JSON.stringify(cacheData));
            
            return normalizedNews;

        } catch (error) {
            console.error('API에서 뉴스 가져오기 실패:', error);
            return this.getFallbackNews();
        }
    }

    // 뉴스 카테고리 분류
    categorizeNews(title, tags) {
        const titleLower = title.toLowerCase();
        const tagString = (tags || []).join(' ').toLowerCase();
        
        if (titleLower.includes('openai') || titleLower.includes('gpt') || tagString.includes('openai')) {
            return 'OpenAI';
        } else if (titleLower.includes('google') || tagString.includes('google')) {
            return 'Google';
        } else if (titleLower.includes('meta') || titleLower.includes('facebook') || tagString.includes('meta')) {
            return 'Meta';
        } else if (titleLower.includes('microsoft') || tagString.includes('microsoft')) {
            return 'Microsoft';
        } else if (titleLower.includes('의료') || titleLower.includes('medical') || titleLower.includes('health')) {
            return '의료 AI';
        } else if (titleLower.includes('nvidia') || tagString.includes('nvidia')) {
            return 'NVIDIA';
        } else if (titleLower.includes('chip') || titleLower.includes('gpu') || titleLower.includes('칩')) {
            return '하드웨어';
        } else if (titleLower.includes('오픈소스') || titleLower.includes('open source')) {
            return '오픈소스';
        } else {
            return 'AI 뉴스';
        }
    }

    // 폴백 뉴스 데이터
    getFallbackNews() {
        console.log('폴백 뉴스 데이터 사용');
        return [
            {
                id: 'fallback-001',
                title: "OpenAI, GPT-5 개발 완료... 2025년 상반기 출시 예정",
                summary: "OpenAI가 차세대 언어모델 GPT-5의 개발을 완료했다고 발표했습니다. GPT-5는 기존 모델 대비 추론 능력과 멀티모달 처리 성능이 크게 향상되었습니다.",
                published_at: "2025-08-15T09:30:00Z",
                source: "TechCrunch",
                url: "https://techcrunch.com/ai-news",
                image_url: null,
                tags: ["OpenAI", "GPT-5", "언어모델"],
                category: "OpenAI"
            },
            {
                id: 'fallback-002',
                title: "구글, AI 칩 TPU v6 공개... 성능 3배 향상",
                summary: "구글이 새로운 AI 전용 칩 TPU v6를 공개했습니다. 이전 세대 대비 3배 향상된 성능으로 대규모 AI 모델 훈련 시간을 대폭 단축할 수 있습니다.",
                published_at: "2025-08-14T14:20:00Z",
                source: "Google AI",
                url: "https://ai.google/news",
                image_url: null,
                tags: ["Google", "TPU", "AI칩"],
                category: "Google"
            },
            {
                id: 'fallback-003',
                title: "메타, 라마 3.1 오픈소스 모델 출시",
                summary: "메타가 라마 3.1 오픈소스 언어모델을 출시했습니다. 4050억 개의 매개변수를 가진 이 모델은 상업적 이용이 가능한 최대 규모의 오픈소스 모델입니다.",
                published_at: "2025-08-13T11:15:00Z",
                source: "Meta AI",
                url: "https://ai.meta.com/news",
                image_url: null,
                tags: ["Meta", "Llama", "오픈소스"],
                category: "Meta"
            },
            {
                id: 'fallback-004',
                title: "AI 의료진단 정확도 95% 달성, 상용화 임박",
                summary: "국내 AI 스타트업이 개발한 의료 영상 진단 AI가 95%의 정확도를 달성하며 상용화를 앞두고 있습니다. 특히 폐암 조기 진단 분야에서 뛰어난 성과를 보이고 있습니다.",
                published_at: "2025-08-12T16:45:00Z",
                source: "의료AI뉴스",
                url: "https://medicalai.news",
                image_url: null,
                tags: ["의료AI", "진단", "폐암"],
                category: "의료 AI"
            },
            {
                id: 'fallback-005',
                title: "마이크로소프트, 코파일럿 AI 업데이트 발표",
                summary: "마이크로소프트가 코파일럿 AI의 대규모 업데이트를 발표했습니다. 새로운 버전은 코드 생성 속도가 40% 향상되었으며, 더 정확한 코드 제안을 제공합니다.",
                published_at: "2025-08-11T13:30:00Z",
                source: "Microsoft Blog",
                url: "https://blogs.microsoft.com/ai",
                image_url: null,
                tags: ["Microsoft", "Copilot", "코드생성"],
                category: "Microsoft"
            },
            {
                id: 'fallback-006',
                title: "엔비디아, H200 GPU로 AI 훈련 성능 혁신",
                summary: "엔비디아가 새로운 H200 GPU를 공개했습니다. 이전 세대 대비 2.5배 향상된 메모리 대역폭으로 대규모 AI 모델 훈련에서 획기적인 성능 개선을 보여줍니다.",
                published_at: "2025-08-10T10:00:00Z",
                source: "NVIDIA News",
                url: "https://nvidianews.nvidia.com",
                image_url: null,
                tags: ["NVIDIA", "H200", "GPU"],
                category: "NVIDIA"
            }
        ];
    }

    // 메인페이지용 뉴스 (최신 6개)
    async getMainPageNews() {
        try {
            console.log('메인페이지 뉴스 로드 시작');
            
            // localStorage에서 먼저 확인
            const cachedData = localStorage.getItem('news-cache');
            if (cachedData) {
                console.log('localStorage에서 캐시 데이터 확인');
                const data = JSON.parse(cachedData);
                const lastUpdated = new Date(data.lastUpdated);
                const now = new Date();
                
                if (now - lastUpdated < this.cacheExpiry) {
                    console.log('유효한 localStorage 캐시 사용 (메인페이지)');
                    return data.news.slice(0, 6);
                } else {
                    console.log('localStorage 캐시 만료됨');
                }
            } else {
                console.log('localStorage에 캐시 없음');
            }
            
            // 캐시가 없거나 만료된 경우
            console.log('새로운 뉴스 데이터 로드 시도');
            const allNews = await this.loadCachedNews();
            return allNews.slice(0, 6);
            
        } catch (error) {
            console.error('메인페이지 뉴스 로드 오류:', error);
            console.log('메인페이지 폴백 뉴스 사용');
            return this.getFallbackNews().slice(0, 6);
        }
    }

    // 뉴스페이지용 뉴스 (전체)
    async getNewsPageNews() {
        try {
            console.log('뉴스페이지 뉴스 로드 시작');
            
            // localStorage에서 먼저 확인
            const cachedData = localStorage.getItem('news-cache');
            if (cachedData) {
                console.log('localStorage에서 캐시 데이터 확인 (뉴스페이지)');
                const data = JSON.parse(cachedData);
                const lastUpdated = new Date(data.lastUpdated);
                const now = new Date();
                
                if (now - lastUpdated < this.cacheExpiry) {
                    console.log('유효한 localStorage 캐시 사용 (뉴스페이지)');
                    return data.news;
                } else {
                    console.log('localStorage 캐시 만료됨 (뉴스페이지)');
                }
            } else {
                console.log('localStorage에 캐시 없음 (뉴스페이지)');
            }
            
            // 캐시가 없거나 만료된 경우
            console.log('새로운 뉴스 데이터 로드 시도 (뉴스페이지)');
            return await this.loadCachedNews();
            
        } catch (error) {
            console.error('뉴스페이지 뉴스 로드 오류:', error);
            console.log('뉴스페이지 폴백 뉴스 사용');
            return this.getFallbackNews();
        }
    }

    // 캐시 강제 새로고침
    async refreshCache() {
        console.log('캐시 강제 새로고침');
        localStorage.removeItem('news-cache');
        return await this.fetchAndCacheNews();
    }

    // 캐시 상태 확인
    getCacheStatus() {
        const cachedData = localStorage.getItem('news-cache');
        if (!cachedData) {
            return { cached: false, lastUpdated: null, expired: true };
        }

        const data = JSON.parse(cachedData);
        const lastUpdated = new Date(data.lastUpdated);
        const now = new Date();
        const expired = (now - lastUpdated) > this.cacheExpiry;

        return {
            cached: true,
            lastUpdated: lastUpdated,
            expired: expired,
            newsCount: data.news.length
        };
    }

    // 초기 캐시 데이터 설정 (localStorage가 비어있을 때)
    initializeCache() {
        console.log('초기 캐시 데이터 설정');
        const initialData = {
            lastUpdated: new Date().toISOString(),
            news: this.getFallbackNews()
        };
        
        localStorage.setItem('news-cache', JSON.stringify(initialData));
        console.log('초기 캐시 데이터 설정 완료');
        return initialData.news;
    }

    // 뉴스 매니저 초기화
    async initialize() {
        console.log('뉴스 매니저 초기화 시작');
        
        // localStorage에 캐시가 없으면 초기 데이터 설정
        const cachedData = localStorage.getItem('news-cache');
        if (!cachedData) {
            console.log('캐시가 없어서 초기 데이터 설정');
            this.initializeCache();
        }
        
        // 백그라운드에서 새로운 뉴스 가져오기 시도
        setTimeout(() => {
            console.log('백그라운드에서 뉴스 업데이트 시도');
            this.fetchAndCacheNews().catch(error => {
                console.log('백그라운드 뉴스 업데이트 실패:', error);
            });
        }, 1000);
        
        console.log('뉴스 매니저 초기화 완료');
    }
}

// 전역 뉴스 매니저 인스턴스 생성 및 초기화
window.newsManager = new NewsManager();

// 뉴스 매니저 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('뉴스 매니저 자동 초기화 시작');
    if (window.newsManager) {
        window.newsManager.initialize();
    }
});

// 즉시 초기화도 시도 (DOMContentLoaded가 이미 발생한 경우)
if (document.readyState === 'loading') {
    console.log('DOM 로딩 중, DOMContentLoaded 이벤트 대기');
} else {
    console.log('DOM 이미 로드됨, 즉시 뉴스 매니저 초기화');
    if (window.newsManager) {
        window.newsManager.initialize();
    }
}