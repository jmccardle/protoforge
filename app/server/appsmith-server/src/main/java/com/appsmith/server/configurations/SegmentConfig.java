package com.appsmith.server.configurations;

import com.segment.analytics.Analytics;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class SegmentConfig {

    private final CommonConfig commonConfig;

    @Autowired
    public SegmentConfig(CommonConfig commonConfig) {
        this.commonConfig = commonConfig;
    }

    @Bean
    public Analytics analyticsRunner() {
        // Telemetry removed — always return null to disable analytics
        return null;
    }

    public String getCeKey() {
        return "";
    }
}
