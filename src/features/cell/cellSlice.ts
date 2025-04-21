import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { CellInfo } from "../../models/CellInfo"
import type { CellState } from "../../models/CellState"

import cellHandlerService from "../../services/cellHandlerService"

export type CellUpdate = {
    rowNumber: number
    columnNumber: number
    value: string
}

export type CellCollection = {
    cells: object
    activeCell: string
}

let cells: object = {}

const cellsStr = localStorage.getItem('cells');
const savedActiveCell = localStorage.getItem('activeCell') ?? "";

if (cellsStr) {
    cells = JSON.parse(cellsStr) as object;
}

const initialState: CellCollection = {
    cells: cells,
    activeCell: savedActiveCell
}

export const cellSlice = createAppSlice({
    name: 'cell',
    initialState,
    reducers: create => ({
        updateCell: create.reducer(
            (state, action: PayloadAction<CellUpdate>) => {
                const cellId = `${action.payload.rowNumber.toString()}:${action.payload.columnNumber.toString()}`  
                const cellState: CellState = state.cells[cellId as keyof typeof state.cells];

                state.cells = { ...state.cells, [cellId]: cellHandlerService.getUpdatedCellInfo(cellState, action.payload.value) };
                localStorage.setItem('populatedCells', JSON.stringify(state.cells));
            },
        ),
        setActiveCell: create.reducer(
            (state, action: PayloadAction<CellUpdate>) => {
                if (state.activeCell !== "")
                {
                    const currentActiveCellState: CellState = state.cells[state.activeCell as keyof typeof state.cells];
                    state.cells = { ...state.cells, [state.activeCell]: { ...currentActiveCellState as CellInfo, isActive: false }};
                }

                state.activeCell = `${action.payload.rowNumber.toString()}:${action.payload.columnNumber.toString()}`; 
                let newActiveCellState: CellState = state.cells[state.activeCell as keyof typeof state.cells];

                if (typeof newActiveCellState === "undefined") {
                    newActiveCellState = cellHandlerService.getNewCellInfo("");
                } 

                state.cells = { ...state.cells, [state.activeCell]: { ...newActiveCellState, isActive: true }};

                localStorage.setItem('activeCell', state.activeCell);
                localStorage.setItem('cells', JSON.stringify(state.cells));
            }
        ),
        deactivateCell: create.reducer(
            (state) => {
                if (state.activeCell !== "") {
                    const newActiveCellState: CellState = state.cells[state.activeCell as keyof typeof state.cells];
                    
                    if (typeof newActiveCellState !== "undefined") {                 
                        state.cells = { ...state.cells, [state.activeCell]: { ...newActiveCellState as CellInfo, isActive: false }};
                    }

                    state.activeCell = "";

                    localStorage.setItem('activeCell', state.activeCell);
                    localStorage.setItem('cells', JSON.stringify(state.cells));
                }
            }
        )
    }),
    selectors: {
        selectPopulatedCell: (cellCollection: CellCollection, rowNumber: number, columnNumber: number) : CellState => {
            const cellId = `${rowNumber.toString()}:${columnNumber.toString()}`;
            const cell: CellState = cellCollection.cells[cellId as keyof typeof cellCollection.cells];

            return cell;
        }
    }
});

export const { updateCell, setActiveCell, deactivateCell, } = cellSlice.actions
export const { selectPopulatedCell } = cellSlice.selectors

