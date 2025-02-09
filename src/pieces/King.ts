import State from "../auxiliar/State";
import { PieceType } from "./PieceType";
import { PiecesName } from "../components/Chessboard/Chessboard";
import Rook from "./Rook";

export default class King extends PieceType {
    firstMove: boolean = true;
    
    isValidMove(newX: number, newY: number, currentState: State): boolean {
        const xDifference: number = Math.abs(this.x - newX);
        const yDifference: number = Math.abs(this.y - newY);

        if(!(currentState.isYourTurn(this.color))) return false;

        if (xDifference <= 1 && yDifference <= 1) return true;

        if (this.isCastlingMove(newX, newY, currentState)) return true;

        return false;
    }

    private isCastlingMove(newX: number, newY: number, currentState: State): boolean {
        const yInitial: number = (this.color === PiecesName.White) ? 0 : 7;
        const rookX: number = (newX === 2) ? 0 : 7;
        const rook = currentState.getPieceAtPosition(rookX, yInitial);

        if (this.y === yInitial && newY === yInitial && (newX === 2 || newX === 6)) {
            if (rook && rook instanceof Rook && rook.color === this.color) {
                const pathClear = this.isPathClean(newX, newY, currentState.getBoard());
                if (pathClear) {
                    // Move the rook to its new position in the state
                    const newRookX = (newX === 2) ? 3 : 5;
                    currentState.movePiece(rook, newRookX, yInitial);
                    return true;
                }
            }
        }
        return false;
    }
}