import { PieceType } from "./PieceType";

export default class King extends PieceType {
    isValidMove(newX: number, newY: number): boolean {
        const xDifference: number = Math.abs(this.x - newX);
        const yDifference: number = Math.abs(this.y - newY);

        if (xDifference <= 1 && yDifference <= 1) return true;

        return false;
    }
}