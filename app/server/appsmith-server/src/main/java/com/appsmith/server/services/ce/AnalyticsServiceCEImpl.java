package com.appsmith.server.services.ce;

import com.appsmith.external.constants.AnalyticsEvents;
import com.appsmith.external.models.BaseDomain;
import com.appsmith.server.configurations.CommonConfig;
import com.appsmith.server.configurations.DeploymentProperties;
import com.appsmith.server.configurations.ProjectProperties;
import com.appsmith.server.domains.User;
import com.appsmith.server.domains.UserData;
import com.appsmith.server.helpers.UserUtils;
import com.appsmith.server.repositories.UserDataRepository;
import com.appsmith.server.services.ConfigService;
import com.appsmith.server.services.FeatureFlagService;
import com.appsmith.server.services.SessionUserService;
import com.segment.analytics.Analytics;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
public class AnalyticsServiceCEImpl implements AnalyticsServiceCE {

    private final Analytics analytics;
    private final SessionUserService sessionUserService;
    private final CommonConfig commonConfig;
    private final ConfigService configService;
    private final FeatureFlagService featureFlagService;

    private final UserUtils userUtils;

    private final ProjectProperties projectProperties;
    private final DeploymentProperties deploymentProperties;

    private final UserDataRepository userDataRepository;

    @Autowired
    public AnalyticsServiceCEImpl(
            @Autowired(required = false) Analytics analytics,
            SessionUserService sessionUserService,
            CommonConfig commonConfig,
            ConfigService configService,
            UserUtils userUtils,
            ProjectProperties projectProperties,
            DeploymentProperties deploymentProperties,
            UserDataRepository userDataRepository,
            @Lazy FeatureFlagService featureFlagService) {
        this.analytics = analytics;
        this.sessionUserService = sessionUserService;
        this.commonConfig = commonConfig;
        this.configService = configService;
        this.featureFlagService = featureFlagService;
        this.userUtils = userUtils;
        this.projectProperties = projectProperties;
        this.deploymentProperties = deploymentProperties;
        this.userDataRepository = userDataRepository;
    }

    public boolean isActive() {
        // Telemetry removed — always inactive
        return false;
    }

    @Override
    public Mono<User> identifyUser(User user, UserData userData) {
        return Mono.just(user);
    }

    @Override
    public Mono<User> identifyUser(User user, UserData userData, String recentlyUsedWorkspaceId) {
        return Mono.just(user);
    }

    public void identifyInstance(
            String instanceId, String proficiency, String useCase, String adminEmail, String adminFullName, String ip) {
        // No-op: telemetry removed
    }

    @Override
    public Mono<Void> sendEvent(String event, String userId, Map<String, ?> properties) {
        return Mono.empty();
    }

    @Override
    public Mono<Void> sendEvent(String event, String userId, Map<String, ?> properties, boolean hashUserId) {
        return Mono.empty();
    }

    @Override
    public <T extends BaseDomain> Mono<T> sendObjectEvent(AnalyticsEvents event, T object) {
        return Mono.just(object);
    }

    public <T> Mono<T> sendObjectEvent(AnalyticsEvents event, T object, Map<String, Object> extraProperties) {
        return Mono.just(object);
    }

    public List<AnalyticsEvents> getNonResourceEvents() {
        return List.of();
    }

    public static Boolean shouldHashUserId(String event, String userId, boolean hashUserId, boolean isCloudHosting) {
        return false;
    }

    public <T extends BaseDomain> Mono<T> sendCreateEvent(T object, Map<String, Object> extraProperties) {
        return Mono.just(object);
    }

    public <T extends BaseDomain> Mono<T> sendCreateEvent(T object) {
        return Mono.just(object);
    }

    public <T extends BaseDomain> Mono<T> sendUpdateEvent(T object, Map<String, Object> extraProperties) {
        return Mono.just(object);
    }

    public <T extends BaseDomain> Mono<T> sendUpdateEvent(T object) {
        return Mono.just(object);
    }

    public <T extends BaseDomain> Mono<T> sendDeleteEvent(T object, Map<String, Object> extraProperties) {
        return Mono.just(object);
    }

    public <T extends BaseDomain> Mono<T> sendArchiveEvent(T object, Map<String, Object> extraProperties) {
        return Mono.just(object);
    }

    public <T extends BaseDomain> Mono<T> sendDeleteEvent(T object) {
        return Mono.just(object);
    }

    public String convertWithStream(Map<String, ?> map) {
        String mapAsString =
                map.keySet().stream().map(key -> key + "=" + map.get(key)).collect(Collectors.joining(", ", "{", "}"));
        return mapAsString;
    }
}
