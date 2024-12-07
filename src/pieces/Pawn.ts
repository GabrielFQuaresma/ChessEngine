import { PieceType } from './PieceType';
import { PiecesName } from "../components/Chessboard/Chessboard";
import State from "../auxiliar/State";

export default class Pawn extends PieceType{
    isValidMove(newX: number, newY: number, currentState: State): boolean {
        const x: number = this.x;
        const y: number = this.y;
        
        const yInitial: number = (this.color === PiecesName.White) ? 1 : 6;
        const board = currentState.getBoard();

        console.log("y: " + y + " newY: " + newY );

        if(this.isAnAttack(newX, newY, currentState)) return true;

        if(!(currentState.isYourTurn(this.color))) return false;

        if (!(this.isPathClean(newX, newY, board))) return false; 

        if (newX === x) {
            const maxMove = (y === yInitial) ? 2 : 1; // Pode mover até 2 casas na posição inicial, senão apenas 1.
            
            if (this.color === PiecesName.White) {
                if (newY <= y + maxMove) return true; // Movimento para frente (brancas).
            } else {
                if (newY >= y - maxMove) return true; // Movimento para frente (pretas).
            }
        }
        
        return false;
    }


}