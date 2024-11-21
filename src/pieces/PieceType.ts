import {PiecesName} from "../components/Chessboard/Chessboard"

export abstract class PieceType{
    x: number;
    y: number;
    image: string;
    color: PiecesName; //0 it means white, and 1 it means black
    type: PiecesName;
  
    constructor(x: number, y: number, image: string, color: PiecesName, type: PiecesName) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.color = color;
        this.type = type;
    }
  
    // Método abstrato a ser implementado em subclasses
    abstract isValidMove(newX: number, newY: number, occupied: bigint): boolean;

    isPathClean(newX: number, newY: number, occupied: bigint): boolean {

        const directionRow = Math.sign(newY - this.y);
        const directionCol = Math.sign(newX - this.x);

        console.log("board: " + occupied.toString(2).padEnd(64, '0'));

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