import { createAppSlice } from "../../app/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { CellInfo } from "../../models/CellInfo"
import type { CellState } from "../../models/CellState"
import type { CellUpdate } from "../../models/CellUpdate"
import type { CellCoords } from "../../models/CellCoords"
import cellHandlerService from "../../services/cellHandlerService"

export type CellCollection = {
    cells: object
    activeCellId: string
}

let cells: object = {}

const cellsStr = localStorage.getItem('cells');
const savedActiveCell = localStorage.getItem('activeCell') ?? "";

if (cellsStr) {
    cells = JSON.parse(cellsStr) as object;
}

const initialState: CellCollection = {
    cells: cells,
    activeCellId: savedActiveCell
}

export const cellSlice = createAppSlice({
    name: 'cell',
    initialState,
    reducers: create => ({
        updateCell: create.reducer(
            (state, action: PayloadAction<CellUpdate>) => {
                const cellId = cellHandlerService.getCellId(action.payload.coords.columnIndex, action.payload.coords.rowIndex);
                const cellState: CellState = state.cells[cellId as keyof typeof state.cells];

                state.cells = { ...state.cells, [cellId]: cellHandlerService.getUpdatedCellState(cellState, action.payload.value) };
                localStorage.setItem('populatedCells', JSON.stringify(state.cells));
            },
        ),
        setActiveCell: create.reducer(
            (state, action: PayloadAction<CellCoords>) => {
                if (state.activeCellId !== "")
                {
                    const currentActiveCellState: CellState = state.cells[state.activeCellId as keyof typeof state.cells];
                    state.cells = { ...state.cells, [state.activeCellId]: { ...currentActiveCellState as CellInfo, isActive: false }};
                }

                state.activeCellId = cellHandlerService.getCellId(action.payload.columnIndex, action.payload.rowIndex);
                let newActiveCellState: CellState = state.cells[state.activeCellId as keyof typeof state.cells];

                if (typeof newActiveCellState === "undefined") {
                    newActiveCellState = cellHandlerService.getNewCellInfo({ coords: action.payload, value: "" });
                } 

                state.cells = { ...state.cells, [state.activeCellId]: { ...newActiveCellState, isActive: true }};

                localStorage.setItem('activeCell', state.activeCellId);
                localStorage.setItem('cells', JSON.stringify(state.cells));
            }
        ),
        deactivateCell: create.reducer(
            (state) => {
                if (state.activeCellId !== "") {
                    const newActiveCellState: CellState = state.cells[state.activeCellId as keyof typeof state.cells];
                    
                    if (typeof newActiveCellState !== "undefined") {                 
                        state.cells = { ...state.cells, [state.activeCellId]: { ...newActiveCellState as CellInfo, isActive: false }};
                    }

                    state.activeCellId = "";

                    localStorage.setItem('activeCell', state.activeCellId);
                    localStorage.setItem('cells', JSON.stringify(state.cells));
                }
            }
        )
    }),
    selectors: {
        selectPopulatedCell: (cellCollection: CellCollection, columnIndex: number, rowIndex: number) : CellState => {
            const cellId = cellHandlerService.getCellId(columnIndex, rowIndex);
            const cell: CellState = cellCollection.cells[cellId as keyof typeof cellCollection.cells];

            return cell;
        },
        selectCellById: (cellCollection: CellCollection, cellId: string) : CellState => {
            const cell: CellState = cellCollection.cells[cellId as keyof typeof cellCollection.cells];

            return cell;            
        },
        selectActiveCellId: (cellCollection: CellCollection) : string => {
            return cellCollection.activeCellId;
        }
    }
});

export const { updateCell, setActiveCell, deactivateCell } = cellSlice.actions
export const { selectPopulatedCell, selectCellById, selectActiveCellId } = cellSlice.selectors

