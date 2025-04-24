export type ColumnWidths = string[]
export type RowHeights = string[]

export type SheetInfo = {
    columnCount: number
    rowCount: number

    columnWidths: ColumnWidths
    rowHeights: RowHeights
}

export const DefaultColumnCount = 25
export const DefaultRowCount = 60

export const MaxColumnCount = 512
export const MaxRowCount = 512
