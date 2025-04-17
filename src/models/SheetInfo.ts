export type ColumnWidths = string[]
export type RowHeights = string[]

export type SheetInfo = {
    rowCount: number
    columnCount: number
    columnWidths: ColumnWidths
    rowHeights: RowHeights
}

export const DefaultRowCount = 60
export const DefaultColumnCount = 25