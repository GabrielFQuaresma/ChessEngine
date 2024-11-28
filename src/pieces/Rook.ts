import { PieceType } from "./PieceType";
import State from "../auxiliar/State";

export default class Rook extends PieceType{
    isValidMove(newX: number, newY: number, currentState: State): boolean {
        const x: number = this.x;
        const y: number = this.y;

        const board = currentState.getBoard();

        if(!(currentState.isYourTurn(this.color))) return false;

        if (!(this.isPathClean(newX, newY, board))) return false; 

        if (newX === x || newY === y) return true;

        return false;
    }

}