import {PiecesName} from "../components/Chessboard/Chessboard"
import State from "../auxiliar/State";

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
    abstract isValidMove(newX: number, newY: number, currentState: State): boolean;

    // abstract isAnAttack(newX: number, newY: number, currentState: State): boolean;

    isPathClean(newX: number, newY: number, occupied: bigint): boolean {

        const directionRow = Math.sign(newY - this.y);
        const directionCol = Math.sign(newX - this.x);

        
        let currentRow = this.y + directionRow;
        let currentCol = this.x + directionCol;
        
        do {
            const bitPosition = 8 * currentRow + currentCol;
            const mask = BigInt(1) << BigInt(bitPosition);
            
            if ((occupied & mask) !== BigInt(0)) {
                return false; // Path is blocked
            }

            // Move to the next square in the direction
            currentRow += directionRow;
            currentCol += directionCol;
        } while ((currentRow !== (newY  + directionRow) || currentCol !== (newX + directionCol)));

        return true;
    }


}