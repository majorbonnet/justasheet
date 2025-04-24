import type { CellCoords } from "./CellCoords"

export type CellValueType = "number" | "string" | "formula"

export type CellInfo = {
    cellId: string
    literalValue: string
    displayValue: string
    valueType: string
    referencedBy: NonNullable<CellCoords[]>
    isActive: NonNullable<boolean>
}
