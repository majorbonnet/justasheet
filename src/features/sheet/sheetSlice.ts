import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

export type CellCoord = {
    rowNumber: number
    columnNumber: number
}

export type PopulatedCell = {
    literalValue: string
    valueType: string
    referencedBy: NonNullable<CellCoord[]>
    isActive: NonNullable<boolean>
}

export type CellState = PopulatedCell | undefined

export type Cell = {
    rowNumber: number
    columnNumber: number
    value: string
}

export type Sheet = {
    populatedCells: object
    activeCell: string
}

let populatedCells: object = {}
const savedStateStr = localStorage.getItem('populatedCells');

if (savedStateStr) {
    populatedCells = JSON.parse(savedStateStr) as object;
}

const initialState: Sheet = {
    populatedCells: populatedCells,
    activeCell: ""
}

export const sheetSlice = createAppSlice({
    name: 'sheet',
    initialState,
    reducers: create => ({
        updateCell: create.reducer(
            (state, action: PayloadAction<Cell>) => {
                const cellId = `${action.payload.rowNumber.toString()}:${action.payload.columnNumber.toString()}`  
                const cellState: CellState = state.populatedCells[cellId as keyof typeof state.populatedCells];

                state.populatedCells = { ...state.populatedCells, [cellId]: getNewCellStateFromLiteralValue(cellState, action.payload.value) };
                localStorage.setItem('populatedCells', JSON.stringify(state.populatedCells));
            },
        ),
        setActiveCell: create.reducer(
            (state, action: PayloadAction<Cell>) => {
                if (state.activeCell !== "")
                {
                    const currentActiveCellState: CellState = state.populatedCells[state.activeCell as keyof typeof state.populatedCells];
                    state.populatedCells = { ...state.populatedCells, [state.activeCell]: { ...currentActiveCellState as PopulatedCell, isActive: false }};
                }

                state.activeCell = `${action.payload.rowNumber.toString()}:${action.payload.columnNumber.toString()}`; 
                let newActiveCellState: CellState = state.populatedCells[state.activeCell as keyof typeof state.populatedCells];

                if (typeof newActiveCellState === "undefined") {
                    newActiveCellState = { literalValue: "", valueType: getValueTypeFromLiteralValue(""), referencedBy: [], isActive: true };
                } 

                console.log(`Setting active cell to ${state.activeCell}`);

                state.populatedCells = { ...state.populatedCells, [state.activeCell]: { ...newActiveCellState, isActive: true }};
            }
        )
    }),
    selectors: {
        selectPopulatedCell: (sheet: Sheet, rowNumber: number, columnNumber: number) : CellState => {
            const cellId = `${rowNumber.toString()}:${columnNumber.toString()}`
            const cell: CellState = sheet.populatedCells[cellId as keyof typeof sheet.populatedCells];

            return cell;
        }
    }
});

function getNewCellStateFromLiteralValue(currentState: PopulatedCell, literalValue: string) : CellState {
    // no cell value and the cell is not referenced by any other cell, we can remove the value
    if (literalValue === "" && 
        typeof currentState !== "undefined" &&
        currentState.referencedBy.length == 0
    ) return undefined;

    const newState: PopulatedCell = { ...currentState, 
        literalValue: literalValue, 
        valueType: getValueTypeFromLiteralValue(literalValue) }

    return newState;
}

function getValueTypeFromLiteralValue(_literalValue: string) {
    return "string";
}


export const { updateCell, setActiveCell } = sheetSlice.actions
export const { selectPopulatedCell } = sheetSlice.selectors

