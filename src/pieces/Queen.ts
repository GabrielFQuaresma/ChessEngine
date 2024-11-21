import { PieceType } from "./PieceType";

export default class Queen extends PieceType{
    isValidMove(newX: number, newY: number, occupied: bigint): boolean {
        const x: number = this.x;
        const y: number = this.y;

        const xDifference: number = Math.abs(x - newX);
        const yDifference: number = Math.abs(y - newY);

        if (!(this.isPathClean(newX, newY, occupied))) return false; 

        if (xDifference === yDifference) return true;

        else if (newX === x || newY === y) return true;

        return false;

    }

}