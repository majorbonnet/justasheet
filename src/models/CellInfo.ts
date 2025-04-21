import type { CellCoord } from "./CellCoord"

export type CellValueType = "number" | "string" | "formula"

export type CellInfo = {
    literalValue: string
    displayValue: string
    valueType: string
    referencedBy: NonNullable<CellCoord[]>
    isActive: NonNullable<boolean>
}
