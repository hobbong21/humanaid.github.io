package com.humanaid.service;

import com.humanaid.dto.ContactRequest;
import com.humanaid.entity.Contact;
import com.humanaid.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ContactService {
    
    @Autowired
    private ContactRepository contactRepository;
    
    @Autowired
    private EmailService emailService;
    
    /**
     * 문의사항 저장
     */
    public Contact saveContact(ContactRequest request) {
        // DTO를 Entity로 변환
        Contact contact = new Contact(
            request.getName(),
            request.getEmail(),
            request.getCompany(),
            request.getPhone(),
            request.getInquiryType(),
            request.getSubject(),
            request.getMessage(),
            request.getPrivacyAgree(),
            request.getMarketingAgree()
        );
        
        // 데이터베이스에 저장
        Contact savedContact = contactRepository.save(contact);
        
        // 이메일 알림 발송 (비동기)
        try {
            emailService.sendContactNotification(savedContact);
        } catch (Exception e) {
            // 이메일 발송 실패해도 문의사항 저장은 성공으로 처리
            System.err.println("이메일 발송 실패: " + e.getMessage());
        }
        
        return savedContact;
    }
    
    /**
     * 모든 문의사항 조회 (페이징)
     */
    @Transactional(readOnly = true)
    public Page<Contact> getAllContacts(Pageable pageable) {
        return contactRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
    
    /**
     * 처리되지 않은 문의사항 조회
     */
    @Transactional(readOnly = true)
    public List<Contact> getUnprocessedContacts() {
        return contactRepository.findByProcessedFalseOrderByCreatedAtDesc();
    }
    
    /**
     * 처리된 문의사항 조회
     */
    @Transactional(readOnly = true)
    public List<Contact> getProcessedContacts() {
        return contactRepository.findByProcessedTrueOrderByProcessedAtDesc();
    }
    
    /**
     * 문의사항 상세 조회
     */
    @Transactional(readOnly = true)
    public Optional<Contact> getContactById(Long id) {
        return contactRepository.findById(id);
    }
    
    /**
     * 문의사항 처리 완료 표시
     */
    public Contact markAsProcessed(Long id) {
        Optional<Contact> contactOpt = contactRepository.findById(id);
        if (contactOpt.isPresent()) {
            Contact contact = contactOpt.get();
            contact.setProcessed(true);
            contact.setProcessedAt(LocalDateTime.now());
            return contactRepository.save(contact);
        }
        throw new RuntimeException("문의사항을 찾을 수 없습니다. ID: " + id);
    }
    
    /**
     * 문의 유형별 조회
     */
    @Transactional(readOnly = true)
    public List<Contact> getContactsByInquiryType(String inquiryType) {
        return contactRepository.findByInquiryTypeOrderByCreatedAtDesc(inquiryType);
    }
    
    /**
     * 키워드 검색
     */
    @Transactional(readOnly = true)
    public List<Contact> searchContacts(String keyword) {
        return contactRepository.findByKeyword(keyword);
    }
    
    /**
     * 날짜 범위로 조회
     */
    @Transactional(readOnly = true)
    public List<Contact> getContactsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return contactRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(startDate, endDate);
    }
    
    /**
     * 문의 유형별 통계
     */
    @Transactional(readOnly = true)
    public List<Object[]> getContactStatsByInquiryType() {
        return contactRepository.countByInquiryType();
    }
    
    /**
     * 월별 문의 통계
     */
    @Transactional(readOnly = true)
    public List<Object[]> getContactStatsByMonth(LocalDateTime startDate) {
        return contactRepository.countByMonth(startDate);
    }
    
    /**
     * 문의사항 삭제
     */
    public void deleteContact(Long id) {
        if (contactRepository.existsById(id)) {
            contactRepository.deleteById(id);
        } else {
            throw new RuntimeException("문의사항을 찾을 수 없습니다. ID: " + id);
        }
    }
}