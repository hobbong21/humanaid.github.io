package com.humanaid.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "contacts")
public class Contact {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "이름은 필수입니다")
    @Size(max = 100, message = "이름은 100자를 초과할 수 없습니다")
    @Column(nullable = false, length = 100)
    private String name;
    
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    @Size(max = 255, message = "이메일은 255자를 초과할 수 없습니다")
    @Column(nullable = false, length = 255)
    private String email;
    
    @Size(max = 100, message = "회사명은 100자를 초과할 수 없습니다")
    @Column(length = 100)
    private String company;
    
    @Size(max = 20, message = "연락처는 20자를 초과할 수 없습니다")
    @Column(length = 20)
    private String phone;
    
    @NotBlank(message = "문의 유형은 필수입니다")
    @Column(name = "inquiry_type", nullable = false, length = 50)
    private String inquiryType;
    
    @NotBlank(message = "제목은 필수입니다")
    @Size(max = 200, message = "제목은 200자를 초과할 수 없습니다")
    @Column(nullable = false, length = 200)
    private String subject;
    
    @NotBlank(message = "메시지는 필수입니다")
    @Size(max = 2000, message = "메시지는 2000자를 초과할 수 없습니다")
    @Column(nullable = false, length = 2000)
    private String message;
    
    @Column(name = "privacy_agree", nullable = false)
    private Boolean privacyAgree = false;
    
    @Column(name = "marketing_agree")
    private Boolean marketingAgree = false;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "processed", nullable = false)
    private Boolean processed = false;
    
    @Column(name = "processed_at")
    private LocalDateTime processedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // 기본 생성자
    public Contact() {}
    
    // 생성자
    public Contact(String name, String email, String company, String phone, 
                  String inquiryType, String subject, String message, 
                  Boolean privacyAgree, Boolean marketingAgree) {
        this.name = name;
        this.email = email;
        this.company = company;
        this.phone = phone;
        this.inquiryType = inquiryType;
        this.subject = subject;
        this.message = message;
        this.privacyAgree = privacyAgree;
        this.marketingAgree = marketingAgree;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getInquiryType() { return inquiryType; }
    public void setInquiryType(String inquiryType) { this.inquiryType = inquiryType; }
    
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public Boolean getPrivacyAgree() { return privacyAgree; }
    public void setPrivacyAgree(Boolean privacyAgree) { this.privacyAgree = privacyAgree; }
    
    public Boolean getMarketingAgree() { return marketingAgree; }
    public void setMarketingAgree(Boolean marketingAgree) { this.marketingAgree = marketingAgree; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Boolean getProcessed() { return processed; }
    public void setProcessed(Boolean processed) { this.processed = processed; }
    
    public LocalDateTime getProcessedAt() { return processedAt; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }
}