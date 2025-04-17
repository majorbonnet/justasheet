import type { CellState } from "../models/CellState";
import type { CellInfo } from "../models/CellInfo";

const getNewCellInfo = (literalValue: string) : CellState => {
    return {
        literalValue: literalValue,
        displayValue: getDisplayValue(literalValue),
        valueType: "",
        isActive: false,
        referencedBy: []
    };
}

const getUpdatedCellInfo = (currentState: CellInfo, literalValue: string) : CellState => {
    // no cell value and the cell is not referenced by any other cell, we can remove the value
    if (literalValue === "" && 
        typeof currentState !== "undefined" &&
        currentState.referencedBy.length == 0
    ) return undefined;

    const newState: CellInfo = { ...currentState, 
        literalValue: literalValue, 
        displayValue: getDisplayValue(literalValue) }

    return newState;
}

const getDisplayValue = (literalValue: string) => {
    if (!literalValue) return "";

    if (literalValue.startsWith("=")) {
        return "FORMULA";
    }

    return literalValue;
}


export default {
    getNewCellInfo,
    getUpdatedCellInfo
} 