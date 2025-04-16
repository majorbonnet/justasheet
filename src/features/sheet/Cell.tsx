import type { JSX } from "react"
import type { CellCoord, CellState } from "./sheetSlice"
import {
    selectPopulatedCell,
    updateCell
} from "./sheetSlice"
import { useAppDispatch, useAppSelector } from "../../app/hooks"

export const Cell = (props: CellCoord): JSX.Element => {
    const dispatch = useAppDispatch()
    const populatedCell: CellState = useAppSelector((state) => selectPopulatedCell(state, props.rowNumber, props.columnNumber));
    const displayValue = populatedCell?.literalValue

    return (
        <td>
            <input 
                name="cellInput"
                defaultValue={displayValue}
                onChange={e => dispatch(updateCell({ rowNumber: props.rowNumber, columnNumber: props.columnNumber, value: e.target.value }))}
                autoComplete="off" />
        </td>
    )
}