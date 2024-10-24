import "./Tile.css";

interface Props{
    coordinate: number;
    image?: string;
}

export default function Tile( { coordinate, image }: Props) {
    if (coordinate % 2 === 1){ 
        return (
        <div className="tile" id="white-tile"> 
            {image && <div style={{backgroundImage: `url(${image})`}} className="chess-piece"></div>}
        </div>);
    }

    return (<div className="tile" id="black-tile">
        {image && <div style={{backgroundImage: `url(${image})`}} className="chess-piece"></div>}
    </div>);
}