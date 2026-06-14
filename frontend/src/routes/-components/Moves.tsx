export function Moves({ moves }: { moves: string[] }) {


    const pairs = moves.reduce<string[][]>((acc, move, index) => {
        if (index % 2 === 0) {
            acc.push([move]);
        } else {
            acc[acc.length - 1].push(move);
        }
        return acc;
    }, []);
  return <div className="w-[240px]">
    <h2 className="text-2xl font-bold">Moves</h2>
    <div className="flex flex-col gap-1 mt-2">
      {pairs.map((pair,index)=>(
        <div key ={index} className="flex gap-4">
            <span className="text-gray-400">{index + 1}.</span>
            <span>{pair[0]}</span>
            <span>{pair[1] ?? ""}</span>


        </div>
      ))}
    </div>
    </div>
}