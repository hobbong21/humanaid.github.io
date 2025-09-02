package com.humanaid.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "news")
public class News {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "제목은 필수입니다")
    @Size(max = 200, message = "제목은 200자를 초과할 수 없습니다")
    @Column(nullable = false, length = 200)
    private String title;
    
    @NotBlank(message = "요약은 필수입니다")
    @Size(max = 500, message = "요약은 500자를 초과할 수 없습니다")
    @Column(nullable = false, length = 500)
    private String summary;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    
    @NotBlank(message = "카테고리는 필수입니다")
    @Column(nullable = false, length = 50)
    private String category;
    
    @Column(length = 100)
    private String source;
    
    @Column(name = "external_url", length = 500)
    private String externalUrl;
    
    @Column(nullable = false)
    private Boolean published = false;
    
    @Column(name = "published_at")
    private LocalDateTime publishedAt;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (published && publishedAt == null) {
            publishedAt = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (published && publishedAt == null) {
            publishedAt = LocalDateTime.now();
        }
    }
    
    // 기본 생성자
    public News() {}
    
    // 생성자
    public News(String title, String summary, String content, String category, String source) {
        this.title = title;
        this.summary = summary;
        this.content = content;
        this.category = category;
        this.source = source;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    
    public String getExternalUrl() { return externalUrl; }
    public void setExternalUrl(String externalUrl) { this.externalUrl = externalUrl; }
    
    public Boolean getPublished() { return published; }
    public void setPublished(Boolean published) { this.published = published; }
    
    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}