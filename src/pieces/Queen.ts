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

    isPathClean(newX: number, newY: number, occupied: bigint): boolean {

        const directionRow = Math.sign(newY - this.y);
        const directionCol = Math.sign(newX - this.x);

        let currentRow = this.y + directionRow;
        let currentCol = this.x + directionCol;

        while (currentRow !== newY || currentCol !== newX) {
            const bitPosition = 8 * currentRow + currentCol;
            const mask = BigInt(1) << BigInt(bitPosition);
            
            if ((occupied & mask) !== BigInt(0)) {
                return false; // Path is blocked
            }

            // Move to the next square in the direction
            currentRow += directionRow;
            currentCol += directionCol;
        }

        return true;
    }
}