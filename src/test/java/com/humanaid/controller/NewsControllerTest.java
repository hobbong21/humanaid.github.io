package com.humanaid.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.humanaid.entity.News;
import com.humanaid.service.NewsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NewsController.class)
@ActiveProfiles("test")
class NewsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NewsService newsService;

    @Autowired
    private ObjectMapper objectMapper;

    private News news;

    @BeforeEach
    void setUp() {
        news = new News(
            "테스트 뉴스 제목",
            "테스트 뉴스 요약입니다.",
            "테스트 뉴스 내용입니다.",
            "AI 뉴스",
            "Human.Ai.D"
        );
        news.setId(1L);
        news.setPublished(true);
        news.setPublishedAt(LocalDateTime.now());
        news.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void getLatestNews_Success() throws Exception {
        // Given
        List<News> newsList = Arrays.asList(news);
        when(newsService.getLatestNews(anyInt())).thenReturn(newsList);

        // When & Then
        mockMvc.perform(get("/news/latest?limit=6"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("최신 뉴스를 조회했습니다."))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].title").value("테스트 뉴스 제목"));
    }

    @Test
    void getNewsByCategory_Success() throws Exception {
        // Given
        List<News> newsList = Arrays.asList(news);
        when(newsService.getNewsByCategory("AI 뉴스")).thenReturn(newsList);

        // When & Then
        mockMvc.perform(get("/news/category/AI 뉴스"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("카테고리별 뉴스를 조회했습니다."))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].category").value("AI 뉴스"));
    }

    @Test
    void getNewsById_Success() throws Exception {
        // Given
        when(newsService.getNewsById(anyLong())).thenReturn(Optional.of(news));

        // When & Then
        mockMvc.perform(get("/news/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.title").value("테스트 뉴스 제목"));
    }

    @Test
    void getNewsById_NotFound() throws Exception {
        // Given
        when(newsService.getNewsById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/news/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("뉴스를 찾을 수 없습니다."));
    }

    @Test
    void getNewsById_UnpublishedNews() throws Exception {
        // Given
        news.setPublished(false);
        when(newsService.getNewsById(anyLong())).thenReturn(Optional.of(news));

        // When & Then
        mockMvc.perform(get("/news/1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("뉴스를 찾을 수 없습니다."));
    }

    @Test
    void searchNews_Success() throws Exception {
        // Given
        List<News> newsList = Arrays.asList(news);
        when(newsService.searchNews("테스트")).thenReturn(newsList);

        // When & Then
        mockMvc.perform(get("/news/search?keyword=테스트"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("검색 결과를 조회했습니다."))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].title").value("테스트 뉴스 제목"));
    }

    @Test
    void createNews_Success() throws Exception {
        // Given
        when(newsService.saveNews(any(News.class))).thenReturn(news);

        // When & Then
        mockMvc.perform(post("/news")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(news)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("뉴스가 성공적으로 등록되었습니다."))
                .andExpect(jsonPath("$.data.title").value("테스트 뉴스 제목"));
    }

    @Test
    void togglePublishStatus_Success() throws Exception {
        // Given
        news.setPublished(false);
        when(newsService.togglePublishStatus(anyLong())).thenReturn(news);

        // When & Then
        mockMvc.perform(put("/news/1/toggle-publish"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("뉴스 발행이 취소되었습니다."))
                .andExpect(jsonPath("$.data.published").value(false));
    }
}