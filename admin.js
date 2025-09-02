// Admin Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initializeAdmin();
});

// Admin 초기화
function initializeAdmin() {
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // 로그인 상태 확인
    if (isLoggedIn()) {
        showDashboard();
    }
    
    // 로그인 폼 이벤트
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 로그아웃 버튼 이벤트
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // 탭 이벤트
    initializeTabs();
    
    // 뉴스 목록 로드
    loadAdminNews();
}

// 로그인 처리
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // 간단한 인증 (실제 환경에서는 서버 인증 필요)
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
        showNotification('로그인 성공!', 'success');
    } else {
        showNotification('잘못된 사용자명 또는 비밀번호입니다.', 'error');
    }
}

// 로그아웃 처리
function handleLogout() {
    localStorage.removeItem('adminLoggedIn');
    showLogin();
    showNotification('로그아웃되었습니다.', 'info');
}

// 로그인 상태 확인
function isLoggedIn() {
    return localStorage.getItem('adminLoggedIn') === 'true';
}

// 대시보드 표시
function showDashboard() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
}

// 로그인 화면 표시
function showLogin() {
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
}

// 탭 초기화
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // 모든 탭 비활성화
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // 선택된 탭 활성화
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// 하이라이트 수정
function editHighlight(id) {
    const highlightItem = document.querySelector(`[data-id="${id}"]`);
    const category = highlightItem.querySelector('.category').textContent;
    const title = highlightItem.querySelector('h3').textContent;
    const description = highlightItem.querySelector('p').textContent;
    
    document.getElementById('modalTitle').textContent = '하이라이트 수정';
    document.getElementById('editCategory').value = category;
    document.getElementById('editTitle').value = title;
    document.getElementById('editDescription').value = description;
    
    document.getElementById('editModal').style.display = 'flex';
    
    // 폼 제출 이벤트
    document.getElementById('editForm').onsubmit = (e) => {
        e.preventDefault();
        
        // 업데이트된 값들
        const newCategory = document.getElementById('editCategory').value;
        const newTitle = document.getElementById('editTitle').value;
        const newDescription = document.getElementById('editDescription').value;
        
        // DOM 업데이트
        highlightItem.querySelector('.category').textContent = newCategory;
        highlightItem.querySelector('h3').textContent = newTitle;
        highlightItem.querySelector('p').textContent = newDescription;
        
        closeModal();
        showNotification('하이라이트가 수정되었습니다.', 'success');
    };
}

// 하이라이트 삭제
function deleteHighlight(id) {
    if (confirm('정말로 이 하이라이트를 삭제하시겠습니까?')) {
        const highlightItem = document.querySelector(`[data-id="${id}"]`);
        highlightItem.remove();
        showNotification('하이라이트가 삭제되었습니다.', 'success');
    }
}

// 새 하이라이트 추가
function addHighlight() {
    document.getElementById('modalTitle').textContent = '새 하이라이트 추가';
    document.getElementById('editCategory').value = '';
    document.getElementById('editTitle').value = '';
    document.getElementById('editDescription').value = '';
    
    document.getElementById('editModal').style.display = 'flex';
    
    // 폼 제출 이벤트
    document.getElementById('editForm').onsubmit = (e) => {
        e.preventDefault();
        
        const category = document.getElementById('editCategory').value;
        const title = document.getElementById('editTitle').value;
        const description = document.getElementById('editDescription').value;
        
        if (!category || !title || !description) {
            showNotification('모든 필드를 입력해주세요.', 'error');
            return;
        }
        
        // 새 ID 생성
        const newId = Date.now();
        
        // 새 하이라이트 아이템 생성
        const newHighlight = document.createElement('div');
        newHighlight.className = 'highlight-item';
        newHighlight.setAttribute('data-id', newId);
        newHighlight.innerHTML = `
            <div class="highlight-preview">
                <span class="category">${category}</span>
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
            <div class="highlight-actions">
                <button class="edit-btn" onclick="editHighlight(${newId})">수정</button>
                <button class="delete-btn" onclick="deleteHighlight(${newId})">삭제</button>
            </div>
        `;
        
        // 추가 버튼 앞에 삽입
        const addBtn = document.querySelector('.add-highlight-btn');
        addBtn.parentNode.insertBefore(newHighlight, addBtn);
        
        closeModal();
        showNotification('새 하이라이트가 추가되었습니다.', 'success');
    };
}

// 서비스 수정
function editService(id) {
    showNotification('서비스 수정 기능은 개발 중입니다.', 'info');
}

// 뉴스 새로고침
function refreshNews() {
    showNotification('뉴스를 새로고침하고 있습니다...', 'info');
    loadAdminNews();
}

// 커스텀 뉴스 추가
function addCustomNews() {
    showNotification('커스텀 뉴스 추가 기능은 개발 중입니다.', 'info');
}

// Admin 뉴스 목록 로드
function loadAdminNews() {
    const newsList = document.getElementById('adminNewsList');
    if (!newsList) return;
    
    // 모의 뉴스 데이터
    const newsData = [
        {
            id: 1,
            title: "OpenAI, GPT-5 개발 완료... 2025년 상반기 출시 예정",
            source: "TechCrunch",
            date: "2025-08-15",
            status: "활성"
        },
        {
            id: 2,
            title: "구글, AI 칩 TPU v6 공개... 성능 3배 향상",
            source: "Google AI",
            date: "2025-08-14",
            status: "활성"
        },
        {
            id: 3,
            title: "메타, 라마 3.1 오픈소스 모델 출시",
            source: "Meta AI",
            date: "2025-08-13",
            status: "비활성"
        }
    ];
    
    newsList.innerHTML = newsData.map(news => `
        <div class="admin-news-item">
            <div class="news-info">
                <h4>${news.title}</h4>
                <p>출처: ${news.source} | 날짜: ${news.date}</p>
                <span class="status ${news.status === '활성' ? 'active' : 'inactive'}">${news.status}</span>
            </div>
            <div class="news-actions">
                <button class="edit-btn" onclick="editNews(${news.id})">수정</button>
                <button class="toggle-btn" onclick="toggleNews(${news.id})">${news.status === '활성' ? '비활성화' : '활성화'}</button>
                <button class="delete-btn" onclick="deleteNews(${news.id})">삭제</button>
            </div>
        </div>
    `).join('');
}

// 뉴스 수정
function editNews(id) {
    showNotification('뉴스 수정 기능은 개발 중입니다.', 'info');
}

// 뉴스 활성화/비활성화 토글
function toggleNews(id) {
    const newsItem = document.querySelector(`[data-id="${id}"]`);
    showNotification('뉴스 상태가 변경되었습니다.', 'success');
}

// 뉴스 삭제
function deleteNews(id) {
    if (confirm('정말로 이 뉴스를 삭제하시겠습니까?')) {
        showNotification('뉴스가 삭제되었습니다.', 'success');
        loadAdminNews(); // 목록 새로고침
    }
}

// 모달 닫기
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// 알림 표시
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 새 알림 생성
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 스타일 적용
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // 타입별 색상
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // DOM에 추가
    document.body.appendChild(notification);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// 모달 외부 클릭 시 닫기
document.addEventListener('click', (e) => {
    const modal = document.getElementById('editModal');
    if (e.target === modal) {
        closeModal();
    }
});

// 키보드 ESC로 모달 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);