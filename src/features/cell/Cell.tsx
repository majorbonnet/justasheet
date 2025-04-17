import "./Cell.css"
import type { JSX } from "react"
import type { CellCoord, CellState } from "../sheet/sheetSlice"
import {
    selectPopulatedCell,
    updateCell,
    setActiveCell
} from "../sheet/sheetSlice"
import { useAppDispatch, useAppSelector } from "../../app/hooks"

export const Cell = (props: CellCoord): JSX.Element => {
    const dispatch = useAppDispatch()
    const populatedCell: CellState = useAppSelector((state) => selectPopulatedCell(state, props.rowNumber, props.columnNumber));
    const displayValue = populatedCell?.literalValue
    const isActive = populatedCell?.isActive ?? false;

    console.log(`Cell ${props.rowNumber.toString()}:${props.columnNumber.toString()} isActive: ${isActive.toString()}`)

    return (
        <td onClick={_e => dispatch(setActiveCell({ rowNumber: props.rowNumber, columnNumber: props.columnNumber, value: ""}))}>
            {isActive ?
            (
                <input 
                    name="cellInput"
                    defaultValue={displayValue}
                    onChange={e => dispatch(updateCell({ rowNumber: props.rowNumber, columnNumber: props.columnNumber, value: e.target.value }))}
                    autoComplete="off"
                    autoFocus />
            ) : (
                <div>
                    {displayValue}
                </div>
            )}
        </td>
    )
}