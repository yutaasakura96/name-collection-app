package com.example.namecollection.service;

import com.example.namecollection.model.User;
import com.example.namecollection.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @Mock
    private Jwt jwt;

    @InjectMocks
    private UserService userService;

    private final String AUTH0_ID = "auth0|test-user";
    private final String EMAIL = "test@example.com";
    private final String NAME = "Test User";

    @BeforeEach
    void setUp() {
        // Use lenient() to allow unused stubbings
        lenient().when(jwt.getSubject()).thenReturn(AUTH0_ID);
        lenient().when(jwt.getClaim(eq("email"))).thenReturn(EMAIL);
        lenient().when(jwt.getClaim(eq("name"))).thenReturn(NAME);
        when(authentication.getPrincipal()).thenReturn(jwt);
    }

    @Test
    void getOrCreateUser_WhenUserExists_ShouldUpdateLastLogin() {
        // Arrange
        User existingUser = new User();
        existingUser.setAuth0Id(AUTH0_ID);
        existingUser.setEmail(EMAIL);
        existingUser.setName(NAME);
        existingUser.setLastLogin(LocalDateTime.now().minusDays(1));

        when(userRepository.findById(AUTH0_ID)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        User result = userService.getOrCreateUser(authentication);

        // Assert
        assertNotNull(result);
        assertEquals(AUTH0_ID, result.getAuth0Id());
        assertEquals(EMAIL, result.getEmail());
        assertEquals(NAME, result.getName());
        assertNotNull(result.getLastLogin());
        verify(userRepository, times(1)).findById(AUTH0_ID);
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void getOrCreateUser_WhenUserDoesNotExist_ShouldCreateNewUser() {
        // Arrange
        when(userRepository.findById(AUTH0_ID)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            return savedUser;
        });

        // Act
        User result = userService.getOrCreateUser(authentication);

        // Assert
        assertNotNull(result);
        assertEquals(AUTH0_ID, result.getAuth0Id());
        assertEquals(EMAIL, result.getEmail());
        assertEquals(NAME, result.getName());
        assertNotNull(result.getLastLogin());
        verify(userRepository, times(1)).findById(AUTH0_ID);
        verify(userRepository, times(1)).save(any(User.class));
    }
}
