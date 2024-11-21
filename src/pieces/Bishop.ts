import { PieceType } from "./PieceType";

export default class Bishop extends PieceType{
    isValidMove(newX: number, newY: number, occupied: bigint): boolean {
        const xDifference: number = Math.abs(this.x - newX);
        const yDifference: number = Math.abs(this.y - newY);

        if (!(this.isPathClean(newX, newY, occupied))) return false; 

        if (xDifference === yDifference) return true;

        return false;
    }

    
}   