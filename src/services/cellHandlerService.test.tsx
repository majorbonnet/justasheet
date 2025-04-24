import type { CellUpdate } from "../models/CellUpdate";
import cellHandlerService from "./cellHandlerService";

const testColumnLabels = [
    { columnIndex: 0, label: "A" },
    { columnIndex: 25, label: "Z" },
    { columnIndex: 51, label: "ZZ" },
    { columnIndex: 84, label: "GGGG" }
];

const testCellCoordinates = [
    { columnIndex: 0, rowIndex: 0, cellId: "A1" },
    { columnIndex: 84, rowIndex: 10, cellId: "GGGG11" },
    { columnIndex: 50, rowIndex: 640, cellId: "YY641" },
]

describe("getColumnLabel", () => {
    it("should return correct characters for column index", () => {
        testColumnLabels.forEach(({ columnIndex, label }) => {
            expect(cellHandlerService.getColumnLabel(columnIndex)).toBe(label);
        });
    });
})

describe("getCellId", () => {
    it("should return the correct id string for for indexes", () => {
        testCellCoordinates.forEach(({ columnIndex, rowIndex, cellId}) => {
            expect(cellHandlerService.getCellId(columnIndex, rowIndex)).toBe(cellId);
        });
    });
});

describe("getNewCellInfo", () => {
    it("should return a CellInfo with the correct initial values", () => {
        const cellValue = "test value";
    
        const update: CellUpdate = { coords: { columnIndex: 2, rowIndex: 4 }, value: cellValue };
        const newCellInfo = cellHandlerService.getNewCellInfo(update);
    
        expect(newCellInfo).toBeDefined();
        expect(newCellInfo.literalValue).toBe(cellValue);
        expect(newCellInfo.cellId).toBe("C5");
    })
});

describe("getUpdatedCellState", () => {
    it("should return a new CellInfo with correct values if non-empty string is passed", () => {
        const cellValue = "new test value";
    
        const update: CellUpdate = { coords: { columnIndex: 2, rowIndex: 4 }, value: "" };
        const cellInfo = cellHandlerService.getNewCellInfo(update);  
        
        const updatedCellInfo = cellHandlerService.getUpdatedCellState(cellInfo, cellValue);
    
        expect(updatedCellInfo).toBeDefined();
        expect(updatedCellInfo?.literalValue).toBe(cellValue);
    })
    
    it("should return undefined if an empty string is passed", () => {
        const update: CellUpdate = { coords: { columnIndex: 2, rowIndex: 4 }, value: "" };
        const cellInfo = cellHandlerService.getNewCellInfo(update);  
        
        const updatedCellInfo = cellHandlerService.getUpdatedCellState(cellInfo, "");
    
        expect(updatedCellInfo).toBeUndefined();
    });
});
