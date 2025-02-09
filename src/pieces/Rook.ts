import { PieceType } from "./PieceType";
import State from "../auxiliar/State";

export default class Rook extends PieceType {
    firstMove: boolean = true;

    isValidMove(newX: number, newY: number, currentState: State): boolean {
        const x: number = this.x;
        const y: number = this.y;

        const xDifference: number = Math.abs(x - newX);
        const yDifference: number = Math.abs(y - newY);

        const board = currentState.getBoard();

        if(!(currentState.isYourTurn(this.color))) return false;

        if (!(this.isPathClean(newX, newY, board))) return false; 

        if (xDifference === 0 || yDifference === 0) return true;

        return false;
    }

    canCastle(currentState: State): boolean {
        // Add rook-specific logic for castling here
        return false;
    }
}