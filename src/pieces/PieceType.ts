import {colors} from "../components/Chessboard/Chessboard"

export abstract class PieceType{
    x: number;
    y: number;
    image: string;
    color: colors; //0 it means white, and 1 it means black
  
    constructor(x: number, y: number, image: string, color: colors) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.image = image;
    }
  
    // Método abstrato a ser implementado em subclasses
    abstract isValidMove(newX: number, newY: number, occupied: bigint): boolean;

    // abstract isPathClean(newX: number, newY: number, occupied: bigint): boolean;

}