import React from 'react';

import './Chessboard.css'


//Position in array
enum Pieces {
    White = 0,
    Black = 1,
    WhitePawn = 2,
    WhiteKnight = 3,
    WhiteBishop = 4,
    WhiteRook = 5,
    WhiteQueen = 6,
    WhiteKing = 7,
    BlackPawn = 8,
    BlackKnight = 9,
    BlackBishop = 10,
    BlackRook = 11,
    BlackQueen = 12,
    BlackKing = 13
}
const enumLength = Object.keys(Pieces).length / 2; // Dividido por 2 porque enums têm chaves e valores

let bitboards: BigInt[] = new Array(enumLength).fill(BigInt(0)); 

const verticalAxis = [1, 2, 3, 4, 5, 6, 7, 8];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];


export default function Chessboard() {
    let board = [];

    for (let i = verticalAxis.length - 1; i >= 0; i--){
        for (let j = 0; j < horizontalAxis.length; j++) {
            const number = j + i;

            if (number % 2 == 1){
                board.push(<div className="tile white-tile"> </div>);
            }
            else{
                board.push(<div className="tile black-tile"> </div>);
            }
        }
    }
    return <div id="chessboard">{board}</div>
}