package com.mileszhang.siuyeh;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

/**
 * Starts one real PostgreSQL 16 container for all integration tests, so the
 * Flyway migrations and the PostgreSQL-specific SQL (ON CONFLICT,
 * DELETE ... RETURNING) are exercised for real. Skipped when Docker is not
 * available; CI always has Docker.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers(disabledWithoutDocker = true)
public abstract class IntegrationTestBase {

    // The official postgres image, pulled from the AWS ECR Public mirror of
    // Docker Hub's library images. Docker Hub pulls from CI runners time out
    // intermittently; this mirror has no anonymous rate limit.
    private static final DockerImageName POSTGRES_IMAGE = DockerImageName
            .parse("public.ecr.aws/docker/library/postgres:16-alpine")
            .asCompatibleSubstituteFor("postgres");

    @Container
    @ServiceConnection
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>(POSTGRES_IMAGE);
}
