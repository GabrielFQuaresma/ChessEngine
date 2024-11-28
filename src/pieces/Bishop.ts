import { PieceType } from "./PieceType";

export default class Bishop extends PieceType{
    isValidMove(newX: number, newY: number, whiteboard: bigint, blackboard: bigint): boolean {
        const xDifference: number = Math.abs(this.x - newX);
        const yDifference: number = Math.abs(this.y - newY);

        const board = whiteboard | blackboard;

        if (!(this.isPathClean(newX, newY, board))) return false; 

        if (xDifference === yDifference) return true;

        return false;
    }

    
}   