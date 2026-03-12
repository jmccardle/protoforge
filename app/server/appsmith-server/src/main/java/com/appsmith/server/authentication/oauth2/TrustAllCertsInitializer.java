package com.appsmith.server.authentication.oauth2;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import javax.net.ssl.ManagerFactoryParameters;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.TrustManagerFactorySpi;
import javax.net.ssl.X509TrustManager;
import java.security.KeyStore;
import java.security.Provider;
import java.security.Security;
import java.security.cert.X509Certificate;

/**
 * When APPSMITH_TRUST_ALL_CERTS=true, disables TLS certificate verification
 * globally at the JVM security provider level. This affects ALL SSL connections
 * in the JVM, including those created internally by Reactor Netty, Spring Security,
 * Nimbus JWT, and any other library.
 *
 * Works by registering a custom security provider that overrides the default
 * TrustManagerFactory algorithm, so any code that creates an SSL context
 * (including Netty's SslContextBuilder) will get trust-all trust managers.
 *
 * For test/development environments only.
 */
@Configuration
@Slf4j
public class TrustAllCertsInitializer {

    private static final boolean TRUST_ALL = "true".equalsIgnoreCase(System.getenv("APPSMITH_TRUST_ALL_CERTS"));

    private static final TrustManager[] TRUST_ALL_MANAGERS = new TrustManager[]{
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

    @PostConstruct
    public void init() {
        if (!TRUST_ALL) {
            return;
        }

        log.warn("APPSMITH_TRUST_ALL_CERTS: Disabling ALL TLS certificate verification");

        try {
            // 1. Register a security provider that overrides the default TrustManagerFactory.
            //    This ensures that ANY code creating an SSL context (including Netty's
            //    SslContextBuilder.forClient().build()) will get trust-all trust managers.
            String defaultAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
            Provider trustAllProvider = new Provider(
                    "TrustAllProvider", "1.0", "Trust-all TrustManagerFactory provider") {};
            trustAllProvider.put(
                    "TrustManagerFactory." + defaultAlgorithm,
                    TrustAllTrustManagerFactorySpi.class.getName());
            Security.insertProviderAt(trustAllProvider, 1);

            // 2. Set JVM default SSLContext (covers HttpsURLConnection and libraries
            //    that use SSLContext.getDefault())
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, TRUST_ALL_MANAGERS, new java.security.SecureRandom());
            SSLContext.setDefault(sslContext);
            HttpsURLConnection.setDefaultSSLSocketFactory(sslContext.getSocketFactory());
            HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);

            log.warn("APPSMITH_TRUST_ALL_CERTS: TLS verification disabled globally via security provider override");
        } catch (Exception e) {
            log.error("Failed to disable TLS certificate verification", e);
        }
    }

    /**
     * Custom TrustManagerFactorySpi that always returns trust-all trust managers.
     * Registered as the default algorithm implementation via a security provider,
     * so all SSL contexts in the JVM use it.
     */
    public static class TrustAllTrustManagerFactorySpi extends TrustManagerFactorySpi {

        @Override
        protected void engineInit(KeyStore ks) {
            // No-op: we trust everything regardless of keystore
        }

        @Override
        protected void engineInit(ManagerFactoryParameters spec) {
            // No-op: we trust everything regardless of parameters
        }

        @Override
        protected TrustManager[] engineGetTrustManagers() {
            return TRUST_ALL_MANAGERS;
        }
    }
}
