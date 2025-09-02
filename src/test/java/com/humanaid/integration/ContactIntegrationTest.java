package com.humanaid.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.humanaid.dto.ContactRequest;
import com.humanaid.entity.Contact;
import com.humanaid.repository.ContactRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
class ContactIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;
    private ContactRequest contactRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        contactRequest = new ContactRequest(
            "통합테스트 사용자",
            "integration@humanaid.digital",
            "통합테스트 회사",
            "010-1111-2222",
            "general",
            "통합테스트 문의",
            "통합테스트 메시지입니다.",
            true,
            false
        );
    }

    @Test
    void createContact_IntegrationTest() throws Exception {
        // When
        mockMvc.perform(post("/contacts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contactRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("통합테스트 사용자"))
                .andExpect(jsonPath("$.data.email").value("integration@humanaid.digital"));

        // Then - 데이터베이스에 실제로 저장되었는지 확인
        Contact savedContact = contactRepository.findByEmailOrderByCreatedAtDesc("integration@humanaid.digital").get(0);
        assertNotNull(savedContact);
        assertEquals("통합테스트 사용자", savedContact.getName());
        assertEquals("integration@humanaid.digital", savedContact.getEmail());
        assertEquals("general", savedContact.getInquiryType());
        assertFalse(savedContact.getProcessed());
    }

    @Test
    void createContact_ValidationError_IntegrationTest() throws Exception {
        // Given - 잘못된 요청 (이메일 형식 오류)
        contactRequest.setEmail("invalid-email");

        // When & Then
        mockMvc.perform(post("/contacts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contactRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));

        // 데이터베이스에 저장되지 않았는지 확인
        assertTrue(contactRepository.findByEmailOrderByCreatedAtDesc("invalid-email").isEmpty());
    }

    @Test
    void getUnprocessedContacts_IntegrationTest() throws Exception {
        // Given - 테스트 데이터 저장
        Contact contact = new Contact(
            "테스트 사용자",
            "test@humanaid.digital",
            "테스트 회사",
            "010-1234-5678",
            "general",
            "테스트 문의",
            "테스트 메시지",
            true,
            false
        );
        contactRepository.save(contact);

        // When & Then
        mockMvc.perform(get("/contacts/unprocessed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].name").value("테스트 사용자"))
                .andExpect(jsonPath("$.data[0].processed").value(false));
    }
}