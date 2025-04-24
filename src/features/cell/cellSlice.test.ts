import type { AppStore } from "../../app/store"
import { makeStore } from "../../app/store"
import type { CellCollection } from "./cellSlice" 

import cellHandlerService from "../../services/cellHandlerService"

import {
    updateCell, 
    setActiveCell, 
    deactivateCell,
    selectCellById,
    selectActiveCellId,
    cellSlice
} from "./cellSlice"

type CellSliceTestContext = {
    store: AppStore
}

describe("cellSlice reducer", () => {
    beforeEach<CellSliceTestContext>(context => {
        const activeCell = cellHandlerService.getNewCellInfo({ coords: { columnIndex: 0, rowIndex: 4 }, value: "my cell value"});
        activeCell.isActive = true;

        const initialState: CellCollection = {
            activeCellId: "A5",
            cells: {
                "A5": activeCell,
                "B5": cellHandlerService.getNewCellInfo({ coords: { columnIndex: 1, rowIndex: 4 }, value: "my second cell value"}),  
                "K11": cellHandlerService.getNewCellInfo({ coords: { columnIndex: 10, rowIndex: 10 }, value: "my third cell value"}),              
            }
        }

        console.log(initialState);

        const store = makeStore({ cell: initialState });
        context.store = store;
    });

    it("should handle initial state", () => {
        expect(cellSlice.reducer(undefined, { type: "unknown" })).toStrictEqual({
            activeCellId: "",
            cells: {}
        });
    });

    it<CellSliceTestContext>("should handle deactivating the active cell", ({ store }) => {
        expect(selectActiveCellId(store.getState())).toBe("A5");
        expect(selectCellById(store.getState(), "A5")?.isActive).toBeTruthy();

        store.dispatch(deactivateCell());

        expect(selectActiveCellId(store.getState())).toBe("");
        expect(selectCellById(store.getState(), "A5")?.isActive).toBeFalsy();
    });

    it<CellSliceTestContext>("should handle switching the active cell", ({ store }) => {
        expect(selectActiveCellId(store.getState())).toBe("A5");
        expect(selectCellById(store.getState(), "A5")?.isActive).toBeTruthy();

        store.dispatch(setActiveCell({ columnIndex: 3, rowIndex: 5 }));

        expect(selectActiveCellId(store.getState())).toBe("D6");
        expect(selectCellById(store.getState(), "D6")?.isActive).toBeTruthy();
        expect(selectCellById(store.getState(), "A5")?.isActive).toBeFalsy();
    });

    it<CellSliceTestContext>("should update a cell value", ({ store }) => {
        const newCellValue = "my updated cell value";
        expect(selectCellById(store.getState(), "A5")?.literalValue).toBe("my cell value");

        store.dispatch(updateCell({ coords: {columnIndex: 0, rowIndex: 4 }, value: newCellValue }));

        expect(selectCellById(store.getState(), "A5")?.literalValue).toBe(newCellValue);
    });
});
