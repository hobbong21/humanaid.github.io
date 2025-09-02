package com.humanaid.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ContactRequest {
    
    @NotBlank(message = "이름은 필수입니다")
    @Size(max = 100, message = "이름은 100자를 초과할 수 없습니다")
    private String name;
    
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    @Size(max = 255, message = "이메일은 255자를 초과할 수 없습니다")
    private String email;
    
    @Size(max = 100, message = "회사명은 100자를 초과할 수 없습니다")
    private String company;
    
    @Size(max = 20, message = "연락처는 20자를 초과할 수 없습니다")
    private String phone;
    
    @NotBlank(message = "문의 유형은 필수입니다")
    private String inquiryType;
    
    @NotBlank(message = "제목은 필수입니다")
    @Size(max = 200, message = "제목은 200자를 초과할 수 없습니다")
    private String subject;
    
    @NotBlank(message = "메시지는 필수입니다")
    @Size(max = 2000, message = "메시지는 2000자를 초과할 수 없습니다")
    private String message;
    
    @NotNull(message = "개인정보처리방침 동의는 필수입니다")
    private Boolean privacyAgree;
    
    private Boolean marketingAgree = false;
    
    // 기본 생성자
    public ContactRequest() {}
    
    // 생성자
    public ContactRequest(String name, String email, String company, String phone,
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
}