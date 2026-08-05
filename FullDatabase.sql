IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetRoles] (
        [Id] nvarchar(450) NOT NULL,
        [Name] nvarchar(256) NULL,
        [NormalizedName] nvarchar(256) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetUsers] (
        [Id] nvarchar(450) NOT NULL,
        [FullName] nvarchar(max) NULL,
        [RefreshToken] nvarchar(max) NULL,
        [RefreshTokenExpiryTime] datetime2 NULL,
        [UserName] nvarchar(256) NULL,
        [NormalizedUserName] nvarchar(256) NULL,
        [Email] nvarchar(256) NULL,
        [NormalizedEmail] nvarchar(256) NULL,
        [EmailConfirmed] bit NOT NULL,
        [PasswordHash] nvarchar(max) NULL,
        [SecurityStamp] nvarchar(max) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        [PhoneNumber] nvarchar(max) NULL,
        [PhoneNumberConfirmed] bit NOT NULL,
        [TwoFactorEnabled] bit NOT NULL,
        [LockoutEnd] datetimeoffset NULL,
        [LockoutEnabled] bit NOT NULL,
        [AccessFailedCount] int NOT NULL,
        CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE TABLE [Brands] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_Brands] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE TABLE [InventoryAdjustments] (
        [Id] int NOT NULL IDENTITY,
        [AdjustmentReference] nvarchar(max) NOT NULL,
        [AdjustmentDate] datetime2 NOT NULL,
        [Reason] nvarchar(250) NOT NULL,
        CONSTRAINT [PK_InventoryAdjustments] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE TABLE [Suppliers] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(100) NOT NULL,
        [ContactInfo] nvarchar(max) NOT NULL,
        [Address] nvarchar(max) NOT NULL,
        [Email] nvarchar(max) NOT NULL,
        [IsActive] bit NOT NULL,
        CONSTRAINT [PK_Suppliers] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE TABLE [WarehouseReleases] (
        [Id] int NOT NULL IDENTITY,
        [ReleaseReference] nvarchar(max) NOT NULL,
        [ReleaseDate] datetime2 NOT NULL,
        [Destination] nvarchar(150) NOT NULL,
        [GrandTotal] decimal(18,2) NOT NULL,
        CONSTRAINT [PK_WarehouseReleases] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetRoleClaims] (
        [Id] int NOT NULL IDENTITY,
        [RoleId] nvarchar(450) NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetUserClaims] (
        [Id] int NOT NULL IDENTITY,
        [UserId] nvarchar(450) NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetUserLogins] (
        [LoginProvider] nvarchar(450) NOT NULL,
        [ProviderKey] nvarchar(450) NOT NULL,
        [ProviderDisplayName] nvarchar(max) NULL,
        [UserId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
        CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetUserRoles] (
        [UserId] nvarchar(450) NOT NULL,
        [RoleId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
        CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE TABLE [AspNetUserTokens] (
        [UserId] nvarchar(450) NOT NULL,
        [LoginProvider] nvarchar(450) NOT NULL,
        [Name] nvarchar(450) NOT NULL,
        [Value] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
        CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE TABLE [Items] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(100) NOT NULL,
        [BrandId] int NOT NULL,
        [Kind] nvarchar(50) NOT NULL,
        [Size] nvarchar(50) NOT NULL,
        [Color] nvarchar(50) NOT NULL,
        [Category] nvarchar(max) NOT NULL,
        [Quantity] int NOT NULL,
        [ExpiryDate] datetime2 NULL,
        [CostPrice] decimal(18,2) NOT NULL,
        [IsActive] bit NOT NULL,
        [SupplierId] int NULL,
        CONSTRAINT [PK_Items] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Items_Brands_BrandId] FOREIGN KEY ([BrandId]) REFERENCES [Brands] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_Items_Suppliers_SupplierId] FOREIGN KEY ([SupplierId]) REFERENCES [Suppliers] ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE TABLE [SupplierDeliveries] (
        [Id] int NOT NULL IDENTITY,
        [SupplierId] int NOT NULL,
        [DeliveryReference] nvarchar(max) NOT NULL,
        [DeliveryDate] datetime2 NOT NULL,
        [GrandTotal] decimal(18,2) NOT NULL,
        CONSTRAINT [PK_SupplierDeliveries] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_SupplierDeliveries_Suppliers_SupplierId] FOREIGN KEY ([SupplierId]) REFERENCES [Suppliers] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE TABLE [InventoryAdjustmentItems] (
        [Id] int NOT NULL IDENTITY,
        [InventoryAdjustmentId] int NOT NULL,
        [ItemId] int NOT NULL,
        [SystemQuantity] int NOT NULL,
        [ActualQuantity] int NOT NULL,
        [Difference] int NOT NULL,
        CONSTRAINT [PK_InventoryAdjustmentItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_InventoryAdjustmentItems_InventoryAdjustments_InventoryAdjustmentId] FOREIGN KEY ([InventoryAdjustmentId]) REFERENCES [InventoryAdjustments] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_InventoryAdjustmentItems_Items_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [Items] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE TABLE [WarehouseReleaseItems] (
        [Id] int NOT NULL IDENTITY,
        [WarehouseReleaseId] int NOT NULL,
        [ItemId] int NOT NULL,
        [Quantity] int NOT NULL,
        [UnitCost] decimal(18,2) NOT NULL,
        [TotalCost] decimal(18,2) NOT NULL,
        CONSTRAINT [PK_WarehouseReleaseItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_WarehouseReleaseItems_Items_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [Items] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_WarehouseReleaseItems_WarehouseReleases_WarehouseReleaseId] FOREIGN KEY ([WarehouseReleaseId]) REFERENCES [WarehouseReleases] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE TABLE [SupplierDeliveryItems] (
        [Id] int NOT NULL IDENTITY,
        [SupplierDeliveryId] int NOT NULL,
        [ItemId] int NOT NULL,
        [Quantity] int NOT NULL,
        [UnitCost] decimal(18,2) NOT NULL,
        [TotalCost] decimal(18,2) NOT NULL,
        CONSTRAINT [PK_SupplierDeliveryItems] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_SupplierDeliveryItems_Items_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [Items] ([Id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_SupplierDeliveryItems_SupplierDeliveries_SupplierDeliveryId] FOREIGN KEY ([SupplierDeliveryId]) REFERENCES [SupplierDeliveries] ([Id]) ON DELETE NO ACTION
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE TABLE [Transactions] (
        [Id] int NOT NULL IDENTITY,
        [ItemId] int NOT NULL,
        [SupplierDeliveryId] int NULL,
        [WarehouseReleaseId] int NULL,
        [InventoryAdjustmentId] int NULL,
        [Quantity] int NOT NULL,
        [Type] int NOT NULL,
        [Date] datetime2 NOT NULL,
        CONSTRAINT [PK_Transactions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Transactions_InventoryAdjustments_InventoryAdjustmentId] FOREIGN KEY ([InventoryAdjustmentId]) REFERENCES [InventoryAdjustments] ([Id]) ON DELETE SET NULL,
        CONSTRAINT [FK_Transactions_Items_ItemId] FOREIGN KEY ([ItemId]) REFERENCES [Items] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_Transactions_SupplierDeliveries_SupplierDeliveryId] FOREIGN KEY ([SupplierDeliveryId]) REFERENCES [SupplierDeliveries] ([Id]) ON DELETE SET NULL,
        CONSTRAINT [FK_Transactions_WarehouseReleases_WarehouseReleaseId] FOREIGN KEY ([WarehouseReleaseId]) REFERENCES [WarehouseReleases] ([Id]) ON DELETE SET NULL
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'IsActive', N'Name') AND [object_id] = OBJECT_ID(N'[Brands]'))
        SET IDENTITY_INSERT [Brands] ON;
    EXEC(N'INSERT INTO [Brands] ([Id], [IsActive], [Name])
    VALUES (1, CAST(1 AS bit), N''Stanley''),
    (2, CAST(1 AS bit), N''Bosch''),
    (3, CAST(1 AS bit), N''Makita''),
    (4, CAST(1 AS bit), N''ToolCo'')');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'IsActive', N'Name') AND [object_id] = OBJECT_ID(N'[Brands]'))
        SET IDENTITY_INSERT [Brands] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Address', N'ContactInfo', N'Email', N'IsActive', N'Name') AND [object_id] = OBJECT_ID(N'[Suppliers]'))
        SET IDENTITY_INSERT [Suppliers] ON;
    EXEC(N'INSERT INTO [Suppliers] ([Id], [Address], [ContactInfo], [Email], [IsActive], [Name])
    VALUES (1, N''Main St'', N''123-456'', N''abc@supplies.com'', CAST(1 AS bit), N''ABC Supplies''),
    (2, N''Market Rd'', N''789-012'', N''xyz@traders.com'', CAST(1 AS bit), N''XYZ Traders''),
    (3, N''Old Rd'', N''000-000'', N''inactive@supplier.com'', CAST(0 AS bit), N''Inactive Supplier'')');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Address', N'ContactInfo', N'Email', N'IsActive', N'Name') AND [object_id] = OBJECT_ID(N'[Suppliers]'))
        SET IDENTITY_INSERT [Suppliers] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'BrandId', N'Category', N'Color', N'CostPrice', N'ExpiryDate', N'IsActive', N'Kind', N'Name', N'Quantity', N'Size', N'SupplierId') AND [object_id] = OBJECT_ID(N'[Items]'))
        SET IDENTITY_INSERT [Items] ON;
    EXEC(N'INSERT INTO [Items] ([Id], [BrandId], [Category], [Color], [CostPrice], [ExpiryDate], [IsActive], [Kind], [Name], [Quantity], [Size], [SupplierId])
    VALUES (1, 4, N''Tools'', N'''', 150.0, NULL, CAST(1 AS bit), N''Hand Tool'', N''Hammer'', 50, N''Medium'', NULL),
    (2, 4, N''Tools'', N'''', 75.0, NULL, CAST(1 AS bit), N''Hand Tool'', N''Screwdriver'', 100, N''Small'', NULL),
    (3, 4, N''Paints'', N'''', 200.0, ''2025-01-01T00:00:00.0000000'', CAST(0 AS bit), N''Paint'', N''Expired Paint'', 0, N''1L'', NULL)');
    IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'BrandId', N'Category', N'Color', N'CostPrice', N'ExpiryDate', N'IsActive', N'Kind', N'Name', N'Quantity', N'Size', N'SupplierId') AND [object_id] = OBJECT_ID(N'[Items]'))
        SET IDENTITY_INSERT [Items] OFF;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    EXEC(N'CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_InventoryAdjustmentItems_InventoryAdjustmentId] ON [InventoryAdjustmentItems] ([InventoryAdjustmentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_InventoryAdjustmentItems_ItemId] ON [InventoryAdjustmentItems] ([ItemId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Items_BrandId] ON [Items] ([BrandId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Items_SupplierId] ON [Items] ([SupplierId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_SupplierDeliveries_SupplierId] ON [SupplierDeliveries] ([SupplierId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_SupplierDeliveryItems_ItemId] ON [SupplierDeliveryItems] ([ItemId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_SupplierDeliveryItems_SupplierDeliveryId] ON [SupplierDeliveryItems] ([SupplierDeliveryId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Transactions_InventoryAdjustmentId] ON [Transactions] ([InventoryAdjustmentId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Transactions_ItemId] ON [Transactions] ([ItemId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Transactions_SupplierDeliveryId] ON [Transactions] ([SupplierDeliveryId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_Transactions_WarehouseReleaseId] ON [Transactions] ([WarehouseReleaseId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_WarehouseReleaseItems_ItemId] ON [WarehouseReleaseItems] ([ItemId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    CREATE INDEX [IX_WarehouseReleaseItems_WarehouseReleaseId] ON [WarehouseReleaseItems] ([WarehouseReleaseId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260720060719_InitialCreate'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260720060719_InitialCreate', N'8.0.28');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260721062055_AddReorderLevelToItems'
)
BEGIN
    ALTER TABLE [Items] ADD [ReorderLevel] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260721062055_AddReorderLevelToItems'
)
BEGIN
    EXEC(N'UPDATE [Items] SET [ReorderLevel] = 10
    WHERE [Id] = 1;
    SELECT @@ROWCOUNT');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260721062055_AddReorderLevelToItems'
)
BEGIN
    EXEC(N'UPDATE [Items] SET [ReorderLevel] = 10
    WHERE [Id] = 2;
    SELECT @@ROWCOUNT');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260721062055_AddReorderLevelToItems'
)
BEGIN
    EXEC(N'UPDATE [Items] SET [ReorderLevel] = 10
    WHERE [Id] = 3;
    SELECT @@ROWCOUNT');
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260721062055_AddReorderLevelToItems'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260721062055_AddReorderLevelToItems', N'8.0.28');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260728113234_AddExpiryDateToSupplierDeliveryItem'
)
BEGIN
    ALTER TABLE [SupplierDeliveryItems] ADD [ExpiryDate] datetime2 NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260728113234_AddExpiryDateToSupplierDeliveryItem'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260728113234_AddExpiryDateToSupplierDeliveryItem', N'8.0.28');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260731082309_AddUserIsActive'
)
BEGIN
    ALTER TABLE [AspNetUsers] ADD [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20260731082309_AddUserIsActive'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20260731082309_AddUserIsActive', N'8.0.28');
END;
GO

COMMIT;
GO

