package com.appsmith.server.authentication.oauth2;

import com.appsmith.util.WebClientUtils;
import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoderFactory;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.cert.X509Certificate;

/**
 * When APPSMITH_TRUST_ALL_CERTS=true, disables TLS certificate verification
 * across all layers:
 * - JVM default SSLContext (for HttpsURLConnection-based calls)
 * - Reactor Netty WebClient (via WebClientUtils)
 * - Spring Security's OIDC JWT decoder (JWKS fetch, token validation)
 *
 * For test/development environments only.
 */
@Configuration
@Slf4j
public class TrustAllCertsInitializer {

    private static final boolean TRUST_ALL = "true".equalsIgnoreCase(System.getenv("APPSMITH_TRUST_ALL_CERTS"));

    @PostConstruct
    public void init() {
        if (!TRUST_ALL) {
            return;
        }

        log.warn("APPSMITH_TRUST_ALL_CERTS: Disabling JVM-level TLS certificate verification");

        try {
            TrustManager[] trustAllManagers = new TrustManager[]{
                    new X509TrustManager() {
                        @Override
                        public X509Certificate[] getAcceptedIssuers() {
                            return new X509Certificate[0];
                        }

                        @Override
                        public void checkClientTrusted(X509Certificate[] certs, String authType) {
                        }

                        @Override
                        public void checkServerTrusted(X509Certificate[] certs, String authType) {
                        }
                    }
            };

            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, trustAllManagers, new java.security.SecureRandom());
            SSLContext.setDefault(sslContext);
            HttpsURLConnection.setDefaultSSLSocketFactory(sslContext.getSocketFactory());
            HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);

            log.warn("APPSMITH_TRUST_ALL_CERTS: JVM-level TLS verification disabled");
        } catch (Exception e) {
            log.error("Failed to disable TLS certificate verification", e);
        }
    }

    /**
     * Provides a custom JWT decoder factory that uses an insecure WebClient
     * for fetching JWKS from the OIDC provider. This replaces Spring Security's
     * default OidcIdTokenDecoderFactory when APPSMITH_TRUST_ALL_CERTS=true.
     */
    @Bean
    public ReactiveJwtDecoderFactory<ClientRegistration> idTokenDecoderFactory() {
        if (!TRUST_ALL) {
            // Return default behavior — use standard WebClient with TLS verification
            return clientRegistration -> {
                String jwkSetUri = clientRegistration.getProviderDetails().getJwkSetUri();
                return NimbusReactiveJwtDecoder.withJwkSetUri(jwkSetUri)
                        .jwsAlgorithm(SignatureAlgorithm.RS256)
                        .build();
            };
        }

        log.warn("APPSMITH_TRUST_ALL_CERTS: Configuring insecure JWT decoder for OIDC");

        return clientRegistration -> {
            String jwkSetUri = clientRegistration.getProviderDetails().getJwkSetUri();

            WebClient insecureWebClient;
            try {
                SslContext sslContext = SslContextBuilder.forClient()
                        .trustManager(InsecureTrustManagerFactory.INSTANCE)
                        .build();
                HttpClient httpClient = HttpClient.create()
                        .secure(spec -> spec.sslContext(sslContext));
                insecureWebClient = WebClient.builder()
                        .clientConnector(new ReactorClientHttpConnector(httpClient))
                        .build();
            } catch (Exception e) {
                log.error("Failed to create insecure WebClient for JWT decoder, falling back to default", e);
                return NimbusReactiveJwtDecoder.withJwkSetUri(jwkSetUri)
                        .jwsAlgorithm(SignatureAlgorithm.RS256)
                        .build();
            }

            return NimbusReactiveJwtDecoder.withJwkSetUri(jwkSetUri)
                    .jwsAlgorithm(SignatureAlgorithm.RS256)
                    .webClient(insecureWebClient)
                    .build();
        };
    }
}
