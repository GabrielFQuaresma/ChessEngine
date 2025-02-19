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

    isAnAttack(newX: number, newY: number, currentState: State): boolean {
        const x: number = this.x;
        const y: number = this.y;


        const Enemy: PiecesName = this.getEnemyColor();
        const yInitialEnemy: number = (Enemy === PiecesName.White) ? 1 : 6;
        const EnemyBoard: bigint = currentState.boards[Enemy];

        const validPosition: boolean = (newX === x + 1 || newX === x - 1) && (newY === y + 1 || newY === y - 1);
        
        console.log(currentState.boards[Enemy].toString(2).padStart(64).padEnd(64));
        
        if(validPosition){
            let mask = BigInt(1) << BigInt(8 * newY + newX);
            let haveAnEnemy: boolean = ((EnemyBoard & mask) !== BigInt(0));
            if (haveAnEnemy) return true;
            
            let validEnPassant = (yInitialEnemy + 1 === newY) || (yInitialEnemy - 1 === newY); 
            newY = (Enemy === PiecesName.White) ? newY + 1 : newY - 1;
            mask = BigInt(1) << BigInt( 8 * newY + newX);
            haveAnEnemy = ((EnemyBoard & mask) !== BigInt(0));
            if(validEnPassant && haveAnEnemy) return true;

        }
        
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

    getEnemyColor() : PiecesName{
        return (this.color === PiecesName.White) ? PiecesName.Black : PiecesName.White;
    }

}