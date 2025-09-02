package com.humanaid.controller;

import com.humanaid.dto.ApiResponse;
import com.humanaid.dto.ContactRequest;
import com.humanaid.entity.Contact;
import com.humanaid.service.ContactService;
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
@RequestMapping("/contacts")
@CrossOrigin(origins = {"http://localhost:3000", "https://humanaid.digital"})
public class ContactController {
    
    @Autowired
    private ContactService contactService;
    
    /**
     * 문의사항 등록
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Contact>> createContact(@Valid @RequestBody ContactRequest request) {
        try {
            Contact savedContact = contactService.saveContact(request);
            return ResponseEntity.ok(
                ApiResponse.success("문의사항이 성공적으로 등록되었습니다.", savedContact)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("문의사항 등록 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 모든 문의사항 조회 (페이징) - 관리자용
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Contact>>> getAllContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Contact> contacts = contactService.getAllContacts(pageable);
            return ResponseEntity.ok(
                ApiResponse.success("문의사항 목록을 조회했습니다.", contacts)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("문의사항 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 처리되지 않은 문의사항 조회 - 관리자용
     */
    @GetMapping("/unprocessed")
    public ResponseEntity<ApiResponse<List<Contact>>> getUnprocessedContacts() {
        try {
            List<Contact> contacts = contactService.getUnprocessedContacts();
            return ResponseEntity.ok(
                ApiResponse.success("처리되지 않은 문의사항을 조회했습니다.", contacts)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("문의사항 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 문의사항 상세 조회 - 관리자용
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Contact>> getContactById(@PathVariable Long id) {
        try {
            Optional<Contact> contact = contactService.getContactById(id);
            if (contact.isPresent()) {
                return ResponseEntity.ok(
                    ApiResponse.success("문의사항을 조회했습니다.", contact.get())
                );
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("문의사항을 찾을 수 없습니다."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("문의사항 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 문의사항 처리 완료 표시 - 관리자용
     */
    @PutMapping("/{id}/process")
    public ResponseEntity<ApiResponse<Contact>> markAsProcessed(@PathVariable Long id) {
        try {
            Contact processedContact = contactService.markAsProcessed(id);
            return ResponseEntity.ok(
                ApiResponse.success("문의사항이 처리 완료로 표시되었습니다.", processedContact)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("문의사항 처리 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 문의 유형별 조회 - 관리자용
     */
    @GetMapping("/by-type/{inquiryType}")
    public ResponseEntity<ApiResponse<List<Contact>>> getContactsByInquiryType(@PathVariable String inquiryType) {
        try {
            List<Contact> contacts = contactService.getContactsByInquiryType(inquiryType);
            return ResponseEntity.ok(
                ApiResponse.success("문의 유형별 목록을 조회했습니다.", contacts)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("문의사항 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 키워드 검색 - 관리자용
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Contact>>> searchContacts(@RequestParam String keyword) {
        try {
            List<Contact> contacts = contactService.searchContacts(keyword);
            return ResponseEntity.ok(
                ApiResponse.success("검색 결과를 조회했습니다.", contacts)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("검색 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 문의 유형별 통계 - 관리자용
     */
    @GetMapping("/stats/by-type")
    public ResponseEntity<ApiResponse<List<Object[]>>> getContactStatsByInquiryType() {
        try {
            List<Object[]> stats = contactService.getContactStatsByInquiryType();
            return ResponseEntity.ok(
                ApiResponse.success("문의 유형별 통계를 조회했습니다.", stats)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("통계 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 월별 문의 통계 - 관리자용
     */
    @GetMapping("/stats/by-month")
    public ResponseEntity<ApiResponse<List<Object[]>>> getContactStatsByMonth(
            @RequestParam(required = false) String startDate) {
        try {
            LocalDateTime start = startDate != null ? 
                LocalDateTime.parse(startDate) : 
                LocalDateTime.now().minusMonths(12);
            
            List<Object[]> stats = contactService.getContactStatsByMonth(start);
            return ResponseEntity.ok(
                ApiResponse.success("월별 문의 통계를 조회했습니다.", stats)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("통계 조회 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
    
    /**
     * 문의사항 삭제 - 관리자용
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteContact(@PathVariable Long id) {
        try {
            contactService.deleteContact(id);
            return ResponseEntity.ok(
                ApiResponse.success("문의사항이 삭제되었습니다.")
            );
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("문의사항 삭제 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}