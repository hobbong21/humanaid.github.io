package com.humanaid.service;

import com.humanaid.dto.ContactRequest;
import com.humanaid.entity.Contact;
import com.humanaid.repository.ContactRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class ContactServiceTest {

    @Mock
    private ContactRepository contactRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private ContactService contactService;

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
    void saveContact_Success() {
        // Given
        when(contactRepository.save(any(Contact.class))).thenReturn(contact);
        doNothing().when(emailService).sendContactNotification(any(Contact.class));

        // When
        Contact savedContact = contactService.saveContact(contactRequest);

        // Then
        assertNotNull(savedContact);
        assertEquals("테스트 사용자", savedContact.getName());
        assertEquals("test@humanaid.digital", savedContact.getEmail());
        assertEquals("general", savedContact.getInquiryType());
        
        verify(contactRepository, times(1)).save(any(Contact.class));
        verify(emailService, times(1)).sendContactNotification(any(Contact.class));
    }

    @Test
    void getUnprocessedContacts_Success() {
        // Given
        List<Contact> contacts = Arrays.asList(contact);
        when(contactRepository.findByProcessedFalseOrderByCreatedAtDesc()).thenReturn(contacts);

        // When
        List<Contact> result = contactService.getUnprocessedContacts();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("테스트 사용자", result.get(0).getName());
        
        verify(contactRepository, times(1)).findByProcessedFalseOrderByCreatedAtDesc();
    }

    @Test
    void getContactById_Success() {
        // Given
        when(contactRepository.findById(anyLong())).thenReturn(Optional.of(contact));

        // When
        Optional<Contact> result = contactService.getContactById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals("테스트 사용자", result.get().getName());
        
        verify(contactRepository, times(1)).findById(1L);
    }

    @Test
    void getContactById_NotFound() {
        // Given
        when(contactRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When
        Optional<Contact> result = contactService.getContactById(999L);

        // Then
        assertFalse(result.isPresent());
        
        verify(contactRepository, times(1)).findById(999L);
    }

    @Test
    void markAsProcessed_Success() {
        // Given
        when(contactRepository.findById(anyLong())).thenReturn(Optional.of(contact));
        when(contactRepository.save(any(Contact.class))).thenReturn(contact);

        // When
        Contact result = contactService.markAsProcessed(1L);

        // Then
        assertNotNull(result);
        assertTrue(result.getProcessed());
        assertNotNull(result.getProcessedAt());
        
        verify(contactRepository, times(1)).findById(1L);
        verify(contactRepository, times(1)).save(any(Contact.class));
    }

    @Test
    void markAsProcessed_NotFound() {
        // Given
        when(contactRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            contactService.markAsProcessed(999L);
        });
        
        assertEquals("문의사항을 찾을 수 없습니다. ID: 999", exception.getMessage());
        
        verify(contactRepository, times(1)).findById(999L);
        verify(contactRepository, never()).save(any(Contact.class));
    }

    @Test
    void searchContacts_Success() {
        // Given
        List<Contact> contacts = Arrays.asList(contact);
        when(contactRepository.findByKeyword(anyString())).thenReturn(contacts);

        // When
        List<Contact> result = contactService.searchContacts("테스트");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("테스트 사용자", result.get(0).getName());
        
        verify(contactRepository, times(1)).findByKeyword("테스트");
    }

    @Test
    void deleteContact_Success() {
        // Given
        when(contactRepository.existsById(anyLong())).thenReturn(true);
        doNothing().when(contactRepository).deleteById(anyLong());

        // When
        contactService.deleteContact(1L);

        // Then
        verify(contactRepository, times(1)).existsById(1L);
        verify(contactRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteContact_NotFound() {
        // Given
        when(contactRepository.existsById(anyLong())).thenReturn(false);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            contactService.deleteContact(999L);
        });
        
        assertEquals("문의사항을 찾을 수 없습니다. ID: 999", exception.getMessage());
        
        verify(contactRepository, times(1)).existsById(999L);
        verify(contactRepository, never()).deleteById(anyLong());
    }
}