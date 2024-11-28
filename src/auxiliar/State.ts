import { colors } from "../components/Chessboard/Chessboard";
import { PiecesName } from "../components/Chessboard/Chessboard";

export default class State{
    boards: bigint[];
    currentTurn: colors;

    constructor(initialTurn: colors, boards: bigint[]) {
        this.boards = boards;
        this.currentTurn = initialTurn;
    }

    changeTurn(){
        this.currentTurn = (this.currentTurn === colors.white) ? colors.black : colors.white;
    }


    changeState(currentBoard: bigint[]){
        this.currentTurn = (this.currentTurn === colors.white) ? colors.black : colors.white;

    }

    getBoard(): bigint{
        return this.boards[PiecesName.White] | this.boards[PiecesName.Black];
    }

     private mapPieceColorToTurn(pieceColor: PiecesName): colors | null {
        if (pieceColor === PiecesName.White) return colors.white;
        if (pieceColor === PiecesName.Black) return colors.black;
        return null; // Handle unexpected cases if necessary
    }


    isYourTurn(pieceColor: PiecesName): boolean {
        const mappedColor = this.mapPieceColorToTurn(pieceColor);
        if (mappedColor === null) {
            throw new Error(`Invalid piece color: ${pieceColor}`);
        }
        return this.currentTurn === mappedColor;
    }
}