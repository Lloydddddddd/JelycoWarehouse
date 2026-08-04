-- ============================================
-- Jelyco Warehouse
-- Migration: AddUserIsActive
-- ============================================

-- Add IsActive column
IF COL_LENGTH('AspNetUsers', 'IsActive') IS NULL
BEGIN
    ALTER TABLE AspNetUsers
    ADD IsActive bit NOT NULL
        CONSTRAINT DF_AspNetUsers_IsActive
        DEFAULT(1);
END
GO

-- Record migration in EF Core history
IF NOT EXISTS (
    SELECT *
    FROM __EFMigrationsHistory
    WHERE MigrationId = '20260731082309_AddUserIsActive'
)
BEGIN
    INSERT INTO __EFMigrationsHistory
    (
        MigrationId,
        ProductVersion
    )
    VALUES
    (
        '20260731082309_AddUserIsActive',
        '8.0.28'
    );
END
GO-- ============================================
-- Jelyco Warehouse
-- Migration: AddUserIsActive
-- ============================================

-- Add IsActive column
IF COL_LENGTH('AspNetUsers', 'IsActive') IS NULL
BEGIN
    ALTER TABLE AspNetUsers
    ADD IsActive bit NOT NULL
        CONSTRAINT DF_AspNetUsers_IsActive
        DEFAULT(1);
END
GO

-- Record migration in EF Core history
IF NOT EXISTS (
    SELECT *
    FROM __EFMigrationsHistory
    WHERE MigrationId = '20260731082309_AddUserIsActive'
)
BEGIN
    INSERT INTO __EFMigrationsHistory
    (
        MigrationId,
        ProductVersion
    )
    VALUES
    (
        '20260731082309_AddUserIsActive',
        '8.0.28'
    );
END
GO