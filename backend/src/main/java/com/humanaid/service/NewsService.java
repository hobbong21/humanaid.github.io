package com.humanaid.service;

import com.humanaid.entity.News;
import com.humanaid.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NewsService {
    
    @Autowired
    private NewsRepository newsRepository;
    
    /**
     * 뉴스 저장
     */
    public News saveNews(News news) {
        return newsRepository.save(news);
    }
    
    /**
     * 발행된 뉴스 전체 조회 (최신순)
     */
    @Transactional(readOnly = true)
    public List<News> getPublishedNews() {
        return newsRepository.findByPublishedTrueOrderByPublishedAtDesc();
    }
    
    /**
     * 발행된 뉴스 페이징 조회
     */
    @Transactional(readOnly = true)
    public Page<News> getPublishedNews(Pageable pageable) {
        return newsRepository.findByPublishedTrueOrderByPublishedAtDesc(pageable);
    }
    
    /**
     * 최신 뉴스 N개 조회 (메인페이지용)
     */
    @Transactional(readOnly = true)
    public List<News> getLatestNews(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return newsRepository.findLatestNews(pageable);
    }
    
    /**
     * 카테고리별 뉴스 조회
     */
    @Transactional(readOnly = true)
    public List<News> getNewsByCategory(String category) {
        return newsRepository.findByPublishedTrueAndCategoryOrderByPublishedAtDesc(category);
    }
    
    /**
     * 뉴스 상세 조회
     */
    @Transactional(readOnly = true)
    public Optional<News> getNewsById(Long id) {
        return newsRepository.findById(id);
    }
    
    /**
     * 키워드 검색
     */
    @Transactional(readOnly = true)
    public List<News> searchNews(String keyword) {
        return newsRepository.findByKeyword(keyword);
    }
    
    /**
     * 날짜 범위로 조회
     */
    @Transactional(readOnly = true)
    public List<News> getNewsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return newsRepository.findByPublishedTrueAndPublishedAtBetweenOrderByPublishedAtDesc(startDate, endDate);
    }
    
    /**
     * 관리자용: 모든 뉴스 조회 (발행 여부 무관)
     */
    @Transactional(readOnly = true)
    public Page<News> getAllNews(Pageable pageable) {
        return newsRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
    
    /**
     * 뉴스 발행/발행취소
     */
    public News togglePublishStatus(Long id) {
        Optional<News> newsOpt = newsRepository.findById(id);
        if (newsOpt.isPresent()) {
            News news = newsOpt.get();
            news.setPublished(!news.getPublished());
            if (news.getPublished() && news.getPublishedAt() == null) {
                news.setPublishedAt(LocalDateTime.now());
            }
            return newsRepository.save(news);
        }
        throw new RuntimeException("뉴스를 찾을 수 없습니다. ID: " + id);
    }
    
    /**
     * 뉴스 수정
     */
    public News updateNews(Long id, News updatedNews) {
        Optional<News> newsOpt = newsRepository.findById(id);
        if (newsOpt.isPresent()) {
            News news = newsOpt.get();
            news.setTitle(updatedNews.getTitle());
            news.setSummary(updatedNews.getSummary());
            news.setContent(updatedNews.getContent());
            news.setImageUrl(updatedNews.getImageUrl());
            news.setCategory(updatedNews.getCategory());
            news.setSource(updatedNews.getSource());
            news.setExternalUrl(updatedNews.getExternalUrl());
            return newsRepository.save(news);
        }
        throw new RuntimeException("뉴스를 찾을 수 없습니다. ID: " + id);
    }
    
    /**
     * 뉴스 삭제
     */
    public void deleteNews(Long id) {
        if (newsRepository.existsById(id)) {
            newsRepository.deleteById(id);
        } else {
            throw new RuntimeException("뉴스를 찾을 수 없습니다. ID: " + id);
        }
    }
    
    /**
     * 카테고리별 통계
     */
    @Transactional(readOnly = true)
    public List<Object[]> getNewsStatsByCategory() {
        return newsRepository.countByCategory();
    }
    
    /**
     * 월별 발행 뉴스 통계
     */
    @Transactional(readOnly = true)
    public List<Object[]> getNewsStatsByMonth(LocalDateTime startDate) {
        return newsRepository.countByMonth(startDate);
    }
}