import type { Highlights } from '@/types/common';

type Column = 'id' | 'civ' | 'developer_id' | 'date' | 'spend';

type GenerateMockCsvOptions = {
    excludeColumns?: Column[];
    rowCount?: number;
    batchSize?: number;
};

type MockFactory<T> = (overrides?: Partial<T>) => T;

export const defaultHighlights: Highlights = {
    total_spend_galactic: 4800,
    rows_affected: 10,
    less_spent_at: 79,
    big_spent_at: 33,
    less_spent_value: 21,
    big_spent_value: 976,
    average_spend_galactic: 480,
    big_spent_civ: 'blobs',
    less_spent_civ: 'humans',
};

export const genMockHighlights: MockFactory<Highlights> = (overrides = {}) => ({ ...defaultHighlights, ...overrides });

const DEFAULT_COLUMNS: Column[] = ['id', 'civ', 'developer_id', 'date', 'spend'];
const CIVS = ['blobs', 'humans', 'monsters'];

const getRandomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
const generateRandomDeveloperId = (): string => {
    let id = '';
    for (let i = 0; i < 13; i++) {
        id += Math.floor(Math.random() * 10).toString();
    }
    return id;
};

const generateRandomRow = (index: number): Record<string, string> => {
    return {
        id: (index + 1).toString(),
        civ: getRandomItem(CIVS),
        developer_id: generateRandomDeveloperId(),
        date: Math.floor(Math.random() * 365).toString(),
        spend: Math.floor(Math.random() * 999 + 1).toString(),
    };
};

export const genMockCsvFile = (options: GenerateMockCsvOptions = {}): File => {
    const { excludeColumns = [], rowCount = 100000, batchSize = 10000 } = options;

    const includedColumns = DEFAULT_COLUMNS.filter((col) => !excludeColumns.includes(col));
    const header = includedColumns.join('\t');

    let csvContent = header + '\n';

    for (let batchStart = 0; batchStart < rowCount; batchStart += batchSize) {
        const batchEnd = Math.min(batchStart + batchSize, rowCount);
        const batchRows: string[] = [];

        for (let i = batchStart; i < batchEnd; i++) {
            const row = generateRandomRow(i);
            const rowData = includedColumns.map((col) => row[col] ?? '').join('\t');
            batchRows.push(rowData);
        }

        csvContent += batchRows.join('\n');
        if (batchEnd < rowCount) {
            csvContent += '\n';
        }
    }

    return new File([csvContent], `large-test-${rowCount}.csv`, { type: 'text/csv' });
};

export const validHistoryEntry =
    '[{"fileName":"report.csv","highlights":{"total_spend_galactic":151790810.5,"less_spent_at":13,"big_spent_at":3,"less_spent_value":364998.5,"big_spent_value":465686.5,"average_spend_galactic":501.1251584681413,"big_spent_civ":"monsters","less_spent_civ":"humans"}}]';
export const invalidHistoryEntry =
    '[{"fileName":"invalid.csv","highlights":{"total_spend_galactic":0,"average_spend_galactic":0}}]';
