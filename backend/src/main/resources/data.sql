-- 샘플 뉴스 데이터 삽입
INSERT INTO news (title, summary, content, category, source, published, published_at, created_at) VALUES
('Human.Ai.D, 차세대 AI 의료 진단 시스템 개발 완료', 
 '딥러닝 기반의 의료 영상 분석 기술로 조기 진단 정확도를 95% 이상 향상시킨 혁신적인 시스템을 개발했습니다.',
 'Human.Ai.D가 개발한 차세대 AI 의료 진단 시스템이 임상 시험에서 뛰어난 성과를 보였습니다. 이 시스템은 딥러닝 기반의 의료 영상 분석 기술을 활용하여 기존 진단 방식 대비 95% 이상의 정확도를 달성했습니다.',
 '의료 AI', 'Human.Ai.D', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('시리즈 A 라운드 100억원 투자 유치 성공',
 '글로벌 벤처캐피털들로부터 AI 기술력을 인정받아 대규모 투자를 성공적으로 유치했습니다.',
 'Human.Ai.D가 시리즈 A 라운드에서 100억원 규모의 투자를 유치하는데 성공했습니다. 이번 투자는 글로벌 AI 시장 진출과 기술 개발 가속화에 사용될 예정입니다.',
 '투자', 'Human.Ai.D', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('글로벌 테크 기업과 전략적 제휴 체결',
 '세계 최대 클라우드 서비스 제공업체와 AI 솔루션 공동 개발 협약을 체결했습니다.',
 'Human.Ai.D가 세계적인 클라우드 서비스 제공업체와 전략적 제휴를 통해 AI 솔루션의 글로벌 확산을 추진합니다. 이번 제휴를 통해 더 많은 기업들이 AI 기술의 혜택을 누릴 수 있게 될 것입니다.',
 '파트너십', 'Human.Ai.D', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('AI 교육 플랫폼 베타 서비스 시작',
 '개인 맞춤형 AI 학습 플랫폼 베타 서비스를 시작하여 혁신적인 교육 경험을 제공합니다.',
 '학습자의 패턴을 분석하여 최적화된 학습 경로를 제공하는 AI 교육 플랫폼의 베타 서비스가 시작되었습니다. 이 플랫폼은 개인별 학습 스타일에 맞춘 맞춤형 교육을 제공합니다.',
 '교육', 'Human.Ai.D', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 샘플 문의사항 데이터 삽입 (테스트용)
INSERT INTO contacts (name, email, company, phone, inquiry_type, subject, message, privacy_agree, marketing_agree, created_at, processed) VALUES
('김테스트', 'test@example.com', '테스트회사', '010-1234-5678', 'general', 'AI 솔루션 문의', 'AI 솔루션에 대해 자세히 알고 싶습니다.', true, false, CURRENT_TIMESTAMP, false),
('이샘플', 'sample@example.com', '샘플기업', '010-9876-5432', 'partnership', '파트너십 제안', '파트너십 관련하여 논의하고 싶습니다.', true, true, CURRENT_TIMESTAMP, false);