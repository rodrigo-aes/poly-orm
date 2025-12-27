import { SQLString } from "../Handlers"

export const databaseSchemaQuery = (table?: string) => SQLString
    .sanitize(`
        SELECT
            cols.tableName,
            JSON_ARRAYAGG(
                JSON_OBJECT(
                    'name',             cols.name,
                    'dataType',         cols.dataType,
                    'columnType',       cols.columnType,
                    'length',           cols.length,
                    'nullable',         cols.nullable,
                    'primary',          cols.isPrimary,
                    'autoIncrement',    cols.autoIncrement,
                    'hasDefaultValue',  cols.hasDefaultValue,
                    'defaultValue',     cols.defaultValue,
                    'unsigned',         cols.isUnsigned,
                    'unique',           cols.isUnique,
                    'isForeignKey',     cols.isForeignKey,
                    
                    'references', JSON_OBJECT(
                        'constrained',      cols.isForeignKey,
                        'tableName',        cols.foreignTable,
                        'name',             cols.foreignKeyName,
                        'columnName',       cols.foreignColumn,
                        'onDelete',         cols.onDelete,
                        'onUpdate',         cols.onUpdate
                    )
                )
            ) AS columns
        FROM (
                SELECT
                    c.TABLE_NAME               AS tableName,
                    c.COLUMN_NAME              AS name,
                    c.DATA_TYPE                AS dataType,
                    c.COLUMN_TYPE              AS columnType,
                    c.CHARACTER_MAXIMUM_LENGTH AS length,
                    c.IS_NULLABLE = 'YES'      AS nullable,
                    c.COLUMN_KEY = 'PRI'       AS isPrimary,
                    c.EXTRA LIKE '%auto_increment%' AS autoIncrement,
                    c.COLUMN_DEFAULT IS NOT NULL    AS hasDefaultValue,
                    c.COLUMN_DEFAULT           AS defaultValue,

                    LOCATE('unsigned', c.COLUMN_TYPE) > 0 AS isUnsigned,

                    IF(
                        ku.CONSTRAINT_NAME IS NOT NULL 
                        AND tc.CONSTRAINT_TYPE = 'UNIQUE', TRUE, FALSE
                    ) AS isUnique,

                    ku.REFERENCED_TABLE_NAME   AS foreignTable,
                    ku.REFERENCED_COLUMN_NAME  AS foreignColumn,
                    ku.CONSTRAINT_NAME         AS foreignKeyName,
                    (ku.REFERENCED_TABLE_NAME IS NOT NULL) AS isForeignKey,
                    rc.UPDATE_RULE             AS onUpdate,
                    rc.DELETE_RULE             AS onDelete,
                    c.ORDINAL_POSITION         AS ordinalPosition
                FROM INFORMATION_SCHEMA.COLUMNS c

                LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE ku
                    ON ku.TABLE_SCHEMA = c.TABLE_SCHEMA
                    AND ku.TABLE_NAME = c.TABLE_NAME
                    AND ku.COLUMN_NAME = c.COLUMN_NAME

                LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
                    ON tc.TABLE_SCHEMA = ku.TABLE_SCHEMA
                    AND tc.TABLE_NAME = ku.TABLE_NAME
                    AND tc.CONSTRAINT_NAME = ku.CONSTRAINT_NAME
                    AND tc.CONSTRAINT_TYPE = 'UNIQUE'

                LEFT JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
                    ON rc.CONSTRAINT_SCHEMA = ku.TABLE_SCHEMA
                    AND rc.CONSTRAINT_NAME = ku.CONSTRAINT_NAME

                WHERE c.TABLE_SCHEMA = DATABASE() 
                ${table ? `AND tableName = ${table}` : ''}

                ORDER BY c.TABLE_NAME, c.ORDINAL_POSITION
            ) AS cols
            
        GROUP BY cols.tableName
        ORDER BY cols.tableName;
`)

