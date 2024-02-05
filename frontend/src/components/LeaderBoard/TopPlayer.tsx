import Image from "next/image";

interface Players {
  Rank: number;
  avatar: string;
  coalitions: string;
  username: string;
  matchesPlayed: number;
  wins: number;
  score: number;
  eye: string;
}

export default function TopPlayer({Rank, avatar, coalitions, username, matchesPlayed, wins, score, eye}: Players) {
  return (
    <div className=" flex justify-center items-cente bg-[#FFFFFF]/15  h-[80px] rounded-md mb-2">
      <div className="flex justify-between items-center w-[95%]  h-full">
        <div className="flex justify-between w-[45%]">
          <p className=" text-3xl">{"#" + Rank}</p>
          <div className="flex gap-2 w-[290px] items-center h-[90%]">
            <div className="flex w-[40%] h-full items-center">
              <div className="flex rounded-full w-[50px] h-[50px] gap-2">
                <Image
                  src={avatar}
                  alt=""
                  width={800}
                  height={600}
                  className="object-cover w-full h-full rounded-full"
                />
                <Image
                  src={coalitions}
                  alt=""
                  width={800}
                  height={600}
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
            </div>

            <div>
              <p>{username}</p>
              <p>Freax</p>
            </div>
          </div>
          <div className="flex flex-col">
            <p>{matchesPlayed}</p>
            <p className="text-xs" >Matches Played</p>
          </div>
        </div>
        <div className="flex w-[41%] justify-between items-center ml-auto">
          <div className="flex flex-col">
            <p>{wins}</p>
            <p className="text-xs">Wins</p>
          </div>
          <div className="flex flex-col">
            <p>{score}</p>
            <p className="text-xs">Elo</p>
          </div>
          <div className="flex flex-col">
            <div className="w-[24px] h-[20px]">
              <Image
                src={eye}
                alt=""
                width={50}
                height={50}
                className="w-full h-full "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

