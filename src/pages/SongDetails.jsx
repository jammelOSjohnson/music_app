import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { DetailsHeader, Error, Loader, RelatedSongs } from "../components";

import { setActiveSong, playPause } from "../redux/features/playerSlice";
import {
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
  useGetTopChartsQuery,
} from "../redux/services/shazamCore";
import { useEffect, useState } from "react";

const SongDetails = () => {
  const dispatch = useDispatch();
  const { songid } = useParams();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const {
    data: chartData,
    isFetching: isFetchingChartDetails,
    error,
  } = useGetTopChartsQuery();
  const { data: songData, isFetching: isFetchingSongDetails } =
    useGetSongDetailsQuery({ songid });

  const {
    data,
    isFetching: isFetchingRelatedSongs,
    error: errorFetchingRelatedSong,
  } = useGetSongRelatedQuery({ songid });

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  const [coverArt, setCoverArt] = useState(null);
  const [lyrics, setLyrics] = useState(undefined);
  const [title, setTitle] = useState(null);
  const [subtitle, setSubtitle] = useState(null);
  const [artId, setArtId] = useState(null);

  // console.log(songid);

  // Accessing the first attribute in the first section

  useEffect(() => {
    console.log(chartData);
    console.log(songData);
    if (chartData !== null && chartData !== undefined) {
      console.log("data received");
      console.log(chartData);
      getCoverArt(chartData);
    }

    if (songData !== null && songData !== undefined) {
      console.log("songData received");
      console.log(songData);
      setLyrics(getFirstAttributeInFirstSection(songData?.resources?.lyrics));
    } else {
      setLyrics({});
    }
  }, [songData, chartData]);

  const getCoverArt = (data2) => {
    if (data2 !== undefined) {
      data2?.map((song) => {
        if (song.id === songid) {
          // console.log("song found");
          // console.log(song?.attributes?.artwork?.url);
          setCoverArt(song?.attributes?.artwork?.url);
          setTitle(song?.attributes?.name);
          setSubtitle(song?.attributes?.artistName);
          setArtId(song?.attributes?.relationships?.artists?.data[0]?.id);
        }
      });
    }

    return null;
  };

  // Function to get the first attribute in the first section found
  const getFirstAttributeInFirstSection = (obj) => {
    if (obj !== undefined && obj !== null) {
      const keys = Object.keys(obj);
      if (keys.length > 0) {
        const firstSectionKey = keys[0];
        const firstSection = obj[firstSectionKey];
        if (firstSection.attributes) {
          const attributeKeys = Object.keys(firstSection.attributes);
          if (attributeKeys.length > 0) {
            const firstAttributeKey = attributeKeys[0];
            return firstSection.attributes[firstAttributeKey];
          }
        }
      }
    }

    return null;
  };

  const isEmptyObject = (obj) => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  if (isFetchingSongDetails || isFetchingRelatedSongs || isFetchingChartDetails)
    return <Loader title="Searching song details" />;

  if (isFetchingSongDetails) return <Error />;

  return (
    <div className="flex flex-col">
      {coverArt ? (
        <DetailsHeader
          artistId=""
          songData={songData}
          coverArt={coverArt}
          title={title}
          subtitle={subtitle}
          artId={artId}
        />
      ) : (
        <></>
      )}

      <div className="mb-10">
        <h2 className="text-white text-3xl font-bold">Lyrics:</h2>

        <div className="mt-5">
          {lyrics !== "" && !isEmptyObject(lyrics) ? (
            lyrics?.map((Line, i) => (
              <p key={i} className="text-gray-45 text-base my-1">
                {Line}
              </p>
            ))
          ) : (
            <p className="text-gray-45 text-base my-1">
              Sorry, no lyrics found!
            </p>
          )}
        </div>
      </div>

      <RelatedSongs
        data={data}
        isPlaying={isPlaying}
        activeSong={activeSong}
        handlePauseClick={handlePauseClick}
        handlePlayClick={handlePlayClick}
      />
    </div>
  );
};

export default SongDetails;
