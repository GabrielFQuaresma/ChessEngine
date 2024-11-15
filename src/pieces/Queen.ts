import { PieceType } from "./PieceType";

export default class Queen extends PieceType{
    isValidMove(newX: number, newY: number): boolean {
        const x: number = this.x;
        const y: number = this.y;

        const xDifference: number = Math.abs(x - newX);
        const yDifference: number = Math.abs(y - newY);

        if (xDifference === yDifference) return true;

        else if (newX === x || newY === y) return true;

        return false;

    }
}