import { PieceType } from "./PieceType";

export default class Rook extends PieceType{
    isValidMove(newX: number, newY: number, whiteboard: bigint, blackboard: bigint): boolean {
        const x: number = this.x;
        const y: number = this.y;

        const board = whiteboard | blackboard;

        if (!(this.isPathClean(newX, newY, board))) return false; 

        if (newX === x || newY === y) return true;

        return false;
    }

}