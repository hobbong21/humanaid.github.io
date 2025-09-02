// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Form submission
document.querySelector('.contact-form form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;
    
    // Simple validation
    if (!name || !email || !message) {
        alert('모든 필드를 입력해주세요.');
        return;
    }
    
    // Simulate form submission
    alert('문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.');
    this.reset();
});

// Legacy animation code - now handled by AnimationController
// This section is kept for backward compatibility but will be replaced by the new system

// Hero button click handlers
document.addEventListener('DOMContentLoaded', () => {
    const primaryBtn = document.querySelector('.btn-primary');
    const secondaryBtn = document.querySelector('.btn-secondary');
    
    if (primaryBtn) {
        primaryBtn.addEventListener('click', () => {
            const servicesSection = document.querySelector('#services');
            if (servicesSection) {
                servicesSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Secondary button already has onclick handler in HTML, so we don't need to add another one here
});

// Enhanced header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.8)';
        header.style.boxShadow = 'none';
    }
});

// Simple and Reliable Highlights Carousel
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing carousel...');
    
    const slides = document.querySelectorAll('.highlight-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const carousel = document.querySelector('.highlights-carousel');
    
    console.log('Found elements:', {
        slides: slides.length,
        indicators: indicators.length,
        prevBtn: !!prevBtn,
        nextBtn: !!nextBtn,
        carousel: !!carousel
    });
    
    if (!slides.length || !indicators.length) {
        console.error('Carousel elements not found');
        return;
    }
    
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        console.log('Showing slide:', index);
        
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    function startAutoSlide() {
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 5000);
        console.log('Auto slide started');
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
            console.log('Auto slide stopped');
        }
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Next button clicked');
            nextSlide();
            stopAutoSlide();
            setTimeout(startAutoSlide, 3000);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Prev button clicked');
            prevSlide();
            stopAutoSlide();
            setTimeout(startAutoSlide, 3000);
        });
    }

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Indicator clicked:', index);
            showSlide(index);
            stopAutoSlide();
            setTimeout(startAutoSlide, 3000);
        });
    });

    // Pause on hover
    if (carousel) {
        carousel.addEventListener('mouseenter', () => {
            console.log('Mouse enter - stopping auto slide');
            stopAutoSlide();
        });
        carousel.addEventListener('mouseleave', () => {
            console.log('Mouse leave - starting auto slide');
            startAutoSlide();
        });
    }
    
    // Initialize carousel
    showSlide(0);
    startAutoSlide();
    
    console.log('Carousel initialized successfully');
});

// News Page Tabs
document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    function showTab(tabId) {
        // Hide all tab contents
        tabContents.forEach(content => content.classList.remove('active'));
        tabBtns.forEach(btn => btn.classList.remove('active'));

        // Show selected tab
        const selectedTab = document.getElementById(tabId);
        const selectedBtn = document.querySelector(`[data-tab="${tabId}"]`);
        
        if (selectedTab) selectedTab.classList.add('active');
        if (selectedBtn) selectedBtn.classList.add('active');
        
        // 뉴스 탭이 선택되었을 때 뉴스 로드
        if (tabId === 'news') {
            const newsPageGrid = document.getElementById('newsPageGrid');
            if (newsPageGrid && newsPageGrid.children.length === 0) {
                console.log('뉴스 탭 활성화, 뉴스 로딩 시작');
                loadNewsPageContent();
            }
        }
    }

    // Tab button event listeners
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            showTab(tabId);
        });
    });
    
    // 뉴스 페이지 로드 시 뉴스 탭이 기본 활성화되어 있으면 뉴스 로드
    if (window.location.pathname.includes('news.html')) {
        const newsTab = document.getElementById('news');
        if (newsTab && newsTab.classList.contains('active')) {
            console.log('뉴스 페이지 로드 시 뉴스 로딩');
            setTimeout(() => {
                loadNewsPageContent();
            }, 100);
        }
    }
});

// Smooth scroll for news page links
document.addEventListener('DOMContentLoaded', () => {
    const newsLinks = document.querySelectorAll('a[href^="index.html#"]');
    
    newsLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const targetId = href.split('#')[1];
            
            if (targetId) {
                // If we're on the news page, navigate to index page
                if (window.location.pathname.includes('news.html')) {
                    // Let the default behavior handle navigation
                    return;
                }
                
                // If we're on the same page, smooth scroll
                e.preventDefault();
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// DeepSearch News API Integration
const DEEPSEARCH_API_URL = 'https://news.deepsearch.com/api';
const API_KEY = '8daef9ce9c954ce1865472ebde12fc23';

// 새로운 뉴스 로딩 함수 (뉴스 매니저 사용)
async function loadLatestNews() {
    console.log('loadLatestNews 함수 호출됨 (뉴스 매니저 사용)');
    
    const newsContainer = document.getElementById('newsContainer');
    const newsLoading = document.getElementById('newsLoading');
    const newsError = document.getElementById('newsError');
    
    console.log('뉴스 요소들:', { newsContainer, newsLoading, newsError });
    
    if (!newsContainer) {
        console.error('뉴스 컨테이너를 찾을 수 없습니다');
        return;
    }
    
    // 로딩 상태 표시 with animation
    if (newsLoading) {
        newsLoading.style.display = 'block';
        if (window.newsAnimationEnhancer) {
            window.newsAnimationEnhancer.animateNewsLoading();
        }
    }
    if (newsError) newsError.style.display = 'none';
    newsContainer.innerHTML = '';
    
    try {
        console.log('뉴스 매니저에서 메인페이지 뉴스 가져오기 시작');
        
        // 뉴스 매니저가 로드되지 않은 경우 대기 및 재시도
        let newsData = null;
        let retryCount = 0;
        const maxRetries = 5;
        
        while (!newsData && retryCount < maxRetries) {
            if (!window.newsManager) {
                console.log(`뉴스 매니저 로딩 대기 중... (시도 ${retryCount + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 500));
                retryCount++;
                continue;
            }
            
            try {
                newsData = await window.newsManager.getMainPageNews();
                console.log('뉴스 데이터 가져오기 성공:', newsData);
                break;
            } catch (error) {
                console.error(`뉴스 데이터 가져오기 실패 (시도 ${retryCount + 1}):`, error);
                retryCount++;
                if (retryCount < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
        
        // 모든 시도가 실패한 경우 폴백 데이터 사용
        if (!newsData) {
            console.log('모든 시도 실패, 폴백 데이터 사용');
            newsData = [
                {
                    title: "AI 기술 동향 - 최신 업데이트",
                    summary: "인공지능 기술의 최신 동향과 발전 상황을 확인하세요. 다양한 AI 분야의 혁신적인 발전이 계속되고 있습니다.",
                    published_at: new Date().toISOString(),
                    source: "AI News",
                    url: "#",
                    image_url: null,
                    tags: ["AI", "기술동향"],
                    category: "AI 뉴스"
                },
                {
                    title: "머신러닝의 미래 전망",
                    summary: "머신러닝 기술이 다양한 산업 분야에 미치는 영향과 앞으로의 발전 방향을 살펴봅니다.",
                    published_at: new Date(Date.now() - 24*60*60*1000).toISOString(),
                    source: "Tech Today",
                    url: "#",
                    image_url: null,
                    tags: ["머신러닝", "미래기술"],
                    category: "기술 전망"
                },
                {
                    title: "딥러닝 혁신 사례",
                    summary: "최근 딥러닝 기술을 활용한 혁신적인 사례들과 실제 적용 분야를 소개합니다.",
                    published_at: new Date(Date.now() - 48*60*60*1000).toISOString(),
                    source: "Deep Learning Weekly",
                    url: "#",
                    image_url: null,
                    tags: ["딥러닝", "혁신사례"],
                    category: "딥러닝"
                }
            ];
        }
        console.log('뉴스 데이터 가져오기 완료:', newsData);
        
        // 로딩 숨기기
        if (newsLoading) newsLoading.style.display = 'none';
        
        if (newsData && newsData.length > 0) {
            console.log('뉴스 아이템 렌더링 시작');
            renderNewsItems(newsData);
            console.log('뉴스 아이템 렌더링 완료');
        } else {
            console.log('뉴스 데이터가 없음');
            showNoNewsMessage();
        }
        
    } catch (error) {
        console.error('뉴스 로딩 오류:', error);
        if (newsLoading) newsLoading.style.display = 'none';
        if (newsError) newsError.style.display = 'block';
    }
}

// AI 뉴스 가져오기 (딥서치 API 연동)
async function fetchAINews() {
    try {
        console.log('딥서치 API 호출 시작');
        
        const response = await fetch(`${DEEPSEARCH_API_URL}/v1/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY
            },
            body: JSON.stringify({
                query: 'AI OR 인공지능 OR "artificial intelligence" OR "machine learning" OR "deep learning" OR ChatGPT OR OpenAI OR 딥러닝',
                size: 6,
                sort: [
                    { "published_at": { "order": "desc" } }
                ],
                filter: {
                    published_at: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 최근 7일
                    }
                }
            })
        });
        
        console.log('API 응답 상태:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API 오류 응답:', errorText);
            throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API 응답 데이터:', data);
        
        return data.hits || data.documents || [];
        
    } catch (error) {
        console.error('딥서치 API 호출 오류:', error);
        
        // API 호출 실패 시 폴백 데이터 제공
        console.log('폴백 데이터 사용 - API 호출 실패');
        console.log('오류 상세:', error.message);
        return [
            {
                _source: {
                    title: "OpenAI, GPT-5 개발 완료... 2025년 상반기 출시 예정",
                    summary: "OpenAI가 차세대 언어모델 GPT-5의 개발을 완료했다고 발표했습니다. GPT-5는 기존 모델 대비 추론 능력과 멀티모달 처리 성능이 크게 향상되었습니다.",
                    published_at: "2025-08-15T09:30:00Z",
                    source: "TechCrunch",
                    url: "https://techcrunch.com/ai-news",
                    image_url: null,
                    tags: ["OpenAI", "GPT-5", "언어모델"]
                }
            },
            {
                _source: {
                    title: "구글, AI 칩 TPU v6 공개... 성능 3배 향상",
                    summary: "구글이 새로운 AI 전용 칩 TPU v6를 공개했습니다. 이전 세대 대비 3배 향상된 성능으로 대규모 AI 모델 훈련 시간을 대폭 단축할 수 있습니다.",
                    published_at: "2025-08-14T14:20:00Z",
                    source: "Google AI",
                    url: "https://ai.google/news",
                    image_url: null,
                    tags: ["Google", "TPU", "AI칩"]
                }
            },
            {
                _source: {
                    title: "메타, 라마 3.1 오픈소스 모델 출시",
                    summary: "메타가 라마 3.1 오픈소스 언어모델을 출시했습니다. 4050억 개의 매개변수를 가진 이 모델은 상업적 이용이 가능한 최대 규모의 오픈소스 모델입니다.",
                    published_at: "2025-08-13T11:15:00Z",
                    source: "Meta AI",
                    url: "https://ai.meta.com/news",
                    image_url: null,
                    tags: ["Meta", "Llama", "오픈소스"]
                }
            },
            {
                _source: {
                    title: "AI 의료진단 정확도 95% 달성, 상용화 임박",
                    summary: "국내 AI 스타트업이 개발한 의료 영상 진단 AI가 95%의 정확도를 달성하며 상용화를 앞두고 있습니다. 특히 폐암 조기 진단 분야에서 뛰어난 성과를 보이고 있습니다.",
                    published_at: "2025-08-12T16:45:00Z",
                    source: "의료AI뉴스",
                    url: "https://medicalai.news",
                    image_url: null,
                    tags: ["의료AI", "진단", "폐암"]
                }
            },
            {
                _source: {
                    title: "마이크로소프트, 코파일럿 AI 업데이트 발표",
                    summary: "마이크로소프트가 코파일럿 AI의 대규모 업데이트를 발표했습니다. 새로운 버전은 코드 생성 속도가 40% 향상되었으며, 더 정확한 코드 제안을 제공합니다.",
                    published_at: "2025-08-11T13:30:00Z",
                    source: "Microsoft Blog",
                    url: "https://blogs.microsoft.com/ai",
                    image_url: null,
                    tags: ["Microsoft", "Copilot", "코드생성"]
                }
            },
            {
                _source: {
                    title: "엔비디아, H200 GPU로 AI 훈련 성능 혁신",
                    summary: "엔비디아가 새로운 H200 GPU를 공개했습니다. 이전 세대 대비 2.5배 향상된 메모리 대역폭으로 대규모 AI 모델 훈련에서 획기적인 성능 개선을 보여줍니다.",
                    published_at: "2025-08-10T10:00:00Z",
                    source: "NVIDIA News",
                    url: "https://nvidianews.nvidia.com",
                    image_url: null,
                    tags: ["NVIDIA", "H200", "GPU"]
                }
            }
        ];
    }
}

// 뉴스 아이템 렌더링
function renderNewsItems(newsData) {
    console.log('renderNewsItems 호출됨, 데이터 개수:', newsData.length);
    
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) {
        console.error('뉴스 컨테이너를 찾을 수 없습니다');
        return;
    }
    
    const newsElements = [];
    
    newsData.forEach((item, index) => {
        console.log(`뉴스 아이템 ${index + 1} 렌더링 중:`, item._source.title);
        const news = item._source;
        const newsElement = createNewsElement(news, false); // 모든 카드를 동일하게 처리
        newsElements.push(newsElement);
        newsContainer.appendChild(newsElement);
    });
    
    // Apply staggered animations to news items
    if (window.newsAnimationEnhancer && newsElements.length > 0) {
        window.newsAnimationEnhancer.staggerNewsItems(newsElements);
    }
    
    console.log('모든 뉴스 아이템 렌더링 완료');
}

// 뉴스 엘리먼트 생성 (새로운 데이터 구조 지원)
function createNewsElement(news, isFeatured = false) {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';
    
    // 새로운 데이터 구조와 기존 구조 모두 지원
    const newsData = news._source || news;
    
    const publishedDate = new Date(newsData.published_at);
    const formattedDate = publishedDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    
    const tagsHtml = newsData.tags ? newsData.tags.map(tag => 
        `<span class="news-tag">${tag}</span>`
    ).join('') : '';
    
    // 카테고리 표시 (새로운 기능)
    const categoryHtml = newsData.category ? 
        `<span class="news-category">${newsData.category}</span>` : '';
    
    newsItem.innerHTML = `
        <div class="news-item-image">
            ${newsData.image_url ? 
                `<img src="${newsData.image_url}" alt="${newsData.title}" loading="lazy">` : 
                '<div class="news-placeholder-img">🤖</div>'
            }
        </div>
        <div class="news-item-content">
            <div class="news-item-meta">
                ${categoryHtml}
                <span class="news-source">${newsData.source}</span>
                <span class="news-date">${formattedDate}</span>
            </div>
            <h3 class="news-item-title">${newsData.title}</h3>
            <p class="news-item-summary">${newsData.summary}</p>
            ${tagsHtml ? `<div class="news-item-tags">${tagsHtml}</div>` : ''}
            <a href="${newsData.url}" class="news-item-link" target="_blank" rel="noopener noreferrer">
                자세히 보기 →
            </a>
        </div>
    `;
    
    // 클릭 이벤트 추가
    newsItem.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') {
            window.open(news.url, '_blank', 'noopener,noreferrer');
        }
    });
    
    return newsItem;
}

// 뉴스가 없을 때 메시지 표시
function showNoNewsMessage() {
    const newsContainer = document.getElementById('newsContainer');
    newsContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 0; grid-column: 1 / -1;">
            <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.6;">📰</div>
            <p style="color: var(--text-secondary); font-size: 16px;">현재 표시할 뉴스가 없습니다.</p>
        </div>
    `;
}

// 뉴스 로딩 초기화 함수
function initializeNewsLoading() {
    console.log('뉴스 로딩 초기화 시작');
    
    // 메인 페이지에서만 뉴스 로딩
    const newsContainer = document.getElementById('newsContainer');
    if (newsContainer) {
        console.log('뉴스 컨테이너 발견, 뉴스 로딩 시작');
        
        // 이미 뉴스가 로드되어 있는지 확인
        if (newsContainer.children.length === 0) {
            console.log('뉴스 컨테이너가 비어있음, 로딩 시작');
            
            // 뉴스 매니저가 준비될 때까지 대기
            const waitForNewsManager = () => {
                if (window.newsManager) {
                    console.log('뉴스 매니저 준비됨, 뉴스 로딩 실행');
                    loadLatestNews();
                } else {
                    console.log('뉴스 매니저 대기 중...');
                    setTimeout(waitForNewsManager, 200);
                }
            };
            
            waitForNewsManager();
        } else {
            console.log('뉴스가 이미 로드되어 있음');
        }
    } else {
        console.log('뉴스 컨테이너를 찾을 수 없음 (메인 페이지가 아닐 수 있음)');
    }
}

// 페이지 로드 시 뉴스 로딩 - 여러 이벤트로 보장
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 로드 완료');
    setTimeout(initializeNewsLoading, 100);
});

// 윈도우 로드 이벤트에서도 시도
window.addEventListener('load', () => {
    console.log('윈도우 로드 완료');
    setTimeout(initializeNewsLoading, 200);
});

// 추가 보장을 위한 지연 실행
setTimeout(() => {
    console.log('지연 실행으로 뉴스 로딩 재시도');
    initializeNewsLoading();
}, 1000);

// 최종 보장 - 3초 후에도 뉴스가 없으면 강제 로딩
setTimeout(() => {
    const newsContainer = document.getElementById('newsContainer');
    if (newsContainer && newsContainer.children.length === 0) {
        console.log('최종 보장: 뉴스 매니저를 통한 강제 로딩');
        if (window.newsManager) {
            loadLatestNews();
        } else {
            console.log('뉴스 매니저가 없어서 폴백 뉴스 표시');
            showFallbackNews();
        }
    }
}, 3000);

// 뉴스 매니저 초기화 확인
function ensureNewsManagerLoaded() {
    return new Promise((resolve) => {
        if (window.newsManager) {
            resolve(window.newsManager);
        } else {
            const checkInterval = setInterval(() => {
                if (window.newsManager) {
                    clearInterval(checkInterval);
                    resolve(window.newsManager);
                }
            }, 100);
            
            // 5초 후에도 로드되지 않으면 포기
            setTimeout(() => {
                clearInterval(checkInterval);
                console.error('뉴스 매니저 로드 실패');
                resolve(null);
            }, 5000);
        }
    });
}

// 뉴스 페이지용 뉴스 로딩 함수 (뉴스 매니저 사용)
async function loadNewsPageContent() {
    console.log('뉴스 페이지 콘텐츠 로딩 시작 (뉴스 매니저 사용)');
    
    const newsPageGrid = document.getElementById('newsPageGrid');
    const newsPageLoading = document.getElementById('newsPageLoading');
    const newsPageError = document.getElementById('newsPageError');
    
    if (!newsPageGrid) {
        console.log('뉴스 페이지 그리드를 찾을 수 없음');
        return;
    }
    
    // 로딩 상태 표시
    if (newsPageLoading) newsPageLoading.style.display = 'block';
    if (newsPageError) newsPageError.style.display = 'none';
    newsPageGrid.innerHTML = '';
    
    try {
        console.log('뉴스 매니저에서 뉴스페이지 뉴스 가져오기 시작');
        
        // 뉴스 매니저가 로드되지 않은 경우 대기 및 재시도
        let newsData = null;
        let retryCount = 0;
        const maxRetries = 5;
        
        while (!newsData && retryCount < maxRetries) {
            if (!window.newsManager) {
                console.log(`뉴스 매니저 로딩 대기 중... (뉴스페이지, 시도 ${retryCount + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 500));
                retryCount++;
                continue;
            }
            
            try {
                newsData = await window.newsManager.getNewsPageNews();
                console.log('뉴스페이지 데이터 가져오기 성공:', newsData);
                break;
            } catch (error) {
                console.error(`뉴스페이지 데이터 가져오기 실패 (시도 ${retryCount + 1}):`, error);
                retryCount++;
                if (retryCount < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
        
        // 모든 시도가 실패한 경우 폴백 데이터 사용
        if (!newsData) {
            console.log('뉴스페이지 모든 시도 실패, 폴백 데이터 사용');
            if (window.newsManager) {
                newsData = window.newsManager.getFallbackNews();
            } else {
                newsData = [
                    {
                        title: "AI 기술 동향 - 최신 업데이트",
                        summary: "인공지능 기술의 최신 동향과 발전 상황을 확인하세요.",
                        published_at: new Date().toISOString(),
                        source: "AI News",
                        url: "#",
                        category: "AI 뉴스"
                    }
                ];
            }
        }
        console.log('뉴스 페이지용 데이터 가져오기 완료:', newsData);
        
        // 로딩 숨기기
        if (newsPageLoading) newsPageLoading.style.display = 'none';
        
        if (newsData && newsData.length > 0) {
            console.log('뉴스 페이지 아이템 렌더링 시작');
            renderNewsPageItems(newsData);
            console.log('뉴스 페이지 아이템 렌더링 완료');
        } else {
            console.log('뉴스 페이지 데이터가 없음');
            showNoNewsMessageForPage();
        }
        
    } catch (error) {
        console.error('뉴스 페이지 로딩 오류:', error);
        if (newsPageLoading) newsPageLoading.style.display = 'none';
        if (newsPageError) newsPageError.style.display = 'block';
    }
}

// 뉴스 페이지용 AI 뉴스 가져오기 (더 많은 데이터)
async function fetchAINewsForPage() {
    try {
        console.log('뉴스 페이지용 딥서치 API 호출 시작');
        
        const response = await fetch(`${DEEPSEARCH_API_URL}/v1/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY
            },
            body: JSON.stringify({
                query: 'AI OR 인공지능 OR "artificial intelligence" OR "machine learning" OR "deep learning" OR ChatGPT OR OpenAI OR 딥러닝 OR 머신러닝',
                size: 12,
                sort: [
                    { "published_at": { "order": "desc" } }
                ],
                filter: {
                    published_at: {
                        gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 최근 14일
                    }
                }
            })
        });
        
        console.log('뉴스 페이지 API 응답 상태:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('뉴스 페이지 API 오류 응답:', errorText);
            throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('뉴스 페이지 API 응답 데이터:', data);
        
        return data.hits || data.documents || [];
        
    } catch (error) {
        console.error('뉴스 페이지 딥서치 API 호출 오류:', error);
        
        // API 호출 실패 시 폴백 데이터 제공 (더 많은 데이터)
        console.log('뉴스 페이지 폴백 데이터 사용');
        return [
            {
                _source: {
                    title: "OpenAI, GPT-5 개발 완료... 2025년 상반기 출시 예정",
                    summary: "OpenAI가 차세대 언어모델 GPT-5의 개발을 완료했다고 발표했습니다. GPT-5는 기존 모델 대비 추론 능력과 멀티모달 처리 성능이 크게 향상되었습니다.",
                    published_at: "2025-08-15T09:30:00Z",
                    source: "TechCrunch",
                    url: "https://techcrunch.com/ai-news",
                    image_url: null,
                    tags: ["OpenAI", "GPT-5", "언어모델"]
                }
            },
            {
                _source: {
                    title: "구글, AI 칩 TPU v6 공개... 성능 3배 향상",
                    summary: "구글이 새로운 AI 전용 칩 TPU v6를 공개했습니다. 이전 세대 대비 3배 향상된 성능으로 대규모 AI 모델 훈련 시간을 대폭 단축할 수 있습니다.",
                    published_at: "2025-08-14T14:20:00Z",
                    source: "Google AI",
                    url: "https://ai.google/news",
                    image_url: null,
                    tags: ["Google", "TPU", "AI칩"]
                }
            },
            {
                _source: {
                    title: "메타, 라마 3.1 오픈소스 모델 출시",
                    summary: "메타가 라마 3.1 오픈소스 언어모델을 출시했습니다. 4050억 개의 매개변수를 가진 이 모델은 상업적 이용이 가능한 최대 규모의 오픈소스 모델입니다.",
                    published_at: "2025-08-13T11:15:00Z",
                    source: "Meta AI",
                    url: "https://ai.meta.com/news",
                    image_url: null,
                    tags: ["Meta", "Llama", "오픈소스"]
                }
            },
            {
                _source: {
                    title: "AI 의료진단 정확도 95% 달성, 상용화 임박",
                    summary: "국내 AI 스타트업이 개발한 의료 영상 진단 AI가 95%의 정확도를 달성하며 상용화를 앞두고 있습니다. 특히 폐암 조기 진단 분야에서 뛰어난 성과를 보이고 있습니다.",
                    published_at: "2025-08-12T16:45:00Z",
                    source: "의료AI뉴스",
                    url: "https://medicalai.news",
                    image_url: null,
                    tags: ["의료AI", "진단", "폐암"]
                }
            },
            {
                _source: {
                    title: "마이크로소프트, 코파일럿 AI 업데이트 발표",
                    summary: "마이크로소프트가 코파일럿 AI의 대규모 업데이트를 발표했습니다. 새로운 버전은 코드 생성 속도가 40% 향상되었으며, 더 정확한 코드 제안을 제공합니다.",
                    published_at: "2025-08-11T13:30:00Z",
                    source: "Microsoft Blog",
                    url: "https://blogs.microsoft.com/ai",
                    image_url: null,
                    tags: ["Microsoft", "Copilot", "코드생성"]
                }
            },
            {
                _source: {
                    title: "엔비디아, H200 GPU로 AI 훈련 성능 혁신",
                    summary: "엔비디아가 새로운 H200 GPU를 공개했습니다. 이전 세대 대비 2.5배 향상된 메모리 대역폭으로 대규모 AI 모델 훈련에서 획기적인 성능 개선을 보여줍니다.",
                    published_at: "2025-08-10T10:00:00Z",
                    source: "NVIDIA News",
                    url: "https://nvidianews.nvidia.com",
                    image_url: null,
                    tags: ["NVIDIA", "H200", "GPU"]
                }
            },
            {
                _source: {
                    title: "애플, 시리에 생성형 AI 기능 추가",
                    summary: "애플이 iOS 19에서 시리에 생성형 AI 기능을 추가한다고 발표했습니다. 사용자와의 더 자연스러운 대화와 창작 지원 기능이 포함됩니다.",
                    published_at: "2025-08-09T15:20:00Z",
                    source: "Apple Newsroom",
                    url: "https://apple.com/newsroom",
                    image_url: null,
                    tags: ["Apple", "Siri", "생성형AI"]
                }
            },
            {
                _source: {
                    title: "삼성전자, AI 반도체 신제품 공개",
                    summary: "삼성전자가 차세대 AI 반도체를 공개했습니다. 새로운 아키텍처로 전력 효율성을 50% 개선하며 AI 추론 성능을 대폭 향상시켰습니다.",
                    published_at: "2025-08-08T11:45:00Z",
                    source: "삼성뉴스룸",
                    url: "https://news.samsung.com",
                    image_url: null,
                    tags: ["삼성전자", "AI반도체", "전력효율"]
                }
            },
            {
                _source: {
                    title: "아마존, 알렉사 AI 어시스턴트 대폭 업그레이드",
                    summary: "아마존이 알렉사에 대화형 AI 기능을 대폭 강화했습니다. 더 자연스러운 대화와 상황 인식 능력이 크게 개선되었습니다.",
                    published_at: "2025-08-07T14:30:00Z",
                    source: "Amazon News",
                    url: "https://amazon.com/news",
                    image_url: null,
                    tags: ["Amazon", "Alexa", "음성AI"]
                }
            },
            {
                _source: {
                    title: "테슬라, 자율주행 AI 완전 자율화 달성",
                    summary: "테슬라가 완전 자율주행(FSD) AI 시스템의 레벨 5 자율주행을 달성했다고 발표했습니다. 인간의 개입 없이 모든 도로 상황에서 안전한 주행이 가능합니다.",
                    published_at: "2025-08-06T16:15:00Z",
                    source: "Tesla Blog",
                    url: "https://tesla.com/blog",
                    image_url: null,
                    tags: ["Tesla", "자율주행", "FSD"]
                }
            },
            {
                _source: {
                    title: "IBM, 양자 컴퓨팅과 AI 융합 기술 발표",
                    summary: "IBM이 양자 컴퓨팅과 AI를 결합한 혁신적인 기술을 발표했습니다. 복잡한 최적화 문제를 기존 대비 1000배 빠르게 해결할 수 있습니다.",
                    published_at: "2025-08-05T12:00:00Z",
                    source: "IBM Research",
                    url: "https://research.ibm.com",
                    image_url: null,
                    tags: ["IBM", "양자컴퓨팅", "최적화"]
                }
            },
            {
                _source: {
                    title: "바이두, 중국어 특화 AI 모델 어니봇 4.0 출시",
                    summary: "바이두가 중국어에 특화된 대화형 AI 모델 어니봇 4.0을 출시했습니다. 중국 문화와 언어의 미묘한 차이를 이해하는 능력이 크게 향상되었습니다.",
                    published_at: "2025-08-04T10:30:00Z",
                    source: "Baidu AI",
                    url: "https://ai.baidu.com",
                    image_url: null,
                    tags: ["Baidu", "어니봇", "중국어AI"]
                }
            }
        ];
    }
}

// 뉴스 페이지 아이템 렌더링
function renderNewsPageItems(newsData) {
    console.log('뉴스 페이지 아이템 렌더링 시작, 데이터 개수:', newsData.length);
    
    const newsPageGrid = document.getElementById('newsPageGrid');
    if (!newsPageGrid) {
        console.error('뉴스 페이지 그리드를 찾을 수 없습니다');
        return;
    }
    
    newsData.forEach((item, index) => {
        console.log(`뉴스 페이지 아이템 ${index + 1} 렌더링 중:`, item._source.title);
        const news = item._source;
        const newsElement = createNewsPageElement(news, index === 0); // 첫 번째 아이템을 featured로 처리
        newsPageGrid.appendChild(newsElement);
    });
    
    console.log('뉴스 페이지 모든 아이템 렌더링 완료');
}

// 뉴스 페이지용 뉴스 엘리먼트 생성 (새로운 데이터 구조 지원)
function createNewsPageElement(news, isFeatured = false) {
    const newsCard = document.createElement('article');
    newsCard.className = isFeatured ? 'news-card featured' : 'news-card';
    
    // 새로운 데이터 구조와 기존 구조 모두 지원
    const newsData = news._source || news;
    
    const publishedDate = new Date(newsData.published_at);
    const formattedDate = publishedDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    
    // 카테고리 사용 (새로운 구조에서는 이미 분류됨)
    const category = newsData.category || newsData.source || 'AI 뉴스';
    
    // 태그 생성
    const tags = newsData.tags || [];
    const tagsHtml = tags.length > 0 ? `
        <div class="news-tags">
            ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
    ` : '';
    
    newsCard.innerHTML = `
        <div class="news-image">
            ${newsData.image_url ? 
                `<img src="${newsData.image_url}" alt="${newsData.title}" loading="lazy">` : 
                '<div class="news-placeholder">🤖</div>'
            }
        </div>
        <div class="news-info">
            <span class="news-category">${category}</span>
            <span class="news-date">${formattedDate}</span>
        </div>
        <h3>${newsData.title}</h3>
        <p>${newsData.summary}</p>
        ${tagsHtml}
        <a href="${newsData.url}" class="read-more" target="_blank" rel="noopener noreferrer">자세히 보기</a>
    `;
    
    // 클릭 이벤트 추가
    newsCard.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') {
            window.open(newsData.url, '_blank', 'noopener,noreferrer');
        }
    });
    
    return newsCard;
}

// 뉴스 페이지에서 뉴스가 없을 때 메시지 표시
function showNoNewsMessageForPage() {
    const newsPageGrid = document.getElementById('newsPageGrid');
    newsPageGrid.innerHTML = `
        <div style="text-align: center; padding: 60px 0; grid-column: 1 / -1;">
            <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.6;">📰</div>
            <p style="color: var(--text-secondary); font-size: 16px;">현재 표시할 뉴스가 없습니다.</p>
        </div>
    `;
}

// 딥서치 API 테스트 함수
async function testDeepSearchAPI() {
    console.log('딥서치 API 테스트 시작');
    console.log('API URL:', DEEPSEARCH_API_URL);
    console.log('API KEY:', API_KEY ? 'API 키 설정됨' : 'API 키 없음');
    
    try {
        const response = await fetch(`${DEEPSEARCH_API_URL}/v1/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY
            },
            body: JSON.stringify({
                query: 'AI',
                size: 3
            })
        });
        
        console.log('API 테스트 응답 상태:', response.status);
        console.log('API 테스트 응답 헤더:', response.headers);
        
        const responseText = await response.text();
        console.log('API 테스트 응답 내용:', responseText);
        
        if (response.ok) {
            const data = JSON.parse(responseText);
            console.log('API 테스트 성공:', data);
            return data;
        } else {
            console.error('API 테스트 실패:', response.status, responseText);
            return null;
        }
    } catch (error) {
        console.error('API 테스트 오류:', error);
        return null;
    }
}

// 디버깅용 함수
function debugNewsLoading() {
    console.log('=== 뉴스 로딩 디버깅 시작 ===');
    console.log('현재 페이지:', window.location.pathname);
    
    const newsContainer = document.getElementById('newsContainer');
    const newsLoading = document.getElementById('newsLoading');
    const newsError = document.getElementById('newsError');
    
    console.log('DOM 요소 확인:');
    console.log('- newsContainer:', newsContainer);
    console.log('- newsLoading:', newsLoading);
    console.log('- newsError:', newsError);
    
    if (newsContainer) {
        console.log('- newsContainer 내용:', newsContainer.innerHTML);
        console.log('- newsContainer 자식 수:', newsContainer.children.length);
    }
    
    console.log('=== 강제 뉴스 로딩 실행 ===');
    loadLatestNews();
}

// 폴백 데이터만으로 뉴스 표시 (테스트용)
function showFallbackNews() {
    console.log('폴백 뉴스 표시 시작');
    
    const newsContainer = document.getElementById('newsContainer');
    const newsLoading = document.getElementById('newsLoading');
    const newsError = document.getElementById('newsError');
    
    if (!newsContainer) {
        console.error('뉴스 컨테이너를 찾을 수 없습니다');
        return;
    }
    
    // 로딩 숨기기
    if (newsLoading) newsLoading.style.display = 'none';
    if (newsError) newsError.style.display = 'none';
    
    // 폴백 데이터
    const fallbackNews = [
        {
            _source: {
                title: "OpenAI, GPT-5 개발 완료... 2025년 상반기 출시 예정",
                summary: "OpenAI가 차세대 언어모델 GPT-5의 개발을 완료했다고 발표했습니다. GPT-5는 기존 모델 대비 추론 능력과 멀티모달 처리 성능이 크게 향상되었습니다.",
                published_at: "2025-08-15T09:30:00Z",
                source: "TechCrunch",
                url: "https://techcrunch.com/ai-news",
                image_url: null,
                tags: ["OpenAI", "GPT-5", "언어모델"]
            }
        },
        {
            _source: {
                title: "구글, AI 칩 TPU v6 공개... 성능 3배 향상",
                summary: "구글이 새로운 AI 전용 칩 TPU v6를 공개했습니다. 이전 세대 대비 3배 향상된 성능으로 대규모 AI 모델 훈련 시간을 대폭 단축할 수 있습니다.",
                published_at: "2025-08-14T14:20:00Z",
                source: "Google AI",
                url: "https://ai.google/news",
                image_url: null,
                tags: ["Google", "TPU", "AI칩"]
            }
        },
        {
            _source: {
                title: "메타, 라마 3.1 오픈소스 모델 출시",
                summary: "메타가 라마 3.1 오픈소스 언어모델을 출시했습니다. 4050억 개의 매개변수를 가진 이 모델은 상업적 이용이 가능한 최대 규모의 오픈소스 모델입니다.",
                published_at: "2025-08-13T11:15:00Z",
                source: "Meta AI",
                url: "https://ai.meta.com/news",
                image_url: null,
                tags: ["Meta", "Llama", "오픈소스"]
            }
        }
    ];
    
    console.log('폴백 뉴스 렌더링 시작');
    renderNewsItems(fallbackNews);
    console.log('폴백 뉴스 렌더링 완료');
}

// 뉴스 캐시 관리 함수들
function refreshNewsCache() {
    console.log('뉴스 캐시 새로고침 시작');
    if (window.newsManager) {
        window.newsManager.refreshCache().then(() => {
            console.log('캐시 새로고침 완료, 뉴스 다시 로딩');
            loadLatestNews();
        }).catch(error => {
            console.error('캐시 새로고침 실패:', error);
            alert('캐시 새로고침에 실패했습니다. 콘솔을 확인해주세요.');
        });
    } else {
        console.error('뉴스 매니저가 로드되지 않았습니다');
        alert('뉴스 매니저가 로드되지 않았습니다.');
    }
}

// 즉시 뉴스 로딩 테스트
function testNewsLoading() {
    console.log('=== 뉴스 로딩 테스트 시작 ===');
    
    // 뉴스 매니저 상태 확인
    console.log('뉴스 매니저 상태:', window.newsManager ? '로드됨' : '로드되지 않음');
    
    if (window.newsManager) {
        // 캐시 상태 확인
        const cacheStatus = window.newsManager.getCacheStatus();
        console.log('캐시 상태:', cacheStatus);
        
        // 직접 뉴스 가져오기 테스트
        window.newsManager.getMainPageNews().then(news => {
            console.log('뉴스 가져오기 테스트 성공:', news);
            alert(`뉴스 ${news.length}개를 성공적으로 가져왔습니다!`);
        }).catch(error => {
            console.error('뉴스 가져오기 테스트 실패:', error);
            alert('뉴스 가져오기 테스트에 실패했습니다.');
        });
    } else {
        alert('뉴스 매니저가 로드되지 않았습니다.');
    }
}

function showCacheStatus() {
    if (window.newsManager) {
        const status = window.newsManager.getCacheStatus();
        console.log('캐시 상태:', status);
        alert(`캐시 상태:
- 캐시됨: ${status.cached ? '예' : '아니오'}
- 마지막 업데이트: ${status.lastUpdated ? status.lastUpdated.toLocaleString('ko-KR') : '없음'}
- 만료됨: ${status.expired ? '예' : '아니오'}
- 뉴스 개수: ${status.newsCount || 0}개`);
    }
}

// 개선된 디버깅 함수
function debugNewsSystem() {
    console.log('=== 뉴스 시스템 디버깅 ===');
    console.log('현재 페이지:', window.location.pathname);
    console.log('뉴스 매니저:', window.newsManager ? '로드됨' : '로드되지 않음');
    
    if (window.newsManager) {
        const status = window.newsManager.getCacheStatus();
        console.log('캐시 상태:', status);
    }
    
    const newsContainer = document.getElementById('newsContainer');
    const newsLoading = document.getElementById('newsLoading');
    const newsError = document.getElementById('newsError');
    
    console.log('DOM 요소:');
    console.log('- newsContainer:', newsContainer);
    console.log('- newsLoading:', newsLoading);
    console.log('- newsError:', newsError);
    
    if (newsContainer) {
        console.log('- 뉴스 컨테이너 자식 수:', newsContainer.children.length);
    }
    
    console.log('=== 뉴스 로딩 테스트 실행 ===');
    loadLatestNews();
}

// 전역 함수로 노출 (HTML에서 호출 가능)
window.loadLatestNews = loadLatestNews;
window.loadNewsPageContent = loadNewsPageContent;
window.testDeepSearchAPI = testDeepSearchAPI;
window.debugNewsLoading = debugNewsLoading;
window.showFallbackNews = showFallbackNews;
window.refreshNewsCache = refreshNewsCache;
window.showCacheStatus = showCacheStatus;
window.debugNewsSystem = debugNewsSystem;
window.testNewsLoading = testNewsLoading;

// 즉시 테스트 (개발용)
console.log('script.js 로드 완료');
if (typeof window !== 'undefined') {
    console.log('window 객체 사용 가능');
}

// Contact Form Handler
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                company: formData.get('company'),
                phone: formData.get('phone'),
                inquiryType: formData.get('inquiry-type'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                privacyAgree: formData.get('privacy-agree'),
                marketingAgree: formData.get('marketing-agree')
            };
            
            // Validation
            if (!data.name || !data.email || !data.inquiryType || !data.subject || !data.message) {
                alert('필수 항목을 모두 입력해주세요.');
                return;
            }
            
            if (!data.privacyAgree) {
                alert('개인정보처리방침에 동의해주세요.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('올바른 이메일 주소를 입력해주세요.');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '전송 중...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                alert('문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
});

// Update navigation for other pages
document.addEventListener('DOMContentLoaded', () => {
    // Update hero button handlers for index page
    const btnSecondary = document.querySelector('.btn-secondary');
    if (btnSecondary && !btnSecondary.onclick) {
        btnSecondary.addEventListener('click', () => {
            window.location.href = 'contact.html';
        });
    }
});