package com.humanaid.controller;

import com.humanaid.dto.ApiResponse;
import com.humanaid.entity.News;
import com.humanaid.service.NewsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/news")
@CrossOrigin(origins = {"http://localhost:3000", "https://humanaid.digital"})
public class NewsController {
    
    @Autowired
    private NewsService newsService;
    
    /**
     * 발행된 뉴스 목록 조회 (공개 API)
     */
    @GetMapping("/published")
    public ResponseEntity<ApiResponse<Page<News>>> getPublishedNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<News> news = newsService.getPublishedNews(pageable);
            return ResponseEntity.ok(
                ApiResponse.success("발행된 뉴스 목록을 조회했습니다.", news)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("뉴스 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 최신 뉴스 조회 (메인페이지용)
     */
    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<List<News>>> getLatestNews(
            @RequestParam(defaultValue = "6") int limit) {
        try {
            List<News> news = newsService.getLatestNews(limit);
            return ResponseEntity.ok(
                ApiResponse.success("최신 뉴스를 조회했습니다.", news)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("뉴스 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 카테고리별 뉴스 조회 (공개 API)
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<News>>> getNewsByCategory(@PathVariable String category) {
        try {
            List<News> news = newsService.getNewsByCategory(category);
            return ResponseEntity.ok(
                ApiResponse.success("카테고리별 뉴스를 조회했습니다.", news)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("뉴스 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 뉴스 상세 조회 (공개 API)
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<News>> getNewsById(@PathVariable Long id) {
        try {
            Optional<News> news = newsService.getNewsById(id);
            if (news.isPresent() && news.get().getPublished()) {
                return ResponseEntity.ok(
                    ApiResponse.success("뉴스를 조회했습니다.", news.get())
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("뉴스를 찾을 수 없습니다."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("뉴스 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 뉴스 검색 (공개 API)
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<News>>> searchNews(@RequestParam String keyword) {
        try {
            List<News> news = newsService.searchNews(keyword);
            return ResponseEntity.ok(
                ApiResponse.success("검색 결과를 조회했습니다.", news)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("검색 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    // === 관리자용 API ===
    
    /**
     * 뉴스 등록 - 관리자용
     */
    @PostMapping
    public ResponseEntity<ApiResponse<News>> createNews(@Valid @RequestBody News news) {
        try {
            News savedNews = newsService.saveNews(news);
            return ResponseEntity.ok(
                ApiResponse.success("뉴스가 성공적으로 등록되었습니다.", savedNews)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("뉴스 등록 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 모든 뉴스 조회 (발행 여부 무관) - 관리자용
     */
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<Page<News>>> getAllNews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<News> news = newsService.getAllNews(pageable);
            return ResponseEntity.ok(
                ApiResponse.success("모든 뉴스 목록을 조회했습니다.", news)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("뉴스 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 뉴스 수정 - 관리자용
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<News>> updateNews(@PathVariable Long id, @Valid @RequestBody News news) {
        try {
            News updatedNews = newsService.updateNews(id, news);
            return ResponseEntity.ok(
                ApiResponse.success("뉴스가 성공적으로 수정되었습니다.", updatedNews)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("뉴스 수정 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 뉴스 발행/발행취소 - 관리자용
     */
    @PutMapping("/{id}/toggle-publish")
    public ResponseEntity<ApiResponse<News>> togglePublishStatus(@PathVariable Long id) {
        try {
            News news = newsService.togglePublishStatus(id);
            String message = news.getPublished() ? "뉴스가 발행되었습니다." : "뉴스 발행이 취소되었습니다.";
            return ResponseEntity.ok(
                ApiResponse.success(message, news)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("뉴스 발행 상태 변경 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 뉴스 삭제 - 관리자용
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNews(@PathVariable Long id) {
        try {
            newsService.deleteNews(id);
            return ResponseEntity.ok(
                ApiResponse.success("뉴스가 삭제되었습니다.")
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("뉴스 삭제 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 카테고리별 통계 - 관리자용
     */
    @GetMapping("/admin/stats/by-category")
    public ResponseEntity<ApiResponse<List<Object[]>>> getNewsStatsByCategory() {
        try {
            List<Object[]> stats = newsService.getNewsStatsByCategory();
            return ResponseEntity.ok(
                ApiResponse.success("카테고리별 통계를 조회했습니다.", stats)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("통계 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 월별 발행 뉴스 통계 - 관리자용
     */
    @GetMapping("/admin/stats/by-month")
    public ResponseEntity<ApiResponse<List<Object[]>>> getNewsStatsByMonth(
            @RequestParam(required = false) String startDate) {
        try {
            LocalDateTime start = startDate != null ? 
                LocalDateTime.parse(startDate) : 
                LocalDateTime.now().minusMonths(12);
            
            List<Object[]> stats = newsService.getNewsStatsByMonth(start);
            return ResponseEntity.ok(
                ApiResponse.success("월별 뉴스 통계를 조회했습니다.", stats)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("통계 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}