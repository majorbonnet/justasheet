import "./Cell.css"
import type { JSX } from "react"
import type { CellCoord } from "../../models/CellCoord"
import type { CellState } from "../../models/CellState"

import {
    selectPopulatedCell,
    updateCell,
    setActiveCell,
    deactivateCell
} from "../sheet/sheetSlice"
import { useAppDispatch, useAppSelector } from "../../app/hooks"

export const Cell = (props: CellCoord): JSX.Element => {
    const dispatch = useAppDispatch()
    const cellInfo: CellState = useAppSelector((state) => selectPopulatedCell(state, props.rowNumber, props.columnNumber));
    
    const literalValue = cellInfo?.literalValue;
    const displayValue = cellInfo?.displayValue
    const isActive = cellInfo?.isActive ?? false;

    const handleCellClicked = (_e: React.MouseEvent<HTMLTableCellElement>) => {
        dispatch(setActiveCell({ rowNumber: props.rowNumber, columnNumber: props.columnNumber, value: ""}));
    }

    const handleTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateCell({ rowNumber: props.rowNumber, columnNumber: props.columnNumber, value: e.target.value }));
    }

    const handleKeyUp= (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            dispatch(deactivateCell());
        }
    } 

    return (
        <td onClick={handleCellClicked} className={isActive ? "active" : ""}>
            {isActive ?
            (
                <input 
                    name="cellInput"
                    defaultValue={literalValue}
                    onChange={handleTextChanged}
                    onKeyUp={handleKeyUp}
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