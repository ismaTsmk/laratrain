FROM php:8.4-cli-alpine

# Set working directory
WORKDIR /app

# Install system dependencies and PHP extensions (PDO PgSQL & Redis)
RUN apk add --no-cache \
    postgresql-dev \
    linux-headers \
    curl \
    git \
    unzip \
    nodejs \
    npm \
    $PHPIZE_DEPS \
    && docker-php-ext-install pdo_pgsql \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del $PHPIZE_DEPS \
    && rm -rf /tmp/pear

# Install Composer via official installer script (no extra image pull)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Artisan serve on port 8000 by default
EXPOSE 8000
