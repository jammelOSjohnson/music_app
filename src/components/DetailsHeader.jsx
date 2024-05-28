import { Link } from "react-router-dom";

const DetailsHeader = ({
  artistId,
  artistData,
  songData,
  coverArt,
  title,
  subtitle,
  artId,
}) => {
  const artist = artistData?.artists[artistId]?.attributes;
  const songGenreKeys = Object.keys(songData?.resources?.genres);

  const songGenres = songGenreKeys.map((key) => {
    return songData?.resources?.genres[key];
  });

  if (
    coverArt !== null &&
    title !== null &&
    subtitle !== null &&
    artId !== null
  )
    return (
      <div className="relative w-full flex flex-col">
        <div className="w-full bg-gradient-to-l from-transparent to-black sm:h-48 h28" />

        <div className="absolute inset-0 flex items-center">
          <img
            alt="art"
            src={
              artistId
                ? artist?.artwork?.url
                    .replace("{w}", "500")
                    .replace("{h}", "500")
                : coverArt
            }
            className="sm:w-48 w-28 sm:h-48 h-28 rounded-full 
            object-cover border-2 shadow-xl shadow-black"
          />

          <div className="ml-5">
            <p className="font-bold sm:text-3xl text-xl text-white">
              {artistId ? artist.name : title}
            </p>
            {!artistId && (
              <Link to={`/artists/${artId}`}>
                <p className="text-base text-gray-400 mt-2">{subtitle}</p>
              </Link>
            )}

            <p className="text-base text-gray-400 mt-2">
              {artistId
                ? artist?.genreNames[0]
                : songGenres[0]?.attributes?.name}
            </p>
          </div>
        </div>
      </div>
    );
  else
    return (
      <div className="relative w-full flex flex-col">
        <div className="w-full bg-gradient-to-l from-transparent to-black sm:h-48 h28" />

        <div className="absolute inset-0 flex items-center">
          <img
            alt="art"
            src={
              artistId
                ? artistData?.artists[artistId].attributes?.artwork?.url
                    .replace("{w}", "500")
                    .replace("{h}", "500")
                : ""
            }
          />
        </div>
      </div>
    );
};

export default DetailsHeader;
