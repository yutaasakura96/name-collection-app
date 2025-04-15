# Start with a base image containing Java runtime
FROM eclipse-temurin:21-jdk-alpine as build

# Set the working directory
WORKDIR /app

# Copy gradle files first for better caching
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
# Add this line if you have additional build scripts
# COPY buildSrc buildSrc (if you have it)

# Make gradlew executable
RUN chmod +x ./gradlew

# Cache dependencies by running a simple task
RUN ./gradlew dependencies --no-daemon

# Copy source code
COPY src src

# Build the application with specific JAR naming
RUN ./gradlew build -x test --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built artifact from the build stage with explicit naming
COPY --from=build /app/build/libs/app.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
