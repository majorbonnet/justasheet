import type { CellCoords } from "./CellCoords"

export type CellValueType = "number" | "string" | "formula" | "boolean" | "error"

export type CellInfo = {
    rowIndex: number
    columnIndex: number
    literalValue: string
    displayValue: string
    typedValue: unknown
    valueType: string
    referencedBy: NonNullable<CellCoords[]>
    isActive: NonNullable<boolean>
}
