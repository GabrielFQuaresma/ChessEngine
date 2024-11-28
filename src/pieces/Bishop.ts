import { PieceType } from "./PieceType";
import State from "../auxiliar/State";

export default class Bishop extends PieceType{
    isValidMove(newX: number, newY: number, currentState: State): boolean {
        const xDifference: number = Math.abs(this.x - newX);
        const yDifference: number = Math.abs(this.y - newY);

        const board = currentState.getBoard();

        if (!(this.isPathClean(newX, newY, board))) return false; 

        if (xDifference === yDifference) return true;

        return false;
    }

    
}   