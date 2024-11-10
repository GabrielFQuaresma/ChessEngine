import { PieceType } from './PieceType';
import { colors } from "../components/Chessboard/Chessboard";

export default class Pawn extends PieceType{
    isValidMove(newX: number, newY: number): boolean {
        const x: number = this.x;
        const y: number = this.y;
        
        const yInitial: number = (this.color == colors.white) ? 1 : 6;

        if(y === yInitial){
            if(newX === x && newY <= y + 2) return true;
        }else{
            if(newX === x && newY <= y + 1) return true;
        }
        
        return false;
    }
}