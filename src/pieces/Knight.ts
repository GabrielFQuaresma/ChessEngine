import { PieceType } from "./PieceType";
import State from "../auxiliar/State";

export default class Knight extends PieceType{
    isValidMove(newX: number, newY: number, currentState: State): boolean {
        const x: number = this.x;
        const y: number = this.y;

        if(!(currentState.isYourTurn(this.color))) return false;

        if (newY === y + 2 || newY === y - 2){
          if (newX === x + 1 || newX === x - 1) return true;
        }
        else if (newX === x + 2 || newX === x - 2){
            if (newY === y + 1 || newY === y - 1) return true;
        } 

        return false;
    }

}