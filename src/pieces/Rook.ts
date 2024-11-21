import { PieceType } from "./PieceType";

export default class Rook extends PieceType{
    isValidMove(newX: number, newY: number, occupied: bigint): boolean {
        const x: number = this.x;
        const y: number = this.y;

        if (!(this.isPathClean(newX, newY, occupied))) return false; 

        if (newX === x || newY === y) return true;

        return false;
    }

}