import { PieceType } from './PieceType';
import { PiecesName } from "../components/Chessboard/Chessboard";

export default class Pawn extends PieceType{
    isValidMove(newX: number, newY: number, occupied: bigint): boolean {
        const x: number = this.x;
        const y: number = this.y;
        
        const yInitial: number = (this.color === PiecesName.White) ? 1 : 6;

        if (!(this.isPathClean(newX, newY, occupied))) return false; 

        if(y === yInitial){
            if(newX === x && newY <= y + 2) return true;
        }else{
            if(newX === x && newY <= y + 1) return true;
        }
        
        return false;
    }

}