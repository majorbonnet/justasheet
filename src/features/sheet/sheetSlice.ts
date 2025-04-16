import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

export type CellCoord = {
    rowNumber: number
    columnNumber: number
}

export type PopulatedCell = {
    literalValue: string
    valueType: string
    referencedBy: CellCoord[]
}

export type CellState = PopulatedCell | undefined

export type Cell = {
    rowNumber: number;
    columnNumber: number;
    value: string
}

export type Sheet = {
    populatedCells: object
}

let populatedCells: object = {}
const savedStateStr = localStorage.getItem('populatedCells');

if (savedStateStr) {
    populatedCells = JSON.parse(savedStateStr) as object;
}

const initialState: Sheet = {
    populatedCells: populatedCells
}

export const sheetSlice = createAppSlice({
    name: 'sheet',
    initialState,
    reducers: create => ({
        updateCell: create.reducer(
            (state, action: PayloadAction<Cell>) => {
                const cellId = `${action.payload.rowNumber.toString()}:${action.payload.columnNumber.toString()}`  
                const cellState: CellState = state.populatedCells[cellId as keyof typeof state.populatedCells];
                console.log(`Updated cell ${action.payload.rowNumber.toString()}:${action.payload.columnNumber.toString()} to ${action.payload.value}`);

                state.populatedCells = { ...state.populatedCells, [cellId]: getNewCellStateFromLiteralValue(cellState, action.payload.value) };
                localStorage.setItem('populatedCells', JSON.stringify(state.populatedCells));
            },
          ),
    }),
    selectors: {
        selectPopulatedCell: (sheet: Sheet, rowNumber: number, columnNumber: number) : CellState => {
            const cellId = `${rowNumber.toString()}:${columnNumber.toString()}`
            const cell: CellState = sheet.populatedCells[cellId as keyof typeof sheet.populatedCells];

            return cell;
        }
    }
});

function getNewCellStateFromLiteralValue(currentState: CellState, literalValue: string) : CellState {
    // no cell value and the cell is not referenced by any other cell, we can remove the value
    if (literalValue === "" && 
        typeof currentState !== "undefined" &&
        currentState.referencedBy.length == 0
    ) return undefined;

    let newState: CellState;

    if (typeof currentState === "undefined") {
        newState =  { literalValue: literalValue, valueType: getValueTypeFromLiteralValue(literalValue), referencedBy: []}
    }
    else {
        newState = { ...currentState, literalValue: literalValue, valueType: getValueTypeFromLiteralValue(literalValue) }
    }

    return newState;
}

function getValueTypeFromLiteralValue(_literalValue: string) {
    return "string";
}


export const { updateCell } = sheetSlice.actions
export const { selectPopulatedCell } = sheetSlice.selectors

