import { PieceType } from "./PieceType";

export default class Rook extends PieceType{
    isValidMove(newX: number, newY: number): boolean {
        const x: number = this.x;
        const y: number = this.y;

        if (newX === x || newY === y) return true;

        return false;
    }
}