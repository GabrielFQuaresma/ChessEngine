import { PieceType } from "./PieceType";

export default class Bishop extends PieceType{
    isValidMove(newX: number, newY: number): boolean {
        const xDifference: number = Math.abs(this.x - newX);
        const yDifference: number = Math.abs(this.y - newY);

        if (xDifference === yDifference) return true;

        return false;
    }
}