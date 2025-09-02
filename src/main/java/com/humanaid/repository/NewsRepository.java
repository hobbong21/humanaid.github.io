package com.humanaid.repository;

import com.humanaid.entity.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    
    // 발행된 뉴스만 조회 (최신순)
    List<News> findByPublishedTrueOrderByPublishedAtDesc();
    
    // 발행된 뉴스 페이징 조회
    Page<News> findByPublishedTrueOrderByPublishedAtDesc(Pageable pageable);
    
    // 카테고리별 발행된 뉴스 조회
    List<News> findByPublishedTrueAndCategoryOrderByPublishedAtDesc(String category);
    
    // 최신 뉴스 N개 조회 (메인페이지용)
    @Query("SELECT n FROM News n WHERE n.published = true ORDER BY n.publishedAt DESC")
    List<News> findLatestNews(Pageable pageable);
    
    // 키워드 검색 (제목, 요약, 내용에서 검색)
    @Query("SELECT n FROM News n WHERE n.published = true AND " +
           "(LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.summary) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<News> findByKeyword(@Param("keyword") String keyword);
    
    // 날짜 범위로 조회
    List<News> findByPublishedTrueAndPublishedAtBetweenOrderByPublishedAtDesc(
        LocalDateTime startDate, LocalDateTime endDate);
    
    // 관리자용: 모든 뉴스 조회 (발행 여부 무관)
    Page<News> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // 카테고리별 개수 조회
    @Query("SELECT n.category, COUNT(n) FROM News n WHERE n.published = true GROUP BY n.category")
    List<Object[]> countByCategory();
    
    // 월별 발행 뉴스 개수 조회
    @Query("SELECT YEAR(n.publishedAt), MONTH(n.publishedAt), COUNT(n) FROM News n " +
           "WHERE n.published = true AND n.publishedAt >= :startDate " +
           "GROUP BY YEAR(n.publishedAt), MONTH(n.publishedAt) " +
           "ORDER BY YEAR(n.publishedAt), MONTH(n.publishedAt)")
    List<Object[]> countByMonth(@Param("startDate") LocalDateTime startDate);
}