#!/bin/bash

# Database Migration Runner for devdutt-samiti-service
# Runs all SQL migration files in order

set -e  # Exit on error

echo "🗄️  Running Database Migrations for devdutt-samiti-service"
echo "=========================================================="

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  .env file not found, using defaults"
    export DB_HOST=${DB_HOST:-localhost}
    export DB_PORT=${DB_PORT:-5432}
    export DB_USER=${DB_USER:-devdutt}
    export DB_PASSWORD=${DB_PASSWORD:-devdutt_secret}
    export DB_NAME=${DB_NAME:-devdutt_samiti}
fi

echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "User: $DB_USER"
echo ""

# Check if PostgreSQL is accessible
if ! PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c '\q' 2>/dev/null; then
    echo "❌ Error: Cannot connect to PostgreSQL"
    echo "Please ensure PostgreSQL is running and credentials are correct"
    exit 1
fi

echo "✅ PostgreSQL connection successful"
echo ""

# Create database if it doesn't exist
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME"

echo "✅ Database $DB_NAME ready"
echo ""

# Run migrations in order
MIGRATION_DIR="src/database/migrations"

if [ ! -d "$MIGRATION_DIR" ]; then
    echo "❌ Error: Migration directory not found: $MIGRATION_DIR"
    exit 1
fi

MIGRATIONS=$(ls $MIGRATION_DIR/*.sql 2>/dev/null | sort)

if [ -z "$MIGRATIONS" ]; then
    echo "⚠️  No migration files found in $MIGRATION_DIR"
    exit 0
fi

for migration in $MIGRATIONS; then
    filename=$(basename $migration)
    echo "📝 Running migration: $filename"
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $migration
    if [ $? -eq 0 ]; then
        echo "   ✅ Success"
    else
        echo "   ❌ Failed"
        exit 1
    fi
    echo ""
done

echo "=========================================================="
echo "🎉 All migrations completed successfully!"
echo ""
echo "You can now start the application with: npm run start:dev"

