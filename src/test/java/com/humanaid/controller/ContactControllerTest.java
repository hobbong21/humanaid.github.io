package com.humanaid.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.humanaid.dto.ContactRequest;
import com.humanaid.entity.Contact;
import com.humanaid.service.ContactService;
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
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ContactController.class)
@ActiveProfiles("test")
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ContactService contactService;

    @Autowired
    private ObjectMapper objectMapper;

    private ContactRequest contactRequest;
    private Contact contact;

    @BeforeEach
    void setUp() {
        contactRequest = new ContactRequest(
            "테스트 사용자",
            "test@humanaid.digital",
            "테스트 회사",
            "010-1234-5678",
            "general",
            "테스트 문의",
            "테스트 메시지입니다.",
            true,
            false
        );

        contact = new Contact(
            "테스트 사용자",
            "test@humanaid.digital",
            "테스트 회사",
            "010-1234-5678",
            "general",
            "테스트 문의",
            "테스트 메시지입니다.",
            true,
            false
        );
        contact.setId(1L);
        contact.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void createContact_Success() throws Exception {
        // Given
        when(contactService.saveContact(any(ContactRequest.class))).thenReturn(contact);

        // When & Then
        mockMvc.perform(post("/contacts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contactRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("문의사항이 성공적으로 등록되었습니다."))
                .andExpect(jsonPath("$.data.name").value("테스트 사용자"))
                .andExpect(jsonPath("$.data.email").value("test@humanaid.digital"));
    }

    @Test
    void createContact_ValidationError() throws Exception {
        // Given - 잘못된 요청 (이름이 비어있음)
        contactRequest.setName("");

        // When & Then
        mockMvc.perform(post("/contacts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(contactRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void getUnprocessedContacts_Success() throws Exception {
        // Given
        List<Contact> contacts = Arrays.asList(contact);
        when(contactService.getUnprocessedContacts()).thenReturn(contacts);

        // When & Then
        mockMvc.perform(get("/contacts/unprocessed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].name").value("테스트 사용자"));
    }

    @Test
    void getContactById_Success() throws Exception {
        // Given
        when(contactService.getContactById(anyLong())).thenReturn(Optional.of(contact));

        // When & Then
        mockMvc.perform(get("/contacts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.name").value("테스트 사용자"));
    }

    @Test
    void getContactById_NotFound() throws Exception {
        // Given
        when(contactService.getContactById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/contacts/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("문의사항을 찾을 수 없습니다."));
    }

    @Test
    void markAsProcessed_Success() throws Exception {
        // Given
        contact.setProcessed(true);
        contact.setProcessedAt(LocalDateTime.now());
        when(contactService.markAsProcessed(anyLong())).thenReturn(contact);

        // When & Then
        mockMvc.perform(put("/contacts/1/process"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("문의사항이 처리 완료로 표시되었습니다."))
                .andExpect(jsonPath("$.data.processed").value(true));
    }
}