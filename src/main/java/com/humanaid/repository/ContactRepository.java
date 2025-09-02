package com.humanaid.repository;

import com.humanaid.entity.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    
    // 처리되지 않은 문의 조회
    List<Contact> findByProcessedFalseOrderByCreatedAtDesc();
    
    // 처리된 문의 조회
    List<Contact> findByProcessedTrueOrderByProcessedAtDesc();
    
    // 문의 유형별 조회
    List<Contact> findByInquiryTypeOrderByCreatedAtDesc(String inquiryType);
    
    // 날짜 범위로 조회
    List<Contact> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startDate, LocalDateTime endDate);
    
    // 이메일로 조회
    List<Contact> findByEmailOrderByCreatedAtDesc(String email);
    
    // 키워드 검색 (이름, 이메일, 제목, 메시지에서 검색)
    @Query("SELECT c FROM Contact c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.subject) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.message) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Contact> findByKeyword(@Param("keyword") String keyword);
    
    // 페이징 처리된 전체 조회
    Page<Contact> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    // 처리 상태별 페이징 조회
    Page<Contact> findByProcessedOrderByCreatedAtDesc(Boolean processed, Pageable pageable);
    
    // 문의 유형별 개수 조회
    @Query("SELECT c.inquiryType, COUNT(c) FROM Contact c GROUP BY c.inquiryType")
    List<Object[]> countByInquiryType();
    
    // 월별 문의 개수 조회
    @Query("SELECT YEAR(c.createdAt), MONTH(c.createdAt), COUNT(c) FROM Contact c " +
           "WHERE c.createdAt >= :startDate GROUP BY YEAR(c.createdAt), MONTH(c.createdAt) " +
           "ORDER BY YEAR(c.createdAt), MONTH(c.createdAt)")
    List<Object[]> countByMonth(@Param("startDate") LocalDateTime startDate);
}