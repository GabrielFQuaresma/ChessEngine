import { PieceType } from "./PieceType";
import State from "../auxiliar/State";


export default class Queen extends PieceType{
    isValidMove(newX: number, newY: number, currentState: State): boolean {
        const x: number = this.x;
        const y: number = this.y;

        const xDifference: number = Math.abs(x - newX);
        const yDifference: number = Math.abs(y - newY);


        const board = currentState.getBoard();

        if (!(this.isPathClean(newX, newY, board))) return false; 

        if (xDifference === yDifference) return true;

        else if (newX === x || newY === y) return true;

        return false;

    }

}