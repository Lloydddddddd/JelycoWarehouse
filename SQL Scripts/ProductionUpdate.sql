BEGIN TRANSACTION;
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Transactions]') AND [c].[name] = N'Type');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Transactions] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [Transactions] ALTER COLUMN [Type] int NOT NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260708104648_AddTransactionTypeEnum', N'8.0.28');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Items] ADD [Color] nvarchar(50) NOT NULL DEFAULT N'';
GO

UPDATE [Items] SET [Color] = N''
WHERE [Id] = 1;
SELECT @@ROWCOUNT;

GO

UPDATE [Items] SET [Color] = N''
WHERE [Id] = 2;
SELECT @@ROWCOUNT;

GO

UPDATE [Items] SET [Color] = N''
WHERE [Id] = 3;
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260710055735_AddItemColor', N'8.0.28');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

EXEC sp_rename N'[Items].[UnitPrice]', N'CostPrice', N'COLUMN';
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260710062245_RenameUnitPriceToCostPriceAndAddColor', N'8.0.28');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [SupplierDeliveryItems] ADD [TotalCost] decimal(18,2) NOT NULL DEFAULT 0.0;
GO

ALTER TABLE [SupplierDeliveryItems] ADD [UnitCost] decimal(18,2) NOT NULL DEFAULT 0.0;
GO

ALTER TABLE [SupplierDeliveries] ADD [GrandTotal] decimal(18,2) NOT NULL DEFAULT 0.0;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260712103431_AddSupplierDeliveryCosts', N'8.0.28');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Transactions] ADD [SupplierDeliveryId] int NULL;
GO

CREATE INDEX [IX_Transactions_SupplierDeliveryId] ON [Transactions] ([SupplierDeliveryId]);
GO

ALTER TABLE [Transactions] ADD CONSTRAINT [FK_Transactions_SupplierDeliveries_SupplierDeliveryId] FOREIGN KEY ([SupplierDeliveryId]) REFERENCES [SupplierDeliveries] ([Id]) ON DELETE SET NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260713061935_LinkTransactionsToSupplierDeliveries', N'8.0.28');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [WarehouseReleases] (
    [Id] int NOT NULL IDENTITY,
    [ReleaseReference] nvarchar(max) NOT NULL,
    [ReleaseDate] datetime2 NOT NULL,
    [Destination] nvarchar(150) NOT NULL,
    [GrandTotal] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_WarehouseReleases] PRIMARY KEY ([Id])
);
GO

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
GO

CREATE INDEX [IX_WarehouseReleaseItems_ItemId] ON [WarehouseReleaseItems] ([ItemId]);
GO

CREATE INDEX [IX_WarehouseReleaseItems_WarehouseReleaseId] ON [WarehouseReleaseItems] ([WarehouseReleaseId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260713075842_AddWarehouseReleases', N'8.0.28');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Transactions] ADD [WarehouseReleaseId] int NULL;
GO

CREATE INDEX [IX_Transactions_WarehouseReleaseId] ON [Transactions] ([WarehouseReleaseId]);
GO

ALTER TABLE [Transactions] ADD CONSTRAINT [FK_Transactions_WarehouseReleases_WarehouseReleaseId] FOREIGN KEY ([WarehouseReleaseId]) REFERENCES [WarehouseReleases] ([Id]) ON DELETE SET NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260713090537_LinkTransactionsToWarehouseReleases', N'8.0.28');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Transactions] ADD [InventoryAdjustmentId] int NULL;
GO

CREATE TABLE [InventoryAdjustments] (
    [Id] int NOT NULL IDENTITY,
    [AdjustmentReference] nvarchar(max) NOT NULL,
    [AdjustmentDate] datetime2 NOT NULL,
    [Reason] nvarchar(250) NOT NULL,
    CONSTRAINT [PK_InventoryAdjustments] PRIMARY KEY ([Id])
);
GO

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
GO

CREATE INDEX [IX_Transactions_InventoryAdjustmentId] ON [Transactions] ([InventoryAdjustmentId]);
GO

CREATE INDEX [IX_InventoryAdjustmentItems_InventoryAdjustmentId] ON [InventoryAdjustmentItems] ([InventoryAdjustmentId]);
GO

CREATE INDEX [IX_InventoryAdjustmentItems_ItemId] ON [InventoryAdjustmentItems] ([ItemId]);
GO

ALTER TABLE [Transactions] ADD CONSTRAINT [FK_Transactions_InventoryAdjustments_InventoryAdjustmentId] FOREIGN KEY ([InventoryAdjustmentId]) REFERENCES [InventoryAdjustments] ([Id]) ON DELETE SET NULL;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260713102358_LinkTransactionsToInventoryAdjustments', N'8.0.28');
GO

COMMIT;
GO

