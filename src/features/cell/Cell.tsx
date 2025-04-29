import "./Cell.css"
import type { JSX } from "react"
import type { CellCoords } from "../../models/CellCoords"
import type { CellState } from "../../models/CellState"

import {
    selectCell,
    updateCell,
    setActiveCell,
    deactivateCell
} from "./cellSlice"

import { useAppDispatch, useAppSelector } from "../../app/hooks"

export const Cell = (props: CellCoords): JSX.Element => {
    const dispatch = useAppDispatch()
    const cellInfo: CellState = useAppSelector((state) => selectCell(state, props.columnIndex, props.rowIndex));
    const isActive = cellInfo?.isActive ?? false;

    const handleCellClicked = (_e: React.MouseEvent<HTMLTableCellElement>) => {
        dispatch(setActiveCell({  columnIndex: props.columnIndex, rowIndex: props.rowIndex, } ));
    }

    const handleTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateCell({ coords: { columnIndex: props.columnIndex, rowIndex: props.rowIndex }, value: e.target.value }));
    }

    const handleKeyUp= (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            dispatch(deactivateCell());
        }
    } 

    return (
        <td onClick={handleCellClicked} className={isActive ? "active" : ""} id={`cell-${props.columnIndex.toString()}-${props.rowIndex.toString()}`}>
            {isActive ?
            (
                <input 
                    name="cellInput"
                    defaultValue={cellInfo?.literalValue}
                    onChange={handleTextChanged}
                    onKeyUp={handleKeyUp}
                    autoComplete="off"
                    autoFocus />
            ) : (
                <div className={`cell-type-${cellInfo?.valueType ?? "string"}`}>
                    {cellInfo?.displayValue}
                </div>
            )}
        </td>
    )
}