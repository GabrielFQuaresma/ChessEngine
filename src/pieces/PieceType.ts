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

        // console.log("board: ");
        // const board = this.stringToBoardMatrix(occupied.toString(2));
        // board.forEach(row => console.log(row));
        // console.log("this.x = " + this.x + ", this.y = " + this.y)
        
        let currentRow = this.y + directionRow;
        let currentCol = this.x + directionCol;
        
        do {
            // console.log("currentRow: " + currentRow + ", currentCol: " + currentCol);
            // console.log("entrou");
            const bitPosition = 8 * currentRow + currentCol;
            const mask = BigInt(1) << BigInt(bitPosition);
            // console.log("mask: " + mask.toString(2).padStart(64, '0'));
            
            if ((occupied & mask) !== BigInt(0)) {
                return false; // Path is blocked
            }

            // Move to the next square in the direction
            currentRow += directionRow;
            currentCol += directionCol;
        } while ((currentRow !== (newY  + directionRow) || currentCol !== (newX + directionCol)));

        return true;
    }

    // stringToBoardMatrix(bitString:string) {
    //     // Garantir que a string tenha 64 bits, preenchendo com zeros à esquerda, se necessário
    //     const fullBitString = bitString.padStart(64, '0');
    //     const matrix = [];
        
    //     // Dividir a string em blocos de 8 bits para formar as linhas
    //     for (let i = 0; i < 64; i += 8) {
    //         const row = fullBitString.slice(i, i + 8).split('').map(Number); // Converter cada linha para um array de números
    //         matrix.push(row);
    //     }
        
    //     return matrix;
    // }

}