package com.humanaid.service;

import com.humanaid.entity.Contact;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    /**
     * 문의사항 접수 알림 이메일 발송 (관리자용)
     */
    @Async
    public void sendContactNotification(Contact contact) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo("contact@humanaid.digital"); // 관리자 이메일
            message.setSubject("[Human.Ai.D] 새로운 문의사항이 접수되었습니다");
            
            StringBuilder content = new StringBuilder();
            content.append("새로운 문의사항이 접수되었습니다.\n\n");
            content.append("=== 문의 정보 ===\n");
            content.append("문의 ID: ").append(contact.getId()).append("\n");
            content.append("이름: ").append(contact.getName()).append("\n");
            content.append("이메일: ").append(contact.getEmail()).append("\n");
            content.append("회사: ").append(contact.getCompany() != null ? contact.getCompany() : "미입력").append("\n");
            content.append("연락처: ").append(contact.getPhone() != null ? contact.getPhone() : "미입력").append("\n");
            content.append("문의 유형: ").append(contact.getInquiryType()).append("\n");
            content.append("제목: ").append(contact.getSubject()).append("\n");
            content.append("접수 시간: ").append(contact.getCreatedAt()).append("\n\n");
            content.append("=== 문의 내용 ===\n");
            content.append(contact.getMessage()).append("\n\n");
            content.append("=== 동의 사항 ===\n");
            content.append("개인정보처리방침 동의: ").append(contact.getPrivacyAgree() ? "동의" : "미동의").append("\n");
            content.append("마케팅 정보 수신 동의: ").append(contact.getMarketingAgree() ? "동의" : "미동의").append("\n\n");
            content.append("관리자 페이지에서 확인하세요: http://localhost:8080/admin");
            
            message.setText(content.toString());
            mailSender.send(message);
            
        } catch (Exception e) {
            System.err.println("관리자 알림 이메일 발송 실패: " + e.getMessage());
            throw e;
        }
    }
    
    /**
     * 문의자에게 접수 확인 이메일 발송
     */
    @Async
    public void sendContactConfirmation(Contact contact) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(contact.getEmail());
            message.setSubject("[Human.Ai.D] 문의사항이 정상적으로 접수되었습니다");
            
            StringBuilder content = new StringBuilder();
            content.append("안녕하세요, ").append(contact.getName()).append("님\n\n");
            content.append("Human.Ai.D에 문의해 주셔서 감사합니다.\n");
            content.append("고객님의 소중한 문의사항이 정상적으로 접수되었습니다.\n\n");
            content.append("=== 접수된 문의 정보 ===\n");
            content.append("문의 번호: ").append(contact.getId()).append("\n");
            content.append("문의 유형: ").append(contact.getInquiryType()).append("\n");
            content.append("제목: ").append(contact.getSubject()).append("\n");
            content.append("접수 일시: ").append(contact.getCreatedAt()).append("\n\n");
            content.append("담당자가 검토 후 빠른 시일 내에 답변드리겠습니다.\n");
            content.append("추가 문의사항이 있으시면 언제든지 연락해 주세요.\n\n");
            content.append("감사합니다.\n\n");
            content.append("Human.Ai.D 팀\n");
            content.append("이메일: contact@humanaid.digital\n");
            content.append("전화: 02-1234-5678\n");
            content.append("웹사이트: https://humanaid.digital");
            
            message.setText(content.toString());
            mailSender.send(message);
            
        } catch (Exception e) {
            System.err.println("고객 확인 이메일 발송 실패: " + e.getMessage());
            // 고객 확인 이메일 실패는 로그만 남기고 예외를 던지지 않음
        }
    }
    
    /**
     * 일반 이메일 발송
     */
    @Async
    public void sendEmail(String to, String subject, String content) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);
            mailSender.send(message);
            
        } catch (Exception e) {
            System.err.println("이메일 발송 실패: " + e.getMessage());
            throw e;
        }
    }
}