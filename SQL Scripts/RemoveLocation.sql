BEGIN TRANSACTION;
GO

ALTER TABLE [Transactions] DROP CONSTRAINT [FK_Transactions_Locations_LocationId];
GO

DROP TABLE [StockLevels];
GO

DROP TABLE [Locations];
GO

DROP INDEX [IX_Transactions_LocationId] ON [Transactions];
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Transactions]') AND [c].[name] = N'LocationId');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Transactions] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [Transactions] DROP COLUMN [LocationId];
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260715092102_RemoveLocationAndStockLevel', N'8.0.28');
GO

COMMIT;
GO

