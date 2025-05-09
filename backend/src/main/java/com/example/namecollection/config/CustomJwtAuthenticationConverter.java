package com.example.namecollection.config;

import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.stream.Collectors;

import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

/**
 * Custom JWT converter that extracts roles and permissions from Auth0 tokens
 */
public class CustomJwtAuthenticationConverter
        implements Converter<Jwt, AbstractAuthenticationToken> {

    private final JwtGrantedAuthoritiesConverter defaultAuthoritiesConverter =
            new JwtGrantedAuthoritiesConverter();

    @Override
    public AbstractAuthenticationToken convert(@NonNull Jwt jwt) {
        // Extract permissions from the permissions claim
        Collection<GrantedAuthority> authorities = extractPermissions(jwt);

        // Extract roles from Auth0 roles claim and add as authorities
        authorities.addAll(extractRoles(jwt));

        // Extract default authorities (scopes) and combine with our custom authorities
        authorities.addAll(defaultAuthoritiesConverter.convert(jwt));

        return new JwtAuthenticationToken(jwt, authorities, getPrincipalClaimName(jwt));
    }

    /**
     * Extract permissions from the JWT token
     */
    private Collection<GrantedAuthority> extractPermissions(Jwt jwt) {
        Collection<GrantedAuthority> authorities = new HashSet<>();

        // Auth0 places permissions in the 'permissions' claim for custom APIs
        if (jwt.getClaims().containsKey("permissions")) {
            Object permissionObj = jwt.getClaim("permissions");

            if (permissionObj instanceof String[] strings) {
                authorities.addAll(Arrays.stream(strings)
                        .map(permission -> new SimpleGrantedAuthority("SCOPE_" + permission))
                        .collect(Collectors.toList()));
            } else if (permissionObj instanceof Collection) {
                @SuppressWarnings("unchecked")
                Collection<String> permissions = (Collection<String>) permissionObj;
                authorities.addAll(permissions.stream()
                        .map(permission -> new SimpleGrantedAuthority("SCOPE_" + permission))
                        .collect(Collectors.toList()));
            }
        }

        return authorities;
    }

    /**
     * Extract roles from the JWT token
     */
    private Collection<GrantedAuthority> extractRoles(Jwt jwt) {
        Collection<GrantedAuthority> authorities = new HashSet<>();

        // Auth0 places roles in the 'https://example.com/roles' custom claim or 'roles' claim
        String[] rolesClaims = {"https://name-collection-app/roles", "roles"};

        for (String roleClaim : rolesClaims) {
            if (jwt.getClaims().containsKey(roleClaim)) {
                Object rolesObj = jwt.getClaim(roleClaim);

                if (rolesObj instanceof String[] strings) {
                    authorities.addAll(Arrays.stream(strings)
                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                            .collect(Collectors.toList()));
                } else if (rolesObj instanceof Collection) {
                    @SuppressWarnings("unchecked")
                    Collection<String> roles = (Collection<String>) rolesObj;
                    authorities.addAll(roles.stream()
                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                            .collect(Collectors.toList()));
                }
            }
        }

        return authorities;
    }

    /**
     * Get the principal claim name from the JWT token
     */
    private String getPrincipalClaimName(Jwt jwt) {
        // Auth0 uses 'sub' claim to store the user ID
        return jwt.getSubject();
    }
}
